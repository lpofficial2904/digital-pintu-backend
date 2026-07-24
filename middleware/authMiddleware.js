// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || "";
//     const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
//     // const token = req.cookies?.token || tokenFromHeader;

//     const token = req.cookies?.user_token || tokenFromHeader;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Please Login",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// if(decoded.role!=="user"){
// return res.status(401).json({
// success:false,
// message:"User authentication required"
// });
// }
// }


//     req.user = await User.findById(decoded.id).select("-password");

//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "User Not Found",
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Token Expired",
//     });
//   }
// };

// export default protect;



import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    // Token from Cookie OR Authorization Header
    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : "";

    const token = req.cookies?.user_token || tokenFromHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only normal users are allowed
    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Find User
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default protect;