/**
 * Order Controller — CRUD API for orders + dashboard stats
 */
const orderRepository = require('../repositories/orderRepository');

const orderController = {
    async getAll(req, res, next) {
        try {
            const orders = await orderRepository.findAll();
            res.json({ success: true, data: orders });
        } catch (err) { next(err); }
    },

    async getById(req, res, next) {
        try {
            const order = await orderRepository.findById(parseInt(req.params.id, 10));
            if (!order) return res.status(404).json({ success: false, error: { message: 'Order not found', code: 404 } });
            res.json({ success: true, data: order });
        } catch (err) { next(err); }
    },

    async create(req, res, next) {
        try {
            const order = await orderRepository.create(req.body);
            res.status(201).json({ success: true, data: order });
        } catch (err) { next(err); }
    },

    async update(req, res, next) {
        try {
            const order = await orderRepository.update(parseInt(req.params.id, 10), req.body);
            if (!order) return res.status(404).json({ success: false, error: { message: 'Order not found', code: 404 } });
            res.json({ success: true, data: order });
        } catch (err) { next(err); }
    },

    async delete(req, res, next) {
        try {
            const deleted = await orderRepository.delete(parseInt(req.params.id, 10));
            if (!deleted) return res.status(404).json({ success: false, error: { message: 'Order not found', code: 404 } });
            res.json({ success: true, message: 'Order deleted successfully' });
        } catch (err) { next(err); }
    },

    /** GET /api/v1/dashboard/stats */
    async getStats(req, res, next) {
        try {
            const stats = await orderRepository.getStats();
            res.json({ success: true, data: stats });
        } catch (err) { next(err); }
    },
};

module.exports = orderController;
