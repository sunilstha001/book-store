import multer from 'multer';

// We use 'memoryStorage' to hold the file as a buffer (in RAM)
// instead of saving it to the disk. This is perfect for Cloudinary.
const storage = multer.memoryStorage();

// A simple filter to make sure we only accept image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

export default upload;