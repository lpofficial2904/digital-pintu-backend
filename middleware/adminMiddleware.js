// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const adminProtect = async (req, res, next) => {
//   try {
//    const token=req.cookies.admin_token;

// if(!token){
// return res.status(401).json({
// success:false,
// message:"Please login as admin"
// });
// }

// const decoded=jwt.verify(token,process.env.JWT_SECRET);

// if(decoded.role!=="admin"){
// return res.status(403).json({
// success:false,
// message:"Admin only"
// });
// }

// const user=await User.findById(decoded.id).select("-password");

// if(!user){
// return res.status(401).json({
// success:false
// });
// }

// req.user=user;

// next();

//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// export default adminProtect;



// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const adminProtect = async (req, res, next) => {
//   try {
//     // Sirf admin cookie read hogi
//     const token = req.cookies.admin_token;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Please login as admin",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Double Security
//     if (decoded.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Admin only",
//       });
//     }

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user || user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Admin access required",
//       });
//     }

//     req.user = user;

//     next();
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// export default adminProtect;



import jwt from "jsonwebtoken";
import User from "../models/User.js";

const adminProtect = async (req, res, next) => {
  try {
    // Admin cookie
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login as admin",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token role check
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    // Database user check
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};

export default adminProtect;