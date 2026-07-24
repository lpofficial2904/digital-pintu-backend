import express from "express";
import adminProtect from "../middleware/adminMiddleware.js";
import {
  createAdminUser,
  deleteContact,
  deleteUser,
  getAdminContacts,
  getAdminStats,
  getAdminUsers,
  toggleUserStatus,
  updateReviewStatus,
  updateUserRole,
  updateContact,
  updateAdminUser,
  bulkReviewStatus,
  bulkDeleteReviews,
} from "../controllers/adminController.js";
import { createAdminService, deleteService, getAdminServices, updateService, updateServiceStatus } from "../controllers/service.controller.js";
import { createAdminReview, deleteReview, getAdminReviews, updateReview } from "../controllers/reviewController.js";
import {
adminLogin,
adminLogout,
adminMe
} from "../controllers/authController.js";

const router = express.Router();


router.post("/login",adminLogin);

router.post("/logout",adminLogout);

router.get("/me",adminProtect,adminMe);

router.get("/stats", adminProtect, getAdminStats);
// Protected service management uses the existing service controllers; public routes remain read-only.
router.get("/services", adminProtect, getAdminServices);
router.post("/services", adminProtect, createAdminService);
router.put("/services/:id", adminProtect, updateService);
router.patch("/services/:id/status", adminProtect, updateServiceStatus);
router.delete("/services/:id", adminProtect, deleteService);
router.get("/reviews", adminProtect, getAdminReviews);
router.post("/reviews", adminProtect, createAdminReview);
router.put("/reviews/:id", adminProtect, updateReview);
router.delete("/reviews/:id", adminProtect, deleteReview);
router.patch("/reviews/:id/status", adminProtect, updateReviewStatus);
router.get("/users", adminProtect, getAdminUsers);
router.post("/users", adminProtect, createAdminUser);
router.put("/users/:id/role", adminProtect, updateUserRole);
router.put("/users/:id/status", adminProtect, toggleUserStatus);
router.delete("/users/:id", adminProtect, deleteUser);
router.put("/users/:id", adminProtect, updateAdminUser);
router.get("/contacts", adminProtect, getAdminContacts);
router.delete("/contacts/:id", adminProtect, deleteContact);
router.put("/contacts/:id", adminProtect, updateContact);
router.put("/reviews/:id/status", adminProtect, updateReviewStatus);
router.put("/reviews/bulk-status", adminProtect, bulkReviewStatus);
router.delete("/reviews/bulk-delete", adminProtect, bulkDeleteReviews);

export default router;
