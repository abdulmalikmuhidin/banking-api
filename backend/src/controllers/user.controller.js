const { publicUser } = require('../services/auth.service');

exports.me = (req, res) => res.json({ data: publicUser(req.user) });
