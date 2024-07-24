// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./Routes/router"); // Ensure this path is correct
require("./db/conn"); // Ensure this path is correct

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 4002; // Use PORT defined in .env or default to 4002

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors());
app.use(bodyParser.json());
app.use(router); // Use router from Routes

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define the Device schema and model
const deviceSchema = new mongoose.Schema({
  email: String,
  browser: String,
  os: String,
  deviceType: String,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now },
});

const DeviceInfo = mongoose.model("DeviceInfo", deviceSchema);

// Define the User schema and model (assuming 'users' collection)
const userSchema = new mongoose.Schema({
  email: String,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }, // Add a timestamp field for sorting
  // Add other relevant fields
});

const User = mongoose.model("User", userSchema);

// Route to handle data submission
app.post("/api/device-info", async (req, res) => {
  console.log("Received data:", req.body); // Debugging log
  let { email, browser, os, deviceType, ipAddress } = req.body;

  // If email is "Unknown", fetch the latest email from the users collection
  if (email === "Unknown") {
    try {
      const user = await User.findOne({ ipAddress }).sort({ timestamp: -1 });
      if (user) {
        email = user.email;
      }
    } catch (error) {
      console.error("Error fetching email from users collection:", error); // Debugging log
    }
  }

  // Check for existing record with the same data
  try {
    const existingRecord = await DeviceInfo.findOne({
      email,
      browser,
      os,
      deviceType,
      ipAddress,
    });

    if (!existingRecord) {
      const newDeviceInfo = new DeviceInfo({
        email,
        browser,
        os,
        deviceType,
        ipAddress,
      });
      await newDeviceInfo.save();
      return res.status(201).json({ message: "Device info saved" });
    }

    res.status(200).json({ message: "No new data to save" });
  } catch (error) {
    console.error("Error saving data to MongoDB:", error); // Debugging log
    res.status(500).json({ message: "Server error" });
  }
});

// Route to fetch device information
app.get("/api/device-info", async (req, res) => {
  try {
    const deviceInfos = await DeviceInfo.find();
    // For each device info with email "Unknown", fetch the latest email from the users collection
    const updatedDeviceInfos = await Promise.all(
      deviceInfos.map(async (info) => {
        if (info.email === "Unknown") {
          const user = await User.findOne({ ipAddress: info.ipAddress }).sort({
            timestamp: -1,
          });
          if (user) {
            info.email = user.email;
          }
        }
        return info;
      })
    );
    res.status(200).json(updatedDeviceInfos);
  } catch (error) {
    console.error("Error fetching device info from MongoDB:", error); // Debugging log
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at port no ${PORT}`);
});
