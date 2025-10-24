// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
// If you're running MongoDB locally, make sure it's started.
// Or use MongoDB Atlas connection string here:
mongoose
  .connect(process.env.MONGO_URI, {
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
  res.send("✅ Server is running successfully!");
});

// --- Start server ---

app.listen(PORT, () => {
  const env = process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`;
  console.log(`🚀 Server running on ${env}`);
});
