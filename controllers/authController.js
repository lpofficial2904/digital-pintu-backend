import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { createUser, findUserByEmail } from "../utils/safeUserLookup.js";

const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
});

// ================= REGISTER =================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await findUserByEmail(normalizedEmail);

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(201).json({
      success: true,
      token,
      message: "Registration Successful",
      user: buildUserPayload(user),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= LOGIN =================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await findUserByEmail(normalizedEmail);

    if (!user) {
      const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

      if (normalizedEmail === adminEmail && password === adminPassword) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        user = await createUser({
          name: "Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        });

        if (!user) {
          user = {
            _id: `local-admin-${Date.now()}`,
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            avatar: "",
          };
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }
    }

    if (!user || !user.role) {
      return res.status(500).json({
        success: false,
        message: "Authentication data is unavailable",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = generateToken(user._id);

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
    return res.status(200).json({
      success: true,
      token,
      message: "Login Successful",
      user: buildUserPayload(user),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= LOGOUT =================

export const logoutUser = (req, res) => {
  // res.cookie("token", "", {
  //   httpOnly: true,
  //   expires: new Date(0),
  // });


 res.cookie("token", "", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(0),
});

  res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
};

// ================= CURRENT USER =================

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
