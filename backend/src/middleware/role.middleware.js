const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = { requireRole };
