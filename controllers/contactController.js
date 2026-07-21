import Contact from "../models/Contact.js";
import transporter from "../config/mail.js";
import ContactVisitorMetadata from "../models/ContactVisitorMetadata.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const sendContact = async (req, res) => {
  try {
    const { name, email, phone, subject, service, message } = req.body;

    if (!name || !name.toString().trim()) {
      return res.status(400).json({ success: false, message: "Name is required." });
    }

    if (!email || !email.toString().trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    if (!message || !message.toString().trim()) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      service: service?.trim() || "",
      message: message.trim(),
    });
    // Additive tracking record: this does not alter the existing Contact collection or response.
    // Tracking is additive and must never prevent the existing enquiry flow from completing.
    await ContactVisitorMetadata.create({ contact: contact._id, visitorId: req.body.visitorId || "", ipAddress: req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress, currentPage: req.body.currentPage || "/", landingPage: req.body.landingPage || "/", referrer: req.body.referrer || "Direct", browser: req.get("user-agent") || "Unknown" }).catch((trackingError) => console.error("Contact tracking error:", trackingError.message));

    const sentAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });


    // console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS?.length);


    await transporter.sendMail({
      from: `"Digital Pintu Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
          <div style="max-width:640px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
            <h2 style="margin:0 0 12px;color:#0f766e;">New Contact Form Submission</h2>
            <p style="margin:0 0 20px;color:#475569;">A new message was submitted from the website contact form.</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;font-weight:bold;width:140px;">Name</td><td>${contact.name}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Email</td><td>${contact.email}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Phone</td><td>${contact.phone || "N/A"}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Service</td><td>${contact.service || "N/A"}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Message</td><td>${contact.message}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Date & Time</td><td>${sentAt}</td></tr>
            </table>
          </div>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact send error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while sending your message.",
    });
  }
};
