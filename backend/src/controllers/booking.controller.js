const { z } = require('zod');
const db = require('../config/db');

const createBookingSchema = z.object({
  body: z.object({
    salon_id: z.string().uuid('Invalid salon ID'),
    service_id: z.string().uuid('Invalid service ID'),
    dresser_id: z.string().uuid().optional(),
    scheduled_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    start_time: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Start time must be HH:MM or HH:MM:SS'),
    notes: z.string().optional(),
  }),
});

const createBooking = async (req, res) => {
  const { salon_id, service_id, dresser_id, scheduled_date, start_time, notes } = req.body;
  const customer_id = req.user.id;

  const service = await db('services')
    .where({ id: service_id, salon_id, is_active: true })
    .first();

  if (!service) {
    return res.status(404).json({ error: 'Service not found at this salon' });
  }

  // Calculate end_time based on service.duration_minutes
  const [startH, startM] = start_time.split(':').map(Number);
  const startMins = startH * 60 + startM;
  const endMins = startMins + service.duration_minutes;

  const endH = Math.floor(endMins / 60).toString().padStart(2, '0');
  const endM = (endMins % 60).toString().padStart(2, '0');
  const end_time = `${endH}:${endM}:00`;

  // Conflict Detection: check if any non-cancelled/resold booking overlaps for this salon
  const conflict = await db('bookings')
    .where({ salon_id, scheduled_date })
    .whereNotIn('status', ['cancelled', 'resold'])
    .andWhere((builder) => {
      builder
        .where('start_time', '<', end_time)
        .andWhere('end_time', '>', start_time);
    })
    .first();

  if (conflict) {
    return res.status(409).json({
      error: 'Time slot conflict',
      message: 'This time slot is no longer available. Please select another slot.',
    });
  }

  const [booking] = await db('bookings')
    .insert({
      customer_id,
      salon_id,
      service_id,
      dresser_id: dresser_id || null,
      scheduled_date,
      start_time,
      end_time,
      status: 'confirmed',
      total_price: service.price,
      notes: notes || null,
    })
    .returning('*');

  return res.status(201).json({
    message: 'Booking created successfully',
    booking,
  });
};

const getMyBookings = async (req, res) => {
  const customer_id = req.user.id;

  const bookings = await db('bookings')
    .join('salons', 'bookings.salon_id', 'salons.id')
    .join('services', 'bookings.service_id', 'services.id')
    .where({ 'bookings.customer_id': customer_id })
    .select(
      'bookings.*',
      'salons.name as salon_name',
      'salons.address as salon_address',
      'salons.city as salon_city',
      'salons.cover_image_url as salon_image',
      'services.name as service_name',
      'services.duration_minutes'
    )
    .orderBy('bookings.scheduled_date', 'desc')
    .orderBy('bookings.start_time', 'asc');

  return res.json({ bookings });
};

const getBookingById = async (req, res) => {
  const { id } = req.params;

  const booking = await db('bookings')
    .join('salons', 'bookings.salon_id', 'salons.id')
    .join('services', 'bookings.service_id', 'services.id')
    .join('users as customer', 'bookings.customer_id', 'customer.id')
    .where({ 'bookings.id': id })
    .select(
      'bookings.*',
      'salons.name as salon_name',
      'salons.address as salon_address',
      'salons.city as salon_city',
      'services.name as service_name',
      'customer.full_name as customer_name',
      'customer.phone as customer_phone'
    )
    .first();

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Access control
  if (
    booking.customer_id !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'salon_owner'
  ) {
    return res.status(403).json({ error: 'Not authorized to view this booking' });
  }

  return res.json({ booking });
};

const cancelBooking = async (req, res) => {
  const { id } = req.params;

  const booking = await db('bookings').where({ id }).first();
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (booking.customer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to cancel this booking' });
  }

  if (['cancelled', 'completed', 'resold'].includes(booking.status)) {
    return res.status(400).json({ error: `Cannot cancel booking with status: ${booking.status}` });
  }

  const [updated] = await db('bookings')
    .where({ id })
    .update({ status: 'cancelled', updated_at: db.fn.now() })
    .returning('*');

  return res.json({
    message: 'Booking cancelled successfully',
    booking: updated,
  });
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  createBookingSchema,
};
