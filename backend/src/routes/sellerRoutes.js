/**
 * Seller Routes
 */
const { Router } = require('express');
const sellerController = require('../controllers/sellerController');

const router = Router();

router.get('/', sellerController.getAll);
router.get('/:id', sellerController.getById);
router.post('/', sellerController.create);
router.put('/:id', sellerController.update);
router.delete('/:id', sellerController.delete);

module.exports = router;
