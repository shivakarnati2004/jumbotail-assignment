/**
 * Shipping Controller
 * Handles shipping charge calculation API requests.
 */
const shippingService = require('../services/shippingService');

const shippingController = {
    /**
     * GET /api/v1/shipping-charge?warehouseId=...&customerId=...&deliverySpeed=...&productId=...
     * Calculate shipping charge from warehouse to customer.
     */
    async getShippingCharge(req, res, next) {
        try {
            const warehouseId = parseInt(req.query.warehouseId, 10);
            const customerId = parseInt(req.query.customerId, 10);
            const deliverySpeed = req.query.deliverySpeed || 'standard';
            const productId = req.query.productId ? parseInt(req.query.productId, 10) : null;

            if (isNaN(warehouseId) || isNaN(customerId)) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'warehouseId and customerId must be valid integers', code: 400 },
                });
            }

            const result = await shippingService.calculateShippingCharge(
                warehouseId, customerId, deliverySpeed, productId
            );

            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    },

    /**
     * POST /api/v1/shipping-charge/calculate
     * Calculate shipping charge for a seller-to-customer flow.
     * Body: { sellerId, customerId, deliverySpeed, productId? }
     */
    async calculateCharge(req, res, next) {
        try {
            const { sellerId, customerId, deliverySpeed, productId } = req.body;

            if (!sellerId || !customerId) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'sellerId and customerId are required', code: 400 },
                });
            }

            const result = await shippingService.calculateSellerToCustomerCharge(
                parseInt(sellerId, 10),
                parseInt(customerId, 10),
                deliverySpeed || 'standard',
                productId ? parseInt(productId, 10) : null
            );

            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = shippingController;
