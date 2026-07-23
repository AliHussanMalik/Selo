const db = require('../config/db');

const getAdminStats = async (req, res) => {
  const [salonsCount] = await db('salons').count('* as count');
  const [usersCount] = await db('users').count('* as count');
  const [bookingsCount] = await db('bookings').count('* as count');
  const [resalesCount] = await db('slot_resale_transactions').where({ status: 'listed' }).count('* as count');

  const [revenueSum] = await db('bookings')
    .where({ status: 'completed' })
    .sum('total_price as total');

  return res.json({
    stats: {
      salons: parseInt(salonsCount.count, 10),
      users: parseInt(usersCount.count, 10),
      bookings: parseInt(bookingsCount.count, 10),
      activeResales: parseInt(resalesCount.count, 10),
      totalRevenue: parseFloat(revenueSum.total || 0),
    },
  });
};

const getAllSalonsAdmin = async (req, res) => {
  const salons = await db('salons')
    .select('salons.*', 'users.full_name as owner_name', 'users.email as owner_email')
    .leftJoin('users', 'salons.owner_id', 'users.id')
    .orderBy('salons.created_at', 'desc');

  return res.json({ salons });
};

const toggleSalonVerification = async (req, res) => {
  const { id } = req.params;

  const salon = await db('salons').where({ id }).first();
  if (!salon) {
    return res.status(404).json({ error: 'Salon not found' });
  }

  const newStatus = !salon.is_verified;
  await db('salons')
    .where({ id })
    .update({ is_verified: newStatus, updated_at: db.fn.now() });

  const updatedSalon = await db('salons').where({ id }).first();

  return res.json({
    message: `Salon ${updatedSalon.is_verified ? 'verified' : 'unverified'} successfully`,
    salon: updatedSalon,
  });
};

const getAllUsersAdmin = async (req, res) => {
  const users = await db('users')
    .select('id', 'full_name', 'email', 'phone', 'role', 'created_at')
    .orderBy('created_at', 'desc');

  return res.json({ users });
};

module.exports = {
  getAdminStats,
  getAllSalonsAdmin,
  toggleSalonVerification,
  getAllUsersAdmin,
};
