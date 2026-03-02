/**
 * Order Routes
 */
const { Router } = require('express');
const orderController = require('../controllers/orderController');

const router = Router();

router.get('/stats', orderController.getStats);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);

module.exports = router;
