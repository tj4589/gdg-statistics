// backend/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// // Serve frontend files
// app.use(express.static(path.join(__dirname, "../public")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../index.html"));
// });
// Load environment variables

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Schema and Model ---
const memberSchema = new mongoose.Schema({
  name: String,
  phone: String,
  track: String,
  date: String,
});

const Member = mongoose.model("Member", memberSchema);

// --- API Routes ---

// POST → Register new member
app.post("/api/members", async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.json({ message: "✅ Member saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Error saving member" });
  }
});

// GET → Get all members
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
    const id = req.params.id.trim(); // ✅ fix: no destructuring
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ message: "✅ Member deleted successfully" });
  } catch (error) {
    console.error("❌ Backend error deleting member:", error);
    res.status(500).json({ message: "❌ Error deleting member" });
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "✅ Server is running successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ status: "✅ DB connected", count });
  } catch (err) {
    console.error("❌ DB test failed:", err);
    res.status(500).json({ error: err.message });
  }
});
// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
