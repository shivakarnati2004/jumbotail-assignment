/**
 * AI Routes
 */
const { Router } = require('express');
const aiController = require('../controllers/aiController');

const router = Router();

// Chat with AI Assistant
router.post('/chat', aiController.chat);

// Analyze a shipping estimate
router.post('/analyze-shipment', aiController.analyzeShipment);

module.exports = router;
