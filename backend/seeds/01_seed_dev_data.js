const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

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
  const ownerId = randomUUID();
  const customer1Id = randomUUID();
  const customer2Id = randomUUID();

  await knex('users').insert({
    id: ownerId,
    full_name: 'Tariq Mahmood',
    email: 'owner@selo.com',
    phone: '+923001234567',
    password_hash: passwordHash,
    role: 'salon_owner',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  });

  await knex('users').insert({
    id: customer1Id,
    full_name: 'Sara Khan',
    email: 'sara@selo.com',
    phone: '+923007654321',
    password_hash: passwordHash,
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  });

  await knex('users').insert({
    id: customer2Id,
    full_name: 'Ali Raza',
    email: 'ali@selo.com',
    phone: '+923008889999',
    password_hash: passwordHash,
    role: 'customer',
  });

  // 3. Salons
  const salon1Id = randomUUID();
  const salon2Id = randomUUID();

  await knex('salons').insert({
    id: salon1Id,
    owner_id: ownerId,
    name: 'Royal Cut & Styling Studio',
    description: 'Premium luxury grooming and hair salon in the heart of Gulberg, Lahore.',
    address: 'Block MM Alam Road, Gulberg III',
    city: 'Lahore',
    latitude: 31.5204,
    longitude: 74.3587,
    cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
    is_verified: true,
  });

  await knex('salons').insert({
    id: salon2Id,
    owner_id: ownerId,
    name: 'Glamour Lounge & Spa',
    description: 'Top-tier beauty spa and bridal lounge in F-7 Markaz.',
    address: 'F-7 Markaz, Main Boulevard',
    city: 'Islamabad',
    latitude: 33.7294,
    longitude: 73.0551,
    cover_image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f',
    is_verified: true,
  });

  // 4. Amenities
  await knex('salon_amenities').insert([
    { id: randomUUID(), salon_id: salon1Id, amenity: 'wifi' },
    { id: randomUUID(), salon_id: salon1Id, amenity: 'parking' },
    { id: randomUUID(), salon_id: salon1Id, amenity: 'ac' },
    { id: randomUUID(), salon_id: salon1Id, amenity: 'refreshments' },
    { id: randomUUID(), salon_id: salon2Id, amenity: 'wifi' },
    { id: randomUUID(), salon_id: salon2Id, amenity: 'ac' },
    { id: randomUUID(), salon_id: salon2Id, amenity: 'female_only' },
    { id: randomUUID(), salon_id: salon2Id, amenity: 'prayer_room' },
  ]);

  // 5. Services
  const service1Id = randomUUID();
  const service2Id = randomUUID();
  const service3Id = randomUUID();

  await knex('services').insert({
    id: service1Id,
    salon_id: salon1Id,
    name: 'Signature Haircut & Beard Sculpting',
    description: 'Full consultation, precision haircut, hot towel beard trim, and styling.',
    duration_minutes: 45,
    price: 2500.00,
    category: 'haircut',
  });

  await knex('services').insert({
    id: service2Id,
    salon_id: salon1Id,
    name: 'Charcoal Facial Treatment',
    description: 'Deep cleansing and exfoliating facial for radiant skin.',
    duration_minutes: 60,
    price: 4500.00,
    category: 'treatment',
  });

  await knex('services').insert({
    id: service3Id,
    salon_id: salon2Id,
    name: 'Bridal Spa & Glow Polish',
    description: 'Luxury full body skin treatment and glow session.',
    duration_minutes: 90,
    price: 12000.00,
    category: 'treatment',
  });

  // 6. Bookings
  const today = new Date().toISOString().split('T')[0];
  const booking1Id = randomUUID();

  await knex('bookings').insert({
    id: booking1Id,
    customer_id: customer1Id,
    salon_id: salon1Id,
    service_id: service1Id,
    scheduled_date: today,
    start_time: '14:00:00',
    end_time: '14:45:00',
    status: 'confirmed',
    total_price: 2500.00,
    notes: 'VIP customer',
  });

  // 7. Slot Resale Transaction
  const expiresAt = new Date(`${today}T14:00:00Z`);

  await knex('slot_resale_transactions').insert({
    id: randomUUID(),
    booking_id: booking1Id,
    seller_id: customer1Id,
    listing_price: 2000.00, // Discounted from 2500
    original_price: 2500.00,
    status: 'listed',
    expires_at: expiresAt,
  });

  console.log('🌱 Dev database successfully seeded with Pakistani salons, users, services & resale listing!');
};
