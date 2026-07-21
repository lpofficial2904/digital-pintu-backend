import express from "express";
import adminProtect from "../middleware/adminMiddleware.js";
import { getTrackerSummary, recordVisit } from "../controllers/trackerController.js";
const router = express.Router();
router.post("/visit", recordVisit);
router.get("/admin", adminProtect, getTrackerSummary);
export default router;
