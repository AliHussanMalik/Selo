const express = require('express');
const router = express.Router();
const {
  listForResale,
  getFlashListings,
  getResaleById,
  purchaseResaleSlot,
  cancelResaleListing,
  listResaleSchema,
} = require('../controllers/resale.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// Public routes
router.get('/flash', getFlashListings);
router.get('/:id', getResaleById);

// Protected routes (Customer required)
router.post('/list', authenticate, validate(listResaleSchema), listForResale);
router.post('/purchase/:id', authenticate, purchaseResaleSlot);
router.patch('/:id/cancel', authenticate, cancelResaleListing);

module.exports = router;
