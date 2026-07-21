import express from "express";
import { createService, deleteService, getService, getServices, updateService } from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getServices);
router.get("/:slug", getService);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
