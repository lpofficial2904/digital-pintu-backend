import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
          this.name
        )}&background=0891b2&color=fff&bold=true`;
      },
    },

    role: {
      type: String,
      enum: ["user", "admin", "manager", "editor"],
      default: "user",
    },
    status: { type: String, enum: ["Active", "Blocked", "Suspended"], default: "Active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
