const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the URL provided in process.env.MONGO_URL.
 * @returns {Promise<mongoose.Connection>} A promise that resolves with the Mongoose connection object.
 */
const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error(
      "MONGO_URL is not defined in environment variables. Please check your .env file.",
    );
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully.");
    return mongoose.connection;
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    // Exit process with failure if connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
