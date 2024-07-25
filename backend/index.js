require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./Routes/router"); // Ensure this path is correct

const corsConfig = {
  origin: ["*"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const app = express();
const PORT = process.env.PORT || 4002;

const mongoURI = process.env.DATABASE;
if (!mongoURI) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    startServer();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

function startServer() {
  app.use(express.json());
  app.use(cors(corsConfig));
  app.use(bodyParser.json());
  app.use(router);

  const deviceSchema = new mongoose.Schema({
    email: String,
    browser: String,
    os: String,
    deviceType: String,
    ipAddress: String,
    timestamp: { type: Date, default: Date.now },
  });

  const DeviceInfo = mongoose.model("DeviceInfo", deviceSchema);

  const userSchema = new mongoose.Schema({
    email: String,
    ipAddress: String,
    timestamp: { type: Date, default: Date.now },
  });

  const User = mongoose.model("User", userSchema);

  app.get("/", (req, res) => {
    res.status(200).send("Hi, It works!");
  });

  app.post("/api/device-info", async (req, res) => {
    console.log("Received data:", req.body);

    let { email, browser, os, deviceType, ipAddress } = req.body;

    if (email === "Unknown") {
      try {
        const user = await User.findOne({ ipAddress }).sort({ timestamp: -1 });
        if (user) {
          email = user.email;
        }
      } catch (error) {
        console.error("Error fetching email from users collection:", error);
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
      console.error("Error saving data to MongoDB:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

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
      console.log(
        "Device information retrieved successfully",
        updatedDeviceInfos
      );
      res.status(200).json({
        message: "Device information retrieved successfully",
        data: updatedDeviceInfos,
      });
    } catch (error) {
      console.error("Error fetching device info from MongoDB:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
}
