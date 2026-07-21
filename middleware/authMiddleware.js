import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const token = req.cookies?.token || tokenFromHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please Login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token Expired",
    });
  }
};

export default protect;