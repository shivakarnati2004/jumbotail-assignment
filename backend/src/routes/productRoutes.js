/**
 * Product Routes
 */
const { Router } = require('express');
const productController = require('../controllers/productController');

const router = Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.get('/seller/:sellerId', productController.getBySeller);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;
