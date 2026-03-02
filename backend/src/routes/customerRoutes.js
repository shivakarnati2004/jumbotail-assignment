/**
 * Customer Routes
 */
const { Router } = require('express');
const customerController = require('../controllers/customerController');

const router = Router();

router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.delete);

module.exports = router;
