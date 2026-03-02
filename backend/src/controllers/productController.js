/**
 * Product Controller — CRUD API for products
 */
const productRepository = require('../repositories/productRepository');

const productController = {
    async getAll(req, res, next) {
        try {
            const products = await productRepository.findAll();
            res.json({ success: true, data: products });
        } catch (err) { next(err); }
    },

    async getById(req, res, next) {
        try {
            const product = await productRepository.findById(parseInt(req.params.id, 10));
            if (!product) return res.status(404).json({ success: false, error: { message: 'Product not found', code: 404 } });
            res.json({ success: true, data: product });
        } catch (err) { next(err); }
    },

    async getBySeller(req, res, next) {
        try {
            const products = await productRepository.findBySellerId(parseInt(req.params.sellerId, 10));
            res.json({ success: true, data: products });
        } catch (err) { next(err); }
    },

    async create(req, res, next) {
        try {
            const product = await productRepository.create(req.body);
            res.status(201).json({ success: true, data: product });
        } catch (err) { next(err); }
    },

    async update(req, res, next) {
        try {
            const product = await productRepository.update(parseInt(req.params.id, 10), req.body);
            if (!product) return res.status(404).json({ success: false, error: { message: 'Product not found', code: 404 } });
            res.json({ success: true, data: product });
        } catch (err) { next(err); }
    },

    async delete(req, res, next) {
        try {
            const deleted = await productRepository.delete(parseInt(req.params.id, 10));
            if (!deleted) return res.status(404).json({ success: false, error: { message: 'Product not found', code: 404 } });
            res.json({ success: true, message: 'Product deleted successfully' });
        } catch (err) { next(err); }
    },
};

module.exports = productController;
