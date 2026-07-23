import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.trim();

const transporter = emailUser && emailPass
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })
  : null;

export default transporter;
