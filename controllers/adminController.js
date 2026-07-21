import User from "../models/User.js";
import Review from "../models/Review.js";
import Contact from "../models/Contact.js";
import Service from "../models/service.model.js";
import bcrypt from "bcryptjs";

export const getAdminStats = async (req, res) => {
  try {
    const [services, reviews, contacts, users] = await Promise.all([
      Service.countDocuments(),
      Review.countDocuments(),
      Contact.countDocuments(),
      User.countDocuments(),
    ]);

    const latestServices = await Service.find().sort({ createdAt: -1 }).limit(5);
    const latestReviews = await Review.find().sort({ createdAt: -1 }).limit(5);
    const latestContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        services,
        reviews,
        contacts,
        users,
      },
      latestServices,
      latestReviews,
      latestContacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.status = user.status === "Blocked" ? "Active" : "Blocked";
    await user.save();

    res.json({ success: true, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateContact = async (req, res) => { try { const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!contact) return res.status(404).json({ success:false, message:'Contact not found' }); res.json({success:true, contact}); } catch (error) { res.status(500).json({success:false,message:error.message}); } };
export const updateAdminUser = async (req, res) => { try { const { name, role, status, avatar } = req.body; const user = await User.findByIdAndUpdate(req.params.id, { name, role, status, avatar }, {new:true,runValidators:true}).select('-password'); if(!user)return res.status(404).json({success:false,message:'User not found'}); res.json({success:true,user}); } catch(error){res.status(500).json({success:false,message:error.message});} };
export const bulkReviewStatus = async (req,res) => { try { await Review.updateMany({_id:{$in:req.body.ids||[]}}, {active:Boolean(req.body.active)});res.json({success:true}); } catch(error){res.status(500).json({success:false,message:error.message});} };
export const bulkDeleteReviews = async (req,res) => { try { await Review.deleteMany({_id:{$in:req.body.ids||[]}});res.json({success:true}); } catch(error){res.status(500).json({success:false,message:error.message});} };

export const updateReviewStatus = async (req, res) => {
  try {
    const { active } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { active }, { new: true });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || "admin" });

    res.status(201).json({ success: true, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
