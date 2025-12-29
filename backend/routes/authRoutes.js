import express from 'express';
import { signupUser, loginUser, logoutUser } from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// We use 'upload.single('profilePic')' middleware here
// 'profilePic' MUST match the 'name' attribute of your <input type="file">
router.post('/signup', upload.single('profilePic'), signupUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;