import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Visitor from "../models/Visitor.js";

const value = (input, fallback = "Unknown") => String(input || fallback).trim().slice(0, 500);
const parseAgent = (agent = "") => ({ browser: /Firefox/i.test(agent) ? "Firefox" : /Edg/i.test(agent) ? "Edge" : /Chrome/i.test(agent) ? "Chrome" : /Safari/i.test(agent) ? "Safari" : "Unknown", device: /Mobi|Android|iPhone/i.test(agent) ? "Mobile" : "Desktop", operatingSystem: /Windows/i.test(agent) ? "Windows" : /Android/i.test(agent) ? "Android" : /iPhone|iPad|Mac/i.test(agent) ? "Apple" : /Linux/i.test(agent) ? "Linux" : "Unknown" });

const optionalUser = async (req) => { try { const token = req.cookies?.token; if (!token) return null; const { id } = jwt.verify(token, process.env.JWT_SECRET); return User.findById(id).select("name email"); } catch { return null; } };

export const recordVisit = async (req, res) => {
  try {
    const user = await optionalUser(req); const agent = parseAgent(req.get("user-agent")); const now = new Date();
    const payload = { ipAddress: value(req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress), ...agent, currentPage: value(req.body.currentPage, "/"), landingPage: value(req.body.landingPage, "/"), referrer: value(req.body.referrer, "Direct"), country: value(req.headers["cf-ipcountry"]), state: value(req.headers["x-vercel-ip-country-region"]), city: value(req.headers["x-vercel-ip-city"]), lastActivity: now, loggedIn: Boolean(user), userName: user?.name || "", email: user?.email || "" };
    const visitor = await Visitor.findOneAndUpdate({ visitorId: value(req.body.visitorId, "anonymous") }, { $set: payload, $setOnInsert: { visitTime: now } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.status(201).json({ success: true, visitorId: visitor._id });
  } catch (error) { res.status(500).json({ success: false, message: "Unable to record visit" }); }
};

export const getTrackerSummary = async (req, res) => { try { const start = new Date(); start.setHours(0,0,0,0); const onlineSince = new Date(Date.now() - 5 * 60 * 1000); const [total, online, today, visitors] = await Promise.all([Visitor.countDocuments(), Visitor.countDocuments({ lastActivity: { $gte: onlineSince } }), Visitor.countDocuments({ visitTime: { $gte: start } }), Visitor.find().sort({ lastActivity: -1 }).limit(50)]); res.json({ success: true, stats: { total, online, today }, visitors }); } catch (error) { res.status(500).json({ success: false, message: error.message }); } };
