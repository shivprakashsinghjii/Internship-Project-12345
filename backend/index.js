const mongoose = require("mongoose");
require("dotenv").config(); // Ensure this is at the top to load environment variables

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server only after successful connection
    startServer();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

function startServer() {
  const express = require("express");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const router = require("./Routes/router"); // Ensure this path is correct

  // Initialize Express application
  const app = express();
  const PORT = process.env.PORT || 4002; // Use PORT defined in .env or default to 4002

  // Middleware
  app.use(express.json()); // Parse JSON request bodies
  app.use(cors());
  app.use(bodyParser.json());
  app.use(router); // Use router from Routes

  // Root route
  app.get("/", (req, res) => {
    res.status(200).send("Hi, It works!");
  });

  // Route to handle data submission
  app.post("/api/device-info", async (req, res) => {
    console.log("Received data:", req.body); // Debugging log
    let { email, browser, os, deviceType, ipAddress } = req.body;

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
      const updatedDeviceInfos = await Promise.all(
        deviceInfos.map(async (info) => {
          if (info.email === "Unknown") {
            const user = await User.findOne({ ipAddress: info.ipAddress }).sort(
              {
                timestamp: -1,
              }
            );
            if (user) {
              info.email = user.email;
            }
          }
          return info;
        })
      );
      res.status(200).json({
        message: "Device information retrieved successfully",
        data: updatedDeviceInfos,
      });
    } catch (error) {
      console.error("Error fetching device info from MongoDB:", error); // Debugging log
      res.status(500).json({ message: "Server error" });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server started at port no ${PORT}`);
  });
}
