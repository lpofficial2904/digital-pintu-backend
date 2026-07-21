import Service from "../models/service.model.js";
import slugify from "slugify";

const toSlug = (value) => slugify(value, { lower: true, strict: true, trim: true });

// Admin needs the complete catalogue to manage inactive services; public reads stay active-only.
export const getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
    res.set("Cache-Control", "no-store").json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req, res) => {
  try {
    // console.log("Database:", Service.db.name);

    // Public catalogue requests must never expose inactive services.
    const count = await Service.countDocuments({ isActive: true });
    // console.log("Total Services:", count);

    const services = await Service.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });

    // console.log("Services Data:", services);

    // Prevent an intermediary/browser cache from serving a pre-admin-update list.
    res.set("Cache-Control", "no-store").json(services);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.set("Cache-Control", "no-store").json(service);
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.title) payload.slug = toSlug(payload.title);
    const service = await Service.create(payload);
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

// Protected admin create keeps the public POST response contract unchanged.
export const createAdminService = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.title) payload.slug = toSlug(payload.title);
    const service = await Service.create(payload);
    res.status(201).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.title && !payload.slug) payload.slug = toSlug(payload.title);
    const service = await Service.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ message: "Service not found" });
    // Return the saved document so admin clients can update local state immediately.
    res.json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ success: true, message: "Deleted successfully", service });
  } catch (error) {
    next(error);
  }
};

// A narrow status mutation avoids replacing other service fields during a toggle.
export const updateServiceStatus = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: Boolean(req.body.isActive) },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, service });
  } catch (error) {
    next(error);
  }
};
