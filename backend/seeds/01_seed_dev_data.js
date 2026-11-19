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

  // 2. Core Users (Admin, Owners, Customers)
  const adminId = randomUUID();
  const owner1Id = randomUUID();
  const owner2Id = randomUUID();
  const customer1Id = randomUUID();
  const customer2Id = randomUUID();
  const customer3Id = randomUUID();

  const coreUsers = [
    {
      id: adminId,
      full_name: 'Super Admin',
      email: 'admin@selo.com',
      phone: '+923000000000',
      password_hash: passwordHash,
      role: 'admin',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    {
      id: owner1Id,
      full_name: 'Tariq Mahmood',
      email: 'owner@selo.com',
      phone: '+923001234567',
      password_hash: passwordHash,
      role: 'salon_owner',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    },
    {
      id: owner2Id,
      full_name: 'Farhan Zaidi',
      email: 'owner2@selo.com',
      phone: '+923002345678',
      password_hash: passwordHash,
      role: 'salon_owner',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      id: customer1Id,
      full_name: 'Sara Khan',
      email: 'sara@selo.com',
      phone: '+923007654321',
      password_hash: passwordHash,
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      id: customer2Id,
      full_name: 'Ali Raza',
      email: 'ali@selo.com',
      phone: '+923008889999',
      password_hash: passwordHash,
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
    {
      id: customer3Id,
      full_name: 'Aiman Zahra',
      email: 'aiman@selo.com',
      phone: '+923009991111',
      password_hash: passwordHash,
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    },
  ];

  // 3. Exactly 20 Hair Dressers
  const DRESSER_NAMES = [
    { name: 'Hamza Tariq', phone: '+923214561001', gender: 'm' },
    { name: 'Bilal Ahmed', phone: '+923214561002', gender: 'm' },
    { name: 'Usman Ali', phone: '+923214561003', gender: 'm' },
    { name: 'Zainab Malik', phone: '+923214561004', gender: 'f' },
    { name: 'Ayesha Noor', phone: '+923214561005', gender: 'f' },
    { name: 'Daniyal Khan', phone: '+923214561006', gender: 'm' },
    { name: 'Farhan Siddiqui', phone: '+923214561007', gender: 'm' },
    { name: 'Omer Farooq', phone: '+923214561008', gender: 'm' },
    { name: 'Mariam Javed', phone: '+923214561009', gender: 'f' },
    { name: 'Hassan Raza', phone: '+923214561010', gender: 'm' },
    { name: 'Saad Mehmood', phone: '+923214561011', gender: 'm' },
    { name: 'Nida Fatima', phone: '+923214561012', gender: 'f' },
    { name: 'Haris Sohail', phone: '+923214561013', gender: 'm' },
    { name: 'Waleed Iqbal', phone: '+923214561014', gender: 'm' },
    { name: 'Sana Tariq', phone: '+923214561015', gender: 'f' },
    { name: 'Shahzaib Khan', phone: '+923214561016', gender: 'm' },
    { name: 'Rehan Shah', phone: '+923214561017', gender: 'm' },
    { name: 'Rabia Basri', phone: '+923214561018', gender: 'f' },
    { name: 'Mustafa Kamal', phone: '+923214561019', gender: 'm' },
    { name: 'Natasha Ali', phone: '+923214561020', gender: 'f' },
  ];

  const MALE_AVATARS = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  ];

  const FEMALE_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  ];

  const dressers = DRESSER_NAMES.map((d, index) => {
    const avatarList = d.gender === 'm' ? MALE_AVATARS : FEMALE_AVATARS;
    const avatar = avatarList[index % avatarList.length];
    const emailPrefix = d.name.toLowerCase().replace(/[^a-z]/g, '.');
    return {
      id: randomUUID(),
      full_name: d.name,
      email: `${emailPrefix}@selo.com`,
      phone: d.phone,
      password_hash: passwordHash,
      role: 'dresser',
      avatar_url: avatar,
    };
  });

  await knex('users').insert([...coreUsers, ...dressers]);

  // 4. Exactly 20 Mock Salons
  const SALON_DATA = [
    {
      name: 'Royal Cut & Styling Studio',
      description: 'Luxury grooming and signature hair styling studio located in the heart of Gulberg.',
      address: 'Block MM Alam Road, Gulberg III',
      city: 'Lahore',
      latitude: 31.5204,
      longitude: 74.3587,
      cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      amenities: ['wifi', 'parking', 'ac', 'refreshments'],
    },
    {
      name: 'Glamour Lounge & Spa',
      description: 'Top-tier luxury beauty spa, facial artistry, and bridal suite in Islamabad.',
      address: 'F-7 Markaz, Main Boulevard',
      city: 'Islamabad',
      latitude: 33.7294,
      longitude: 73.0551,
      cover_image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
      amenities: ['wifi', 'ac', 'female_only', 'prayer_room'],
    },
    {
      name: 'The Gentleman Barbershop',
      description: 'Classic bespoke haircutting, hot towel shaves, and beard grooming for modern gentlemen.',
      address: 'Lane 4, Zamzama Boulevard, DHA Phase 5',
      city: 'Karachi',
      latitude: 24.8211,
      longitude: 67.0345,
      cover_image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
      amenities: ['wifi', 'ac', 'refreshments', 'parking'],
    },
    {
      name: 'En Vogue Hair & Beauty Bar',
      description: 'Trendsetting coloring, balayage, keratin treatments, and luxury hair therapies.',
      address: 'Shop 12, Y-Block Commercial, DHA Phase 3',
      city: 'Lahore',
      latitude: 31.4721,
      longitude: 74.3792,
      cover_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
      amenities: ['wifi', 'parking', 'ac', 'female_only'],
    },
    {
      name: 'Crown & Blade Barber Co.',
      description: 'Precision fades, razor styling, and executive scalp massages in Bahria Town.',
      address: 'Civic Center, Phase 4, Bahria Town',
      city: 'Rawalpindi',
      latitude: 33.5651,
      longitude: 73.0169,
      cover_image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
      amenities: ['wifi', 'parking', 'ac', 'refreshments'],
    },
    {
      name: 'Luxe Locks Studio',
      description: 'Premium hair coloring, texture repair, and bridal makeup artistry in Clifton.',
      address: 'Block 4, Marine Promenade, Clifton',
      city: 'Karachi',
      latitude: 24.8138,
      longitude: 67.0298,
      cover_image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
      amenities: ['wifi', 'ac', 'female_only', 'prayer_room'],
    },
    {
      name: 'Urban Fade Barber Lab',
      description: 'Street-style modern fades, graphic designs, beard contouring, and facial cleansing.',
      address: 'Main Boulevard, Allama Iqbal Town',
      city: 'Lahore',
      latitude: 31.5032,
      longitude: 74.2882,
      cover_image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
      amenities: ['wifi', 'ac', 'refreshments'],
    },
    {
      name: 'The Velvet Room Beauty & Spa',
      description: 'A serene urban sanctuary offering organic facials, hair spa, and mani-pedi rituals.',
      address: 'Beverly Center, Blue Area',
      city: 'Islamabad',
      latitude: 33.7142,
      longitude: 73.0645,
      cover_image_url: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800',
      amenities: ['wifi', 'parking', 'ac', 'female_only', 'prayer_room'],
    },
    {
      name: 'Edge & Texture Hair Crafters',
      description: 'Master stylists specializing in textured cuts, highlights, and custom beard shapes.',
      address: 'Block 2, PECHS Commercial',
      city: 'Karachi',
      latitude: 24.8615,
      longitude: 67.0673,
      cover_image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
      amenities: ['wifi', 'ac', 'parking'],
    },
    {
      name: 'Bella Donna Salon & Lounge',
      description: 'Bridal lounge, nail studio, and high-fashion hair coloring under European-trained stylists.',
      address: 'Sector F-10/3, Street 18',
      city: 'Islamabad',
      latitude: 33.6938,
      longitude: 73.0125,
      cover_image_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800',
      amenities: ['wifi', 'parking', 'ac', 'female_only', 'kids_area'],
    },
    {
      name: 'Sultan Traditional Hammam & Cuts',
      description: 'Ottoman inspired royal grooming, Moroccan bath sessions, and scissor trimming.',
      address: 'Mall Road, Saddar',
      city: 'Rawalpindi',
      latitude: 33.5973,
      longitude: 73.0538,
      cover_image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
      amenities: ['wifi', 'ac', 'prayer_room', 'parking'],
    },
    {
      name: 'Silk & Sheen Hair Boutique',
      description: 'Luxury botanical hair gloss treatments, blowout styling, and organic hair spa.',
      address: 'Chenab Club Road, Civil Lines',
      city: 'Faisalabad',
      latitude: 31.4187,
      longitude: 73.0791,
      cover_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
      amenities: ['wifi', 'ac', 'female_only'],
    },
    {
      name: 'Maverick Male Grooming Club',
      description: 'Upscale gentlemen lounge featuring pool table, specialty espresso, and precision barbering.',
      address: 'Z-Block, DHA Phase 3',
      city: 'Lahore',
      latitude: 31.4682,
      longitude: 74.3756,
      cover_image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
      amenities: ['wifi', 'parking', 'ac', 'refreshments'],
    },
    {
      name: 'Aura Aesthetics & Hair Lounge',
      description: 'Hydrafacial treatments, Japanese hair straightening, and flawless event styling.',
      address: 'Tipu Sultan Road, KDA Scheme 1',
      city: 'Karachi',
      latitude: 24.8719,
      longitude: 67.0912,
      cover_image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
      amenities: ['wifi', 'parking', 'ac', 'female_only'],
    },
    {
      name: 'Scissorhands Creative Barbers',
      description: 'Modern youth-oriented barbershop focusing on taper fades, hair tattoos, and curl styling.',
      address: 'University Road, Tahkal',
      city: 'Peshawar',
      latitude: 34.0081,
      longitude: 71.5165,
      cover_image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
      amenities: ['wifi', 'ac', 'refreshments'],
    },
    {
      name: 'Oasis Wellness & Beauty Studio',
      description: 'Peaceful retreat offering aromatic scalp treatments, deep detox hair wash, and nail care.',
      address: 'Sector E-11/2, Multi Gardens',
      city: 'Islamabad',
      latitude: 33.6974,
      longitude: 72.9786,
      cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      amenities: ['wifi', 'parking', 'ac', 'female_only', 'prayer_room'],
    },
    {
      name: 'The Grand Barber & Co.',
      description: 'Old-school craftsmanship with modern shears. Hot lather shaves and executive packages.',
      address: 'Bosan Road, Gulgasht Colony',
      city: 'Multan',
      latitude: 30.2289,
      longitude: 71.4851,
      cover_image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
      amenities: ['wifi', 'ac', 'parking', 'prayer_room'],
    },
    {
      name: 'Refined Cuts & Grooming',
      description: 'Contemporary men salon with private grooming cabins and bespoke beard treatment.',
      address: 'Commercial Market, Satellite Town',
      city: 'Rawalpindi',
      latitude: 33.6362,
      longitude: 73.0725,
      cover_image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
      amenities: ['wifi', 'ac', 'refreshments'],
    },
    {
      name: 'Mirage Bridal & Hair Studio',
      description: 'Exquisite bridal transformations, Russian manicure, and keratin blowout treatments.',
      address: 'Kohinoor City, Jaranwala Road',
      city: 'Faisalabad',
      latitude: 31.4082,
      longitude: 73.1114,
      cover_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
      amenities: ['wifi', 'ac', 'female_only', 'kids_area'],
    },
    {
      name: 'Studio Noir Elite Hair Lab',
      description: 'Avant-garde styling studio featuring premium Italian hair colors and texture sculpting.',
      address: 'Khayaban-e-Seher, DHA Phase 6',
      city: 'Karachi',
      latitude: 24.7891,
      longitude: 67.0543,
      cover_image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
      amenities: ['wifi', 'parking', 'ac', 'refreshments', 'prayer_room'],
    },
  ];

  const salonRows = [];
  const amenityRows = [];
  const serviceRows = [];

  SALON_DATA.forEach((data, index) => {
    const sId = randomUUID();
    const ownerId = index % 2 === 0 ? owner1Id : owner2Id;

    salonRows.push({
      id: sId,
      owner_id: ownerId,
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      cover_image_url: data.cover_image_url,
      is_verified: true,
      is_active: true,
    });

    // Amenities
    data.amenities.forEach((amenity) => {
      amenityRows.push({
        id: randomUUID(),
        salon_id: sId,
        amenity,
      });
    });

    // Services (3 services per salon)
    serviceRows.push(
      {
        id: randomUUID(),
        salon_id: sId,
        name: 'Signature Precision Cut & Style',
        description: 'Detailed scalp consultation, wash, precision haircut, and custom styling.',
        duration_minutes: 45,
        price: 2000 + (index * 150),
        category: 'haircut',
      },
      {
        id: randomUUID(),
        salon_id: sId,
        name: 'Beard Sculpt & Hot Towel Treatment',
        description: 'Beard edging, conditioning oil, hot steam towel, and sharp line finish.',
        duration_minutes: 30,
        price: 1200 + (index * 100),
        category: 'beard',
      },
      {
        id: randomUUID(),
        salon_id: sId,
        name: 'Deep Cleansing Charcoal Facial',
        description: 'Exfoliation, deep pore steam, charcoal peel, and hydration mask.',
        duration_minutes: 60,
        price: 3500 + (index * 200),
        category: 'treatment',
      }
    );
  });

  await knex('salons').insert(salonRows);
  await knex('salon_amenities').insert(amenityRows);
  await knex('services').insert(serviceRows);

  // 5. Bookings linked with Customers, Salons, Services & Dressers
  const today = new Date().toISOString().split('T')[0];
  const booking1Id = randomUUID();
  const booking2Id = randomUUID();
  const booking3Id = randomUUID();

  const sampleBookings = [
    {
      id: booking1Id,
      customer_id: customer1Id,
      salon_id: salonRows[0].id,
      service_id: serviceRows[0].id,
      dresser_id: dressers[0].id, // Hamza Tariq
      scheduled_date: today,
      start_time: '14:00:00',
      end_time: '14:45:00',
      status: 'confirmed',
      total_price: serviceRows[0].price,
      notes: 'VIP customer appointment',
    },
    {
      id: booking2Id,
      customer_id: customer2Id,
      salon_id: salonRows[1].id,
      service_id: serviceRows[3].id,
      dresser_id: dressers[3].id, // Zainab Malik
      scheduled_date: today,
      start_time: '16:00:00',
      end_time: '16:45:00',
      status: 'confirmed',
      total_price: serviceRows[3].price,
      notes: 'Prefers quiet session',
    },
    {
      id: booking3Id,
      customer_id: customer3Id,
      salon_id: salonRows[2].id,
      service_id: serviceRows[6].id,
      dresser_id: dressers[1].id, // Bilal Ahmed
      scheduled_date: today,
      start_time: '18:00:00',
      end_time: '18:30:00',
      status: 'confirmed',
      total_price: serviceRows[6].price,
      notes: 'Wedding prep',
    },
  ];

  await knex('bookings').insert(sampleBookings);

  // 6. Slot Resale Listing
  const expiresAt = new Date(`${today}T14:00:00Z`);
  await knex('slot_resale_transactions').insert({
    id: randomUUID(),
    booking_id: booking1Id,
    seller_id: customer1Id,
    listing_price: serviceRows[0].price * 0.8,
    original_price: serviceRows[0].price,
    status: 'listed',
    expires_at: expiresAt,
  });

  // 7. Reviews
  await knex('reviews').insert([
    {
      id: randomUUID(),
      booking_id: booking2Id,
      reviewer_id: customer2Id,
      salon_id: salonRows[1].id,
      rating: 5,
      comment: 'Exceptional service! Zainab was extremely professional and the ambiance was top tier.',
    },
    {
      id: randomUUID(),
      booking_id: booking3Id,
      reviewer_id: customer3Id,
      salon_id: salonRows[2].id,
      rating: 5,
      comment: 'Best barber experience in Karachi. Clean blades, fresh hot towels, highly recommended.',
    },
  ]);

  console.log(`🌱 Seed completed:`);
  console.log(`   - 20 verified salons created across Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan & Peshawar`);
  console.log(`   - 20 professional hair dressers registered with role 'dresser'`);
  console.log(`   - 60 services and full amenities created`);
  console.log(`   - Sample active bookings, resale listing & reviews seeded`);
};
