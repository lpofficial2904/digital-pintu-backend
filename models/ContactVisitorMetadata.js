import mongoose from "mongoose";

const contactVisitorMetadataSchema = new mongoose.Schema({
  contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true, unique: true },
  visitorId: { type: String, default: "" }, ipAddress: { type: String, default: "Unknown" }, currentPage: { type: String, default: "/" },
  landingPage: { type: String, default: "/" }, referrer: { type: String, default: "Direct" }, browser: { type: String, default: "Unknown" },
}, { timestamps: true });

export default mongoose.model("ContactVisitorMetadata", contactVisitorMetadataSchema);
