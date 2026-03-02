/**
 * Seller Controller — CRUD API for sellers
 */
const sellerRepository = require('../repositories/sellerRepository');

const sellerController = {
    async getAll(req, res, next) {
        try {
            const sellers = await sellerRepository.findAll();
            res.json({ success: true, data: sellers });
        } catch (err) { next(err); }
    },

    async getById(req, res, next) {
        try {
            const seller = await sellerRepository.findById(parseInt(req.params.id, 10));
            if (!seller) return res.status(404).json({ success: false, error: { message: 'Seller not found', code: 404 } });
            res.json({ success: true, data: seller });
        } catch (err) { next(err); }
    },

    async create(req, res, next) {
        try {
            const seller = await sellerRepository.create(req.body);
            res.status(201).json({ success: true, data: seller });
        } catch (err) { next(err); }
    },

    async update(req, res, next) {
        try {
            const seller = await sellerRepository.update(parseInt(req.params.id, 10), req.body);
            if (!seller) return res.status(404).json({ success: false, error: { message: 'Seller not found', code: 404 } });
            res.json({ success: true, data: seller });
        } catch (err) { next(err); }
    },

    async delete(req, res, next) {
        try {
            const deleted = await sellerRepository.delete(parseInt(req.params.id, 10));
            if (!deleted) return res.status(404).json({ success: false, error: { message: 'Seller not found', code: 404 } });
            res.json({ success: true, message: 'Seller deleted successfully' });
        } catch (err) { next(err); }
    },
};

module.exports = sellerController;
