const { z } = require('zod');
const db = require('../config/db');

const listResaleSchema = z.object({
  body: z.object({
    booking_id: z.string().uuid('Invalid booking ID'),
    listing_price: z.number().positive('Listing price must be positive'),
  }),
});

const listForResale = async (req, res) => {
  const { booking_id, listing_price } = req.body;
  const seller_id = req.user.id;

  const booking = await db('bookings').where({ id: booking_id }).first();
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (booking.customer_id !== seller_id) {
    return res.status(403).json({ error: 'You can only list your own bookings for resale' });
  }

  if (booking.status !== 'confirmed') {
    return res.status(400).json({ error: `Cannot list booking with status: ${booking.status}` });
  }

  const existingResale = await db('slot_resale_transactions')
    .where({ booking_id, status: 'listed' })
    .first();

  if (existingResale) {
    return res.status(400).json({ error: 'This booking is already listed for resale' });
  }

  // Set expiry to booking date + start_time
  const expires_at = new Date(`${booking.scheduled_date}T${booking.start_time}`);

  const [resale] = await db('slot_resale_transactions')
    .insert({
      booking_id,
      seller_id,
      listing_price,
      original_price: booking.total_price,
      status: 'listed',
      expires_at,
    })
    .returning('*');

  return res.status(201).json({
    message: 'Slot successfully listed on Flash Resale Marketplace',
    resale,
  });
};

const getFlashListings = async (req, res) => {
  const listings = await db('slot_resale_transactions')
    .join('bookings', 'slot_resale_transactions.booking_id', 'bookings.id')
    .join('salons', 'bookings.salon_id', 'salons.id')
    .join('services', 'bookings.service_id', 'services.id')
    .join('users as seller', 'slot_resale_transactions.seller_id', 'seller.id')
    .where('slot_resale_transactions.status', 'listed')
    .where('slot_resale_transactions.expires_at', '>', db.fn.now())
    .select(
      'slot_resale_transactions.*',
      'bookings.scheduled_date',
      'bookings.start_time',
      'bookings.end_time',
      'salons.name as salon_name',
      'salons.address as salon_address',
      'salons.city as salon_city',
      'salons.cover_image_url as salon_image',
      'services.name as service_name',
      'services.duration_minutes',
      'seller.full_name as seller_name'
    )
    .orderBy('slot_resale_transactions.created_at', 'desc');

  return res.json({ listings });
};

const getResaleById = async (req, res) => {
  const { id } = req.params;

  const resale = await db('slot_resale_transactions')
    .join('bookings', 'slot_resale_transactions.booking_id', 'bookings.id')
    .join('salons', 'bookings.salon_id', 'salons.id')
    .join('services', 'bookings.service_id', 'services.id')
    .join('users as seller', 'slot_resale_transactions.seller_id', 'seller.id')
    .where({ 'slot_resale_transactions.id': id })
    .select(
      'slot_resale_transactions.*',
      'bookings.scheduled_date',
      'bookings.start_time',
      'bookings.end_time',
      'salons.name as salon_name',
      'salons.address as salon_address',
      'salons.city as salon_city',
      'salons.cover_image_url as salon_image',
      'services.name as service_name',
      'seller.full_name as seller_name'
    )
    .first();

  if (!resale) {
    return res.status(404).json({ error: 'Resale listing not found' });
  }

  return res.json({ resale });
};

const purchaseResaleSlot = async (req, res) => {
  const { id } = req.params;
  const buyer_id = req.user.id;

  const result = await db.transaction(async (trx) => {
    const resale = await trx('slot_resale_transactions')
      .where({ id, status: 'listed' })
      .where('expires_at', '>', trx.fn.now())
      .first();

    if (!resale) {
      throw new Error('LISTING_NOT_AVAILABLE');
    }

    if (resale.seller_id === buyer_id) {
      throw new Error('CANNOT_BUY_OWN_LISTING');
    }

    // Update resale transaction status to sold
    const [updatedResale] = await trx('slot_resale_transactions')
      .where({ id })
      .update({
        buyer_id,
        status: 'sold',
        sold_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      })
      .returning('*');

    // Transfer booking ownership to buyer
    const [updatedBooking] = await trx('bookings')
      .where({ id: resale.booking_id })
      .update({
        customer_id: buyer_id,
        notes: `P2P Resale acquired from seller ${resale.seller_id}`,
        updated_at: trx.fn.now(),
      })
      .returning('*');

    return { resale: updatedResale, booking: updatedBooking };
  }).catch((err) => {
    if (err.message === 'LISTING_NOT_AVAILABLE') {
      return { status: 404, message: 'Resale listing is no longer available or has expired' };
    }
    if (err.message === 'CANNOT_BUY_OWN_LISTING') {
      return { status: 400, message: 'You cannot purchase your own resale listing' };
    }
    throw err;
  });

  if (result.status) {
    return res.status(result.status).json({ error: result.message });
  }

  return res.json({
    message: 'Slot purchased successfully! Booking ownership has been transferred.',
    transaction: result.resale,
    booking: result.booking,
  });
};

const cancelResaleListing = async (req, res) => {
  const { id } = req.params;
  const seller_id = req.user.id;

  const resale = await db('slot_resale_transactions').where({ id }).first();
  if (!resale) {
    return res.status(404).json({ error: 'Resale listing not found' });
  }

  if (resale.seller_id !== seller_id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to cancel this listing' });
  }

  if (resale.status !== 'listed') {
    return res.status(400).json({ error: `Cannot cancel listing with status: ${resale.status}` });
  }

  const [updated] = await db('slot_resale_transactions')
    .where({ id })
    .update({ status: 'cancelled', updated_at: db.fn.now() })
    .returning('*');

  return res.json({
    message: 'Resale listing cancelled successfully',
    resale: updated,
  });
};

module.exports = {
  listForResale,
  getFlashListings,
  getResaleById,
  purchaseResaleSlot,
  cancelResaleListing,
  listResaleSchema,
};
