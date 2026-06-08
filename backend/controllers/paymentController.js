import Stripe from '../config/stripe.js';
import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const {
    cartItems,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const userId = req.user._id;

  const items = cartItems || orderItems || [];

  const line_items = items.map(item => ({
    price_data: {
      currency: 'lkr',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity || item.qty || 1,
  }));

  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    metadata: {
      userId: userId.toString(),
      orderItems: JSON.stringify(cartItems),
      shippingAddress: JSON.stringify(shippingAddress),
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    },
  });

  res.status(200).json({ url: session.url });
});

export const paymentSuccess = asyncHandler(async (req, res) => {
  const { session_id } = req.query;
  const session = await Stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== 'paid') {
    return res.status(400).json({ message: 'Payment not completed' });
  }

  const meta = session.metadata;
  const order = new Order({
    user: meta.userId,
    orderItems: JSON.parse(meta.orderItems),
    shippingAddress: JSON.parse(meta.shippingAddress),
    paymentMethod: meta.paymentMethod,
    itemsPrice: Number(meta.itemsPrice),
    shippingPrice: Number(meta.shippingPrice),
    totalPrice: Number(meta.totalPrice),
    paymentStatus: 'Paid',
    stripeSessionId: session.id,
    paymentIntentId: session.payment_intent,
    isPaid: true,
    paidAt: new Date(),
  });

  await order.save();

  res.status(200).json({ message: 'Order created', orderId: order._id });
});

export const paymentCancel = (req, res) => {
  res.status(200).json({ message: 'Payment cancelled by user' });
};
