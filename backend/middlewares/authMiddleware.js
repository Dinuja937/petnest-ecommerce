import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies ? req.cookies.jwt : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (minus password) to the request object
      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
