import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, userId) => {
  // Create the token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Save the token in an HTTP-Only cookie
  res.cookie('jwt_token', token, {
    httpOnly: true, // Prevents JavaScript from reading the cookie
    secure: true, // Set to 'true' in production (when using HTTPS)
    sameSite: "none", // Helps prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateTokenAndSetCookie;