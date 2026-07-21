import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER.trim(),
    pass: process.env.EMAIL_PASS.trim(),
  },
});

export default transporter;