const mongoose = require("mongoose");
const consoleManager = require("../utils/consoleManager");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nikhilchaudhary390:8zpCwsJFOrDOSOt5@userscluster.xnqvw.mongodb.net/?retryWrites=true&w=majority&appName=UsersCluster",
      {
        dbName: "Real_Estates",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
        serverSelectionTimeoutMS: 30000, // Increase server selection timeout to 30 seconds
      }
    );
    consoleManager.log("MongoDB connected successfully");
  } catch (err) {
    consoleManager.error(`MongoDB connection error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
