/**
 * Customer Controller — CRUD API for customers
 */
const customerRepository = require('../repositories/customerRepository');

const customerController = {
    async getAll(req, res, next) {
        try {
            const customers = await customerRepository.findAll();
            res.json({ success: true, data: customers });
        } catch (err) { next(err); }
    },

    async getById(req, res, next) {
        try {
            const customer = await customerRepository.findById(parseInt(req.params.id, 10));
            if (!customer) return res.status(404).json({ success: false, error: { message: 'Customer not found', code: 404 } });
            res.json({ success: true, data: customer });
        } catch (err) { next(err); }
    },

    async create(req, res, next) {
        try {
            const customer = await customerRepository.create(req.body);
            res.status(201).json({ success: true, data: customer });
        } catch (err) { next(err); }
    },

    async update(req, res, next) {
        try {
            const customer = await customerRepository.update(parseInt(req.params.id, 10), req.body);
            if (!customer) return res.status(404).json({ success: false, error: { message: 'Customer not found', code: 404 } });
            res.json({ success: true, data: customer });
        } catch (err) { next(err); }
    },

    async delete(req, res, next) {
        try {
            const deleted = await customerRepository.delete(parseInt(req.params.id, 10));
            if (!deleted) return res.status(404).json({ success: false, error: { message: 'Customer not found', code: 404 } });
            res.json({ success: true, message: 'Customer deleted successfully' });
        } catch (err) { next(err); }
    },
};

module.exports = customerController;
