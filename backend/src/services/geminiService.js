/**
 * Gemini AI Service
 * Provides AI-powered shipping insights, product recommendations,
 * and natural language queries using Google's Gemini API.
 *
 * Design Pattern: Singleton + Strategy (prompt templates)
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../db/pool');

class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️  GEMINI_API_KEY not set — AI features disabled');
            this.enabled = false;
            return;
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        this.enabled = true;
    }

    /**
     * Build a context string with live database stats to ground the AI.
     */
    async _getBusinessContext() {
        try {
            const [customers, sellers, products, warehouses, orders] = await Promise.all([
                pool.query('SELECT COUNT(*) AS count FROM customers'),
                pool.query('SELECT COUNT(*) AS count FROM sellers'),
                pool.query('SELECT COUNT(*) AS count FROM products'),
                pool.query('SELECT COUNT(*) AS count FROM warehouses'),
                pool.query('SELECT COUNT(*) AS count FROM orders'),
            ]);

            const topProducts = await pool.query(
                `SELECT p.name, p.price, p.weight_kg, s.name AS seller_name
                 FROM products p JOIN sellers s ON p.seller_id = s.id
                 ORDER BY p.price DESC LIMIT 5`
            );

            const warehouseList = await pool.query(
                `SELECT name, city, state FROM warehouses WHERE is_active = true ORDER BY name`
            );

            return `
BUSINESS CONTEXT (live data from Jumbotail B2B Marketplace):
- ${customers.rows[0].count} Kirana store customers
- ${sellers.rows[0].count} sellers/suppliers
- ${products.rows[0].count} products in catalog
- ${warehouses.rows[0].count} warehouses across India
- ${orders.rows[0].count} orders placed

Warehouses: ${warehouseList.rows.map(w => `${w.name} (${w.city}, ${w.state})`).join(', ')}

Top products by price:
${topProducts.rows.map(p => `  - ${p.name} by ${p.seller_name}: ₹${p.price}, ${p.weight_kg}kg`).join('\n')}

SHIPPING RULES:
  Transport Mode | Distance     | Rate
  Mini Van       | 0–100 km     | ₹3 per km per kg
  Truck          | 100–500 km   | ₹2 per km per kg
  Aeroplane      | 500+ km      | ₹1 per km per kg

  Standard delivery: ₹10 courier + shipping
  Express delivery:  ₹10 courier + ₹1.2/kg extra + shipping
`;
        } catch (err) {
            return 'Business context unavailable.';
        }
    }

    /**
     * Retry a function with exponential backoff (for rate limits).
     */
    async _retry(fn, retries = 2, delayMs = 2000) {
        for (let i = 0; i <= retries; i++) {
            try {
                return await fn();
            } catch (err) {
                if (i === retries || !err.message?.includes('429') && !err.message?.includes('Resource has been exhausted')) throw err;
                console.log(`⏳ Gemini rate limited, retrying in ${delayMs / 1000}s...`);
                await new Promise(r => setTimeout(r, delayMs));
                delayMs *= 2;
            }
        }
    }

    /**
     * Chat with Gemini about shipping, products, or the platform.
     * @param {string} userMessage - User's question
     * @param {Array} history - Previous messages [{role, text}]
     * @returns {Object} { reply, suggestions }
     */
    async chat(userMessage, history = []) {
        if (!this.enabled) {
            return {
                reply: 'AI features are not available. Please configure the GEMINI_API_KEY.',
                suggestions: [],
            };
        }

        const context = await this._getBusinessContext();

        const systemPrompt = `You are the Jumbotail AI Assistant — a helpful, friendly expert on B2B e-commerce logistics and the Jumbotail marketplace platform.

${context}

INSTRUCTIONS:
- Answer questions about shipping charges, warehouses, products, sellers, customers, and logistics.
- When discussing shipping costs, show the calculation breakdown.
- Be concise but thorough. Use bullet points and ₹ for Indian Rupees.
- If asked about specific entities, reference the real data above.
- Suggest relevant follow-up questions the user might ask.
- Keep responses professional and aligned with Jumbotail's brand: "Happiness. Prosperity. Delivered."
- Format your responses with clear sections using **bold** for emphasis.`;

        try {
            const chatSession = this.model.startChat({
                history: [
                    { role: 'user', parts: [{ text: 'You are the Jumbotail AI Assistant.' }] },
                    { role: 'model', parts: [{ text: 'I\'m ready to help with shipping, logistics, and marketplace queries!' }] },
                    ...history.map(m => ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.text }],
                    })),
                ],
            });

            // Retry logic for rate limiting
            const result = await this._retry(() => chatSession.sendMessage(`${systemPrompt}\n\nUser question: ${userMessage}`));
            const reply = result.response.text();

            // Generate follow-up suggestions (non-critical, no retry)
            let suggestions = [
                'Compare shipping costs by transport mode',
                'Which warehouse covers my area?',
                'How to reduce shipping charges?',
            ];
            try {
                const suggestionsResult = await this.model.generateContent(
                    `Based on this conversation about B2B shipping: "${userMessage}" → "${reply.substring(0, 200)}"
                     Suggest exactly 3 short follow-up questions (max 8 words each). Reply ONLY with a JSON array of strings.`
                );
                const suggestionsText = suggestionsResult.response.text();
                const match = suggestionsText.match(/\[[\s\S]*?\]/);
                if (match) suggestions = JSON.parse(match[0]);
            } catch (e) { /* use defaults */ }

            return { reply, suggestions };
        } catch (err) {
            console.error('Gemini API error:', err.message);
            // Return a friendly response instead of throwing
            return {
                reply: `I'm experiencing high demand right now. Here's what I know:\n\n**Shipping is calculated as:** distance × rate per km per kg × weight\n- **Mini Van** (0-100km): ₹3/km/kg\n- **Truck** (100-500km): ₹2/km/kg\n- **Aeroplane** (500+km): ₹1/km/kg\n\nPlease try again in a moment for detailed AI-powered answers!`,
                suggestions: ['How is shipping calculated?', 'List all warehouses', 'What products are available?'],
            };
        }
    }

    /**
     * Analyze a shipping estimate and provide insights.
     * @param {Object} shippingResult - Result from shipping calculation
     * @returns {Object} { insights, tips }
     */
    async analyzeShipment(shippingResult) {
        if (!this.enabled) return { insights: '', tips: [] };

        const prompt = `Analyze this B2B shipment concisely (max 100 words):
Distance: ${shippingResult.breakdown?.distanceKm} km
Transport: ${shippingResult.breakdown?.transportMode}
Weight: ${shippingResult.breakdown?.weightKg} kg
Shipping Cost: ₹${shippingResult.shippingCharge}
Speed: ${shippingResult.breakdown?.deliverySpeed}

Provide: 1 insight about cost efficiency, 1 tip to save money. Be brief.`;

        try {
            const result = await this.model.generateContent(prompt);
            return { insights: result.response.text(), tips: [] };
        } catch (err) {
            return { insights: 'Analysis unavailable.', tips: [] };
        }
    }
}

module.exports = new GeminiService();
