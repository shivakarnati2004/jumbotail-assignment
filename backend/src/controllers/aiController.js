/**
 * AI Controller
 * Handles AI chat and shipping analysis endpoints.
 */
const geminiService = require('../services/geminiService');

const aiController = {
    /**
     * POST /api/v1/ai/chat
     * Chat with the Jumbotail AI Assistant.
     * Body: { message: string, history?: [{role, text}] }
     */
    async chat(req, res, next) {
        try {
            const { message, history } = req.body;

            if (!message || typeof message !== 'string' || message.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Message is required and must be a non-empty string', code: 400 },
                });
            }

            const result = await geminiService.chat(message.trim(), history || []);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    },

    /**
     * POST /api/v1/ai/analyze-shipment
     * Get AI insights on a shipping estimate.
     * Body: { shippingResult: Object }
     */
    async analyzeShipment(req, res, next) {
        try {
            const { shippingResult } = req.body;

            if (!shippingResult) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'shippingResult is required', code: 400 },
                });
            }

            const result = await geminiService.analyzeShipment(shippingResult);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = aiController;
