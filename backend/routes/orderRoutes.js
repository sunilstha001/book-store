import express from 'express';
import protectRoute from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
import {
  createOrder,
  getUserOrders,
  getAllOrders, // 1. Import
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/')
  .post(createOrder)
  .get(getUserOrders); // This gets the user's OWN orders

// --- NEW ADMIN ROUTE ---
router.get('/all', admin, getAllOrders); // 2. Add route

router.put('/:id/status', admin, updateOrderStatus);

export default router;