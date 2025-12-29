import express from 'express';
import protectRoute from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  getUserProfile,
  updateUserProfile,
  addBookToFavorites,
  removeBookFromFavorites,
  getFavoriteBooks,
} from '../controllers/userController.js';

const router = express.Router();

// All these routes are protected. A user MUST be logged in.
router.use(protectRoute);

// /api/users/profile
router
  .route('/profile')
  .get(getUserProfile)
  .put(upload.single('profilePic'), updateUserProfile);

// /api/users/favorites
router
  .route('/favorites')
  .get(getFavoriteBooks)
  .post(addBookToFavorites);

// /api/users/favorites/:id (where :id is the book ID)
router.delete('/favorites/:id', removeBookFromFavorites);

export default router;