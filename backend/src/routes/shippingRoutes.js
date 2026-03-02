/**
 * Shipping Routes
 */
const { Router } = require('express');
const shippingController = require('../controllers/shippingController');
const { validateQueryParams, validateBodyParams } = require('../middleware/validateParams');

const router = Router();

// Required API: Get shipping charge from warehouse to customer
router.get('/', validateQueryParams('warehouseId', 'customerId'), shippingController.getShippingCharge);

// Required API: Calculate shipping charge for seller → customer
router.post('/calculate', validateBodyParams('sellerId', 'customerId'), shippingController.calculateCharge);

module.exports = router;
