import User from '../models/userModel.js';
import uploadToCloudinary from '../utils/cloudinaryUploader.js';

// --- 1. GET USER PROFILE ---
export const getUserProfile = async (req, res) => {
  try {
    // req.user is attached by our 'protectRoute' middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 2. UPDATE USER PROFILE ---
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = req.body.username || user.username;

    // If they provided a new password, update it
    if (req.body.password) {
      user.password = req.body.password; // The 'pre-save' hook in userModel will hash it
    }

    // Check if a new profile picture was uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'profile_pics');
      user.profilePic = result.secure_url;
    }

    const updatedUser = await user.save();

    // Send back new user data (without password)
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 3. ADD BOOK TO FAVORITES ---
export const addBookToFavorites = async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findById(req.user._id);

    // Check if book is already in favorites
    if (user.favorites.includes(bookId)) {
      return res.status(400).json({ message: 'Book already in favorites' });
    }

    user.favorites.push(bookId);
    await user.save();
    res.status(200).json({ message: 'Book added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 4. REMOVE BOOK FROM FAVORITES ---
export const removeBookFromFavorites = async (req, res) => {
  try {
    const bookId = req.params.id; // Get bookId from URL
    const user = await User.findById(req.user._id);

    // Pull (remove) the bookId from the favorites array
    user.favorites.pull(bookId);
    await user.save();

    res.status(200).json({ message: 'Book removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 5. GET ALL FAVORITE BOOKS ---
export const getFavoriteBooks = async (req, res) => {
  try {
    // Find the user and "populate" their favorites
    // This replaces the Book IDs with the actual Book documents
    const user = await User.findById(req.user._id).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};