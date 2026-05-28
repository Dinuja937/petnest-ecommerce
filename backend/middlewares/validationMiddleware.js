import { validationResult, check } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  check('name', 'Name is required').trim().not().isEmpty(),
  check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  validateRequest,
];

export const loginValidation = [
  check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  validateRequest,
];
