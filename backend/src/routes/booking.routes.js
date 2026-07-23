const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  createBookingSchema,
} = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');

router.use(authenticate);

router.post('/', requireRole('customer', 'admin'), validate(createBookingSchema), createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
