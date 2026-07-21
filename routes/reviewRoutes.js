import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviews);

// router.post("/", createReview);
router.post("/", protect, createReview);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

export default router;