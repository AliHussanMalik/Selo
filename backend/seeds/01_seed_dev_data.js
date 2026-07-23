const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clear existing tables in reverse dependency order
  await knex('reviews').del();
  await knex('slot_resale_transactions').del();
  await knex('bookings').del();
  await knex('services').del();
  await knex('salon_amenities').del();
  await knex('salons').del();
  await knex('users').del();

  // 1. Password Hashing
  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Users
  const [owner] = await knex('users')
    .insert({
      full_name: 'Tariq Mahmood',
      email: 'owner@selo.com',
      phone: '+923001234567',
      password_hash: passwordHash,
      role: 'salon_owner',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    })
    .returning('*');

  const [customer1] = await knex('users')
    .insert({
      full_name: 'Sara Khan',
      email: 'sara@selo.com',
      phone: '+923007654321',
      password_hash: passwordHash,
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    })
    .returning('*');

  const [customer2] = await knex('users')
    .insert({
      full_name: 'Ali Raza',
      email: 'ali@selo.com',
      phone: '+923008889999',
      password_hash: passwordHash,
      role: 'customer',
    })
    .returning('*');

  // 3. Salons
  const [salon1] = await knex('salons')
    .insert({
      owner_id: owner.id,
      name: 'Royal Cut & Styling Studio',
      description: 'Premium luxury grooming and hair salon in the heart of Gulberg, Lahore.',
      address: 'Block MM Alam Road, Gulberg III',
      city: 'Lahore',
      latitude: 31.5204,
      longitude: 74.3587,
      cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
      is_verified: true,
    })
    .returning('*');

  const [salon2] = await knex('salons')
    .insert({
      owner_id: owner.id,
      name: 'Glamour Lounge & Spa',
      description: 'Top-tier beauty spa and bridal lounge in F-7 Markaz.',
      address: 'F-7 Markaz, Main Boulevard',
      city: 'Islamabad',
      latitude: 33.7294,
      longitude: 73.0551,
      cover_image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f',
      is_verified: true,
    })
    .returning('*');

  // 4. Amenities
  await knex('salon_amenities').insert([
    { salon_id: salon1.id, amenity: 'wifi' },
    { salon_id: salon1.id, amenity: 'parking' },
    { salon_id: salon1.id, amenity: 'ac' },
    { salon_id: salon1.id, amenity: 'refreshments' },
    { salon_id: salon2.id, amenity: 'wifi' },
    { salon_id: salon2.id, amenity: 'ac' },
    { salon_id: salon2.id, amenity: 'female_only' },
    { salon_id: salon2.id, amenity: 'prayer_room' },
  ]);

  // 5. Services
  const [service1] = await knex('services')
    .insert({
      salon_id: salon1.id,
      name: 'Signature Haircut & Beard Sculpting',
      description: 'Full consultation, precision haircut, hot towel beard trim, and styling.',
      duration_minutes: 45,
      price: 2500.00,
      category: 'haircut',
    })
    .returning('*');

  const [service2] = await knex('services')
    .insert({
      salon_id: salon1.id,
      name: 'Charcoal Facial Treatment',
      description: 'Deep cleansing and exfoliating facial for radiant skin.',
      duration_minutes: 60,
      price: 4500.00,
      category: 'treatment',
    })
    .returning('*');

  const [service3] = await knex('services')
    .insert({
      salon_id: salon2.id,
      name: 'Bridal Spa & Glow Polish',
      description: 'Luxury full body skin treatment and glow session.',
      duration_minutes: 90,
      price: 12000.00,
      category: 'treatment',
    })
    .returning('*');

  // 6. Bookings
  const today = new Date().toISOString().split('T')[0];

  const [booking1] = await knex('bookings')
    .insert({
      customer_id: customer1.id,
      salon_id: salon1.id,
      service_id: service1.id,
      scheduled_date: today,
      start_time: '14:00:00',
      end_time: '14:45:00',
      status: 'confirmed',
      total_price: service1.price,
      notes: 'VIP customer',
    })
    .returning('*');

  // 7. Slot Resale Transaction
  const expiresAt = new Date(`${today}T14:00:00Z`);

  await knex('slot_resale_transactions').insert({
    booking_id: booking1.id,
    seller_id: customer1.id,
    listing_price: 2000.00, // Discounted from 2500
    original_price: 2500.00,
    status: 'listed',
    expires_at: expiresAt,
  });

  console.log('🌱 Dev database successfully seeded with Pakistani salons, users, services & resale listing!');
};
