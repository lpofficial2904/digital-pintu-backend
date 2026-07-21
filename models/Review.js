import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Required for reviews authored by an administrator.
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    review: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },

    avatar: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);
