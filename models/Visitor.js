import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, index: true },
  ipAddress: { type: String, default: "Unknown" },
  browser: { type: String, default: "Unknown" },
  device: { type: String, default: "Unknown" },
  operatingSystem: { type: String, default: "Unknown" },
  country: { type: String, default: "Unknown" }, state: { type: String, default: "Unknown" }, city: { type: String, default: "Unknown" },
  currentPage: { type: String, default: "/" }, landingPage: { type: String, default: "/" }, referrer: { type: String, default: "Direct" },
  visitTime: { type: Date, default: Date.now }, lastActivity: { type: Date, default: Date.now, index: true },
  loggedIn: { type: Boolean, default: false }, userName: { type: String, default: "" }, email: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Visitor", visitorSchema);
