import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { createUser, findUserByEmail } from "../utils/safeUserLookup.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
});

const sendLoginResponse = (res, user, cookieName, message) => {
  const token = generateToken(user._id, user.role);
  res.cookie(cookieName, token, cookieOptions);
  return res.status(200).json({ success: true, token, message, user: buildUserPayload(user) });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (await findUserByEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });
    const token = generateToken(user._id, "user");
    res.cookie("user_token", token, cookieOptions);
    return res.status(201).json({ success: true, token, message: "Registration Successful", user: buildUserPayload(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user || user.role !== "user" || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid Email or Password" });
    }
    return sendLoginResponse(res, user, "user_token", "Login Successful");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await findUserByEmail(normalizedEmail);
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

    if (!user && normalizedEmail === adminEmail && password === adminPassword) {
      user = await createUser({
        name: "Admin",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: "admin",
      });
    }

    if (!user || user.role !== "admin" || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid admin email or password" });
    }
    return sendLoginResponse(res, user, "admin_token", "Admin login successful");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("user_token", cookieOptions);
  return res.status(200).json({ success: true, message: "User logged out successfully" });
};

export const adminLogout = (req, res) => {
  res.clearCookie("admin_token", cookieOptions);
  return res.status(200).json({ success: true, message: "Admin logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const adminMe = getMe;
