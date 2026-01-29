// ✅ Import modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Initialize Express
const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://ranchanadevi20_user:Ranchana%40123@cluster0.l0mear5.mongodb.net/myDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ USER SCHEMA
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

// ✅ CATTLE LISTING SCHEMA
const cattleSchema = new mongoose.Schema({
  title: String,
  breed: String,
  age: Number,
  milkCapacity: Number,
  weight: Number,
  price: Number,
  status: {
    type: String,
    default: "Available",
  },
  description: String,
  imageUrl: String,
  sellerName: String,
  sellerContact: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CattleListing = mongoose.model("CattleListing", cattleSchema);

// ✅ ROUTES
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Test API
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Backend 👋" });
});

// Add User
app.post("/api/add-user", async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = new User({ name, email });
    await newUser.save();
    res.json({ success: true, message: "User saved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Add New Cattle Listing
app.post("/api/listings", async (req, res) => {
  try {
    const newListing = new CattleListing(req.body);
    await newListing.save();
    res.status(201).json({ success: true, message: "Cattle listed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get All Cattle Listings
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await CattleListing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get Single Listing by ID
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await CattleListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


