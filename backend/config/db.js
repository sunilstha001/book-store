import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // We get the connection string from our .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🍃 MongoDB Connected!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit if we can't connect
  }
};

export default connectDB;