import Review from "../models/Review.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Used only by the protected admin route; the public/user review flow is unchanged.
export const createAdminReview = async (req, res) => {
  try {
    const { name, email, designation, company, review, rating, avatar, active, featured } = req.body;
    const textFields = { name, email, designation, company, review, avatar };
    for (const [field, value] of Object.entries(textFields)) {
      if (!value || !String(value).trim()) return res.status(400).json({ success: false, message: `${field} is required` });
    }
    if (!emailPattern.test(String(email).trim())) return res.status(400).json({ success: false, message: "A valid email is required" });
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) return res.status(400).json({ success: false, message: "Rating must be an integer between 1 and 5" });

    const createdReview = await Review.create({
      name: String(name).trim(), email: String(email).trim().toLowerCase(), designation: String(designation).trim(),
      company: String(company).trim(), review: String(review).trim(), rating: numericRating,
      avatar: String(avatar).trim(), active: Boolean(active), featured: Boolean(featured),
    });
    res.status(201).json({ success: true, message: "Review created", review: createdReview });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to create review" });
  }
};

export const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.set("Cache-Control", "no-store").json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getReviews = async (req, res) => {
  try {
    // console.log("Database:", Review.db.name);

    // The website displays approved reviews only; the admin endpoint remains separate.
    const count = await Review.countDocuments({ active: true });
    // console.log("Total Reviews:", count);

    const reviews = await Review.find({ active: true }).sort({ createdAt: -1 });

    // console.log("Reviews Data:", reviews);

    res.set("Cache-Control", "no-store").json({
      success: true,
      count,
      reviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await Review.create({
  name: req.user.name,

  email: req.user.email,

  avatar: req.user.avatar,

  designation: req.body.designation,

  company: req.body.company,

  review: req.body.review,

  rating: req.body.rating,
});

    res.status(201).json({
      success: true,
      message: "Review Added Successfully",
      review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({
      success: true,
      message: "Review Updated",
      review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    res.json({
      success: true,
      message: "Review Deleted",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
