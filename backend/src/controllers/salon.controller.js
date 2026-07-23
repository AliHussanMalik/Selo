const { z } = require('zod');
const db = require('../config/db');

const createSalonSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Salon name is required'),
    description: z.string().optional(),
    address: z.string().min(3, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    cover_image_url: z.string().url().optional(),
    amenities: z
      .array(
        z.enum([
          'wifi',
          'parking',
          'ac',
          'kids_area',
          'refreshments',
          'prayer_room',
          'female_only',
        ])
      )
      .optional(),
  }),
});

const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Service name is required'),
    description: z.string().optional(),
    duration_minutes: z.number().int().positive('Duration must be positive minutes'),
    price: z.number().positive('Price must be positive'),
    category: z
      .enum(['haircut', 'color', 'treatment', 'nails', 'makeup', 'beard'])
      .optional()
      .default('haircut'),
  }),
});

const getAllSalons = async (req, res) => {
  const { city, amenity, search } = req.query;

  let query = db('salons').where('is_active', true);

  if (city) {
    query = query.where('city', 'like', `%${city}%`);
  }

  if (search) {
    query = query.where((builder) => {
      builder
        .where('name', 'like', `%${search}%`)
        .orWhere('address', 'like', `%${search}%`);
    });
  }

  if (amenity) {
    query = query.whereIn('id', function () {
      this.select('salon_id')
        .from('salon_amenities')
        .where('amenity', amenity);
    });
  }

  const salons = await query;
  const salonIds = salons.map((s) => s.id);

  let amenitiesMap = {};
  if (salonIds.length > 0) {
    const amenities = await db('salon_amenities').whereIn('salon_id', salonIds);
    amenitiesMap = amenities.reduce((acc, row) => {
      if (!acc[row.salon_id]) acc[row.salon_id] = [];
      acc[row.salon_id].push(row.amenity);
      return acc;
    }, {});
  }

  const enrichedSalons = salons.map((s) => ({
    ...s,
    amenities: amenitiesMap[s.id] || [],
  }));

  return res.json({ salons: enrichedSalons });
};

const getSalonById = async (req, res) => {
  const { id } = req.params;

  const salon = await db('salons').where({ id, is_active: true }).first();
  if (!salon) {
    return res.status(404).json({ error: 'Salon not found' });
  }

  const amenities = await db('salon_amenities')
    .where({ salon_id: id })
    .pluck('amenity');

  const services = await db('services')
    .where({ salon_id: id, is_active: true });

  return res.json({
    salon: {
      ...salon,
      amenities,
      services,
    },
  });
};

const createSalon = async (req, res) => {
  const { name, description, address, city, latitude, longitude, cover_image_url, amenities } = req.body;
  const owner_id = req.user.id;

  const [salon] = await db('salons')
    .insert({
      owner_id,
      name,
      description,
      address,
      city,
      latitude,
      longitude,
      cover_image_url,
    })
    .returning('*');

  if (amenities && amenities.length > 0) {
    const amenityRows = amenities.map((a) => ({
      salon_id: salon.id,
      amenity: a,
    }));
    await db('salon_amenities').insert(amenityRows);
  }

  return res.status(201).json({
    message: 'Salon created successfully',
    salon: {
      ...salon,
      amenities: amenities || [],
    },
  });
};

const addService = async (req, res) => {
  const { id: salon_id } = req.params;
  const { name, description, duration_minutes, price, category } = req.body;

  const salon = await db('salons').where({ id: salon_id }).first();
  if (!salon) {
    return res.status(404).json({ error: 'Salon not found' });
  }

  if (salon.owner_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to add services to this salon' });
  }

  const [service] = await db('services')
    .insert({
      salon_id,
      name,
      description,
      duration_minutes,
      price,
      category: category || 'haircut',
    })
    .returning('*');

  return res.status(201).json({
    message: 'Service added successfully',
    service,
  });
};

const getAvailableSlots = async (req, res) => {
  const { id: salon_id } = req.params;
  const { date, duration_minutes = 30 } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'date query parameter is required (YYYY-MM-DD)' });
  }

  // Simple slot generator between 09:00 and 20:00
  const startHour = 9;
  const endHour = 20;
  const stepMinutes = 30;
  const serviceDuration = parseInt(duration_minutes, 10);

  const existingBookings = await db('bookings')
    .where({ salon_id, scheduled_date: date })
    .whereNotIn('status', ['cancelled', 'resold'])
    .select('start_time', 'end_time');

  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += stepMinutes) {
      const slotStartMins = hour * 60 + min;
      const slotEndMins = slotStartMins + serviceDuration;

      if (slotEndMins > endHour * 60) break;

      const formatTime = (totalMins) => {
        const h = Math.floor(totalMins / 60).toString().padStart(2, '0');
        const m = (totalMins % 60).toString().padStart(2, '0');
        return `${h}:${m}:00`;
      };

      const startTimeStr = formatTime(slotStartMins);
      const endTimeStr = formatTime(slotEndMins);

      const isConflict = existingBookings.some((b) => {
        return startTimeStr < b.end_time && endTimeStr > b.start_time;
      });

      slots.push({
        start_time: startTimeStr,
        end_time: endTimeStr,
        is_available: !isConflict,
      });
    }
  }

  return res.json({ date, slots });
};

module.exports = {
  getAllSalons,
  getSalonById,
  createSalon,
  addService,
  getAvailableSlots,
  createSalonSchema,
  createServiceSchema,
};
