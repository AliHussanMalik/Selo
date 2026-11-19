const express = require('express');
const router = express.Router();
const {
  getAllSalons,
  getSalonById,
  getMySalons,
  createSalon,
  addService,
  getAvailableSlots,
  createSalonSchema,
  createServiceSchema,
} = require('../controllers/salon.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');

router.get('/', getAllSalons);
router.get('/my', authenticate, requireRole('salon_owner', 'admin'), getMySalons);
router.get('/:id', getSalonById);
router.get('/:id/slots', getAvailableSlots);

router.post(
  '/',
  authenticate,
  requireRole('salon_owner', 'admin'),
  validate(createSalonSchema),
  createSalon
);

router.post(
  '/:id/services',
  authenticate,
  requireRole('salon_owner', 'admin'),
  validate(createServiceSchema),
  addService
);

module.exports = router;
