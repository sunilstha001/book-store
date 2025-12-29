import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

/**
 * This function uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from 'req.file.buffer'
 * @param {string} folder - The folder name in Cloudinary (e.g., 'profile_pics')
 * @returns {Promise<object>} - The Cloudinary upload result (contains URL)
 */
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    // Create an upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder, // The folder to save in
      },
      (error, result) => {
        if (error) {
          reject(error); // Failed
        } else {
          resolve(result); // Success!
        }
      }
    );

    // This "pipes" the file buffer into the upload stream
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default uploadToCloudinary;