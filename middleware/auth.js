const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // 1. Preia tokenul din antetul Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verifica tokenul
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }

    // 3. Verifica daca utilizatorul inca exista in BD
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'The account belonging to this token no longer exists.' });
    }

    // 4. Ataseaza utilizatorul la request pentru handler-ele urmatoare
    req.user = user;
    next();

  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
