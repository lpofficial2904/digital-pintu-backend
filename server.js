import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import serviceRoutes from "./routes/service.routes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trackerRoutes from "./routes/trackerRoutes.js";

import mongoose from "mongoose";

import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import dotenv from "dotenv";


dotenv.config();

mongoose.connection.on("connected", () => {
  console.log("✅ Mongo Connected");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ Mongo Error");
  console.log(err);
});

mongoose.connection.on("disconnected", () => {
  console.log("❌ Mongo Disconnected");
});


const app = express();

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://127.0.0.1:5173",
//       "http://localhost:5174",
//       "http://127.0.0.1:5174",
//     ],
//     credentials: true,
//   })
// );


// import cors from "cors";

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://digital-pintu-frontend.vercel.app",
//   "https://digital-pintu-frontend-1zasgaw7e-digitalpintu.vercel.app",
//    "https://digital-pintu-admin.vercel.app",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);

//       if (
//         origin === "http://localhost:5173" ||
//         origin.endsWith(".vercel.app")
//       ) {
//         return callback(null, true);
//       }

//       callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://digital-pintu-frontend.vercel.app",
  "https://digital-pintu-frontend-1zasgaw7e-digitalpintu.vercel.app",
  "https://digital-pintu-admin.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming Origin:", origin);

      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options(/.*/, cors());
app.options(/.*/, cors());

app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tracker", trackerRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR");
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = Number(process.env.PORT) || 5000;




app.listen(PORT,"0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
