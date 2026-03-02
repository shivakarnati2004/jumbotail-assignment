/**
 * Jumbotail B2B E-Commerce Shipping Estimator — Server Entry Point
 *
 * Express REST API server with PostgreSQL backend.
 * Serves endpoints for:
 *   - Warehouse management & nearest warehouse lookup
 *   - Shipping charge calculation
 *   - Customer, Seller, Product, Order CRUD
 *   - Dashboard statistics
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Routes
const warehouseRoutes = require('./routes/warehouseRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const customerRoutes = require('./routes/customerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request Logger ───────────────────────────────────────────
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/v1/warehouse', warehouseRoutes);
app.use('/api/v1/warehouses', warehouseRoutes);
app.use('/api/v1/shipping-charge', shippingRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/sellers', sellerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/dashboard', orderRoutes);
app.use('/api/v1/ai', aiRoutes);

// ── Health ───────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: { message: `Route ${req.method} ${req.originalUrl} not found`, code: 404 },
    });
});

// ── Error Handler ────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n🚀 Jumbotail Shipping Estimator API`);
        console.log(`   Running on http://localhost:${PORT}`);
        console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
}

module.exports = app;
