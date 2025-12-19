// server/middleware/requireAdmin.js
module.exports = function requireAdmin(req, res, next) {
    const key = req.header("x-admin-key");
  
    if (!process.env.ADMIN_KEY) {
      return res.status(500).json({ error: "ADMIN_KEY not set on server" });
    }
  
    if (!key || key !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    next();
  };
  