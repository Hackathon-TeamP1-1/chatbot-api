const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Routes
const userRoutes = require("./routes/UserRoute");
const chatbotRoutes = require("./routes/ChatbotRoute");

// Define API Routes
app.get("/", (req, res) => {
    res.send("Hello, API is running! 🚀");
});

// Mount your routes
app.use("/api/users", userRoutes);
app.use("/api/chatbot", chatbotRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI.replace("<db_password>", process.env.DATABASE_PSSWORD);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Increase server’s timeout to 60 seconds (60,000 ms)
server.setTimeout(120000);
