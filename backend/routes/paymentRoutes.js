import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createCheckoutSession,
  paymentSuccess,
  paymentCancel,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/success', paymentSuccess);
router.get('/cancel', paymentCancel);

export default router;
