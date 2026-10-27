module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden: You do not possess the required permissions for this resource.',
        requiredRoles: allowedRoles,
        currentRole: req.user ? req.user.role : null
      });
    }
    next();
  };
};
