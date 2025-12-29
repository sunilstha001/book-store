import express from 'express';
import protectRoute from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js'; // 1. IMPORT ADMIN
import upload from '../middleware/uploadMiddleware.js';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';

const router = express.Router();

// --- Public Routes ---
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// --- Admin/Protected Routes ---
// Only an admin can create, update, or delete books
router
  .route('/')
  .post(protectRoute, admin, upload.single('bookImage'), createBook); // 2. ADD ADMIN

router
  .route('/:id')
  .put(protectRoute, admin, upload.single('bookImage'), updateBook) // 3. ADD ADMIN
  .delete(protectRoute, admin, deleteBook); // 4. ADD ADMIN

export default router;