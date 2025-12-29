import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// This function runs before our controller
const protectRoute = async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt_token' cookie
  token = req.cookies.jwt_token;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the token's ID and attach them to the request
      // We 'select(-password)' to remove the password from the user object
      req.user = await User.findById(decoded.userId).select('-password');

      next(); // User is authenticated, proceed to the controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protectRoute;