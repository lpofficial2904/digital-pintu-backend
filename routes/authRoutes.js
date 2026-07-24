// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   getMe,
// } from "../controllers/authController.js";

// import protect from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Auth Route Working",
//   });
// });

// router.post("/register", registerUser);

// router.post("/login", loginUser);

// router.post("/logout", logoutUser);

// router.get("/me", protect, getMe);

// export default router;


// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   getMe,
//   adminLogin,
//   adminLogout,
//   adminMe,
// } from "../controllers/authController.js";

// import protect from "../middleware/authMiddleware.js";
// import adminProtect from "../middleware/adminMiddleware.js";

// const router = express.Router();

// // ================= TEST =================

// router.get("/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Auth Route Working",
//   });
// });

// // ================= USER AUTH =================

// router.post("/register", registerUser);

// router.post("/login", loginUser);

// router.post("/logout", logoutUser);

// router.get("/me", protect, getMe);

// // ================= ADMIN AUTH =================

// router.post("/admin/login", adminLogin);

// router.post("/admin/logout", adminLogout);

// router.get("/admin/me", adminProtect, adminMe);

// export default router;


// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   getMe,
//   adminLogin,
//   adminLogout,
//   adminMe,
// } from "../controllers/authController.js";

// import protect from "../middleware/authMiddleware.js";
// import adminProtect from "../middleware/adminMiddleware.js";

// const router = express.Router();

// // Test
// router.get("/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Auth Route Working",
//   });
// });

// // ================= USER =================

// router.post("/register", registerUser);

// router.post("/login", loginUser);

// router.post("/logout", logoutUser);

// router.get("/me", protect, getMe);

// // ================= ADMIN =================

// // router.post("/admin/login", adminLogin);

// router.post("/api/auth/admin/login", adminLogin);

// // router.post("/admin/logout", adminLogout);
// router.post("/api/auth/admin/logout", adminLogout);

// // router.get("/admin/me", adminProtect, adminMe);
// router.get("/api/auth/admin/me", adminProtect, adminMe);

// export default router;


import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  adminLogin,
  adminLogout,
  adminMe,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import adminProtect from "../middleware/adminMiddleware.js";

const router = express.Router();

// User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

// Admin Routes
router.post("/admin/login", adminLogin);
router.post("/admin/logout", adminLogout);
router.get("/admin/me", adminProtect, adminMe);

export default router;