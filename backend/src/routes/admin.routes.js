const express = require('express');
const {
  getAdminStats,
  getAllSalonsAdmin,
  toggleSalonVerification,
  getAllUsersAdmin,
} = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/salons', getAllSalonsAdmin);
router.patch('/salons/:id/verify', toggleSalonVerification);
router.get('/users', getAllUsersAdmin);

module.exports = router;
