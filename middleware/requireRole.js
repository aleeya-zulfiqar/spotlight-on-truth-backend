module.exports = function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles.includes(role)) {
      return res.status(403).json({ error: "Forbidden — insufficient role" });
    }
    next();
  };
};