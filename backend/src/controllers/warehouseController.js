/**
 * Warehouse Controller
 * Handles REST API requests for warehouse operations.
 */
const warehouseService = require('../services/warehouseService');
const warehouseRepository = require('../repositories/warehouseRepository');

const warehouseController = {
    /**
     * GET /api/v1/warehouse/nearest?sellerId=...&productId=...
     * Returns the nearest warehouse for a seller's product.
     */
    async getNearestWarehouse(req, res, next) {
        try {
            const sellerId = parseInt(req.query.sellerId, 10);
            const productId = parseInt(req.query.productId, 10);

            if (isNaN(sellerId) || isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'sellerId and productId must be valid integers', code: 400 },
                });
            }

            const result = await warehouseService.findNearestWarehouse(sellerId, productId);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    },

    /** GET /api/v1/warehouses — List all warehouses */
    async getAll(req, res, next) {
        try {
            const warehouses = await warehouseRepository.findAll();
            res.json({ success: true, data: warehouses });
        } catch (err) {
            next(err);
        }
    },

    /** GET /api/v1/warehouses/:id */
    async getById(req, res, next) {
        try {
            const warehouse = await warehouseRepository.findById(parseInt(req.params.id, 10));
            if (!warehouse) {
                return res.status(404).json({ success: false, error: { message: 'Warehouse not found', code: 404 } });
            }
            res.json({ success: true, data: warehouse });
        } catch (err) {
            next(err);
        }
    },

    /** POST /api/v1/warehouses */
    async create(req, res, next) {
        try {
            const warehouse = await warehouseRepository.create(req.body);
            res.status(201).json({ success: true, data: warehouse });
        } catch (err) {
            next(err);
        }
    },

    /** PUT /api/v1/warehouses/:id */
    async update(req, res, next) {
        try {
            const warehouse = await warehouseRepository.update(parseInt(req.params.id, 10), req.body);
            if (!warehouse) {
                return res.status(404).json({ success: false, error: { message: 'Warehouse not found', code: 404 } });
            }
            res.json({ success: true, data: warehouse });
        } catch (err) {
            next(err);
        }
    },

    /** DELETE /api/v1/warehouses/:id */
    async delete(req, res, next) {
        try {
            const deleted = await warehouseRepository.delete(parseInt(req.params.id, 10));
            if (!deleted) {
                return res.status(404).json({ success: false, error: { message: 'Warehouse not found', code: 404 } });
            }
            res.json({ success: true, message: 'Warehouse deleted successfully' });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = warehouseController;
