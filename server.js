import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dns from "node:dns";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import serviceRoutes from "./routes/service.routes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trackerRoutes from "./routes/trackerRoutes.js";

dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.connection.on("connected", () => {
  console.log("Mongo Connected");
});

mongoose.connection.on("error", (error) => {
  console.error("Mongo Error", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongo Disconnected");
});

const app = express();

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }

  return /^https:\/\/(?:[a-z0-9-]+\.)*vercel\.app$/i.test(origin);
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Authorization",
    "Accept",
    "Cache-Control",
    "Pragma",
    "Expires",
    "X-Requested-With",
  ],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

// Preflight is handled before every parser and route with the exact same policy
// used for the actual request.
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tracker", trackerRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR", err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
