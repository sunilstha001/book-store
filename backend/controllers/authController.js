import User from '../models/userModel.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import uploadToCloudinary from '../utils/cloudinaryUploader.js';


// --- 1. SIGNUP USER ---
export const signupUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // --- ADMIN LOGIC ---
    // Check if there are any users in the database yet
    const userCount = await User.countDocuments();
    // If this is the first user (count is 0), make them an admin
    const isAdmin = userCount === 0;
    // --- END ADMIN LOGIC ---

    let profilePicUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'profile_pics');
      profilePicUrl = result.secure_url;
    }

    // Create new user, now including the isAdmin flag
    const user = await User.create({
      username,
      password,
      profilePic: profilePicUrl,
      isAdmin, // Set the isAdmin field
    });

    if (user) {
      generateTokenAndSetCookie(res, user._id);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin, // Send isAdmin status to frontend
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 2. LOGIN USER ---
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Check if user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      generateTokenAndSetCookie(res, user._id);
      res.status(200).json({
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// LOGOUT USER
export const logoutUser = (req, res) => {
  // To log out, we just clear the cookie
  res.cookie('jwt_token', '', {
    httpOnly: true,
    expires: new Date(0), // Set it to expire in the past
  });
  res.status(200).json({ message: 'Logged out successfully' });
};