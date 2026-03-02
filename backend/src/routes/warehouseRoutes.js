/**
 * Warehouse Routes
 */
const { Router } = require('express');
const warehouseController = require('../controllers/warehouseController');
const { validateQueryParams } = require('../middleware/validateParams');

const router = Router();

// Required API: Get nearest warehouse for a seller
router.get('/nearest', validateQueryParams('sellerId', 'productId'), warehouseController.getNearestWarehouse);

// CRUD routes
router.get('/', warehouseController.getAll);
router.get('/:id', warehouseController.getById);
router.post('/', warehouseController.create);
router.put('/:id', warehouseController.update);
router.delete('/:id', warehouseController.delete);

module.exports = router;
