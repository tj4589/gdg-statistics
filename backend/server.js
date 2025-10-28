import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

// --- Manual CORS Middleware ---
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*" // Or '*' for all origins
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// --- Connect to MongoDB ---
console.log("MONGODB_URI:", process.env.MONGODB_URI);
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Schema and Model ---
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  track: { type: String },
  date: { type: String },
});

const Member = mongoose.model("Member", memberSchema);

// --- API Routes ---
app.post("/api/members", async (req, res) => {
  try {
    const { name, phone, track, date } = req.body;

    // Check if phone number already exists
    const existingMember = await Member.findOne({ phone });
    if (existingMember) {
      return res
        .status(400)
        .json({ message: "❌ Phone number already registered!" });
    }
    const member = new Member(req.body);
    await member.save();
    res.json({ message: "✅ Member saved successfully!" });
  } catch (error) {
    console.error("Error saving member: ", error);
    res.status(500).json({ message: "❌ Error saving member" });
  }
});

app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Error fetching members" });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  try {
    const id = req.params.id.trim();
    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember)
      return res.status(404).json({ message: "Member not found" });
    res.json({ message: "✅ Member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Error deleting member" });
  }
});

// --- Health & test routes ---
app.get("/", (req, res) =>
  res.json({ status: "✅ Server running", timestamp: new Date().toISOString() })
);

app.get("/health", (req, res) =>
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
);

app.get("/test-db", async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ status: "✅ DB connected", count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
