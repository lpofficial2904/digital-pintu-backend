import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  console.log("Connecting...");

  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log("✅ Connected");
  console.log("Host:", conn.connection.host);
  console.log("Database:", conn.connection.name);

  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}