const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export default admin;