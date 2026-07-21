import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    service: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    subject: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["New", "In Progress", "Completed", "Closed"], default: "New" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Contact", contactSchema);
