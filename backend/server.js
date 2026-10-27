import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err.message));
// Schema
const historySchema = new mongoose.Schema({
  num1: Number,
  num2: Number,
  operator: String,
  result: Number,
  createdAt: { type: Date, default: Date.now },
});
const History = mongoose.model("History", historySchema);

// Calculate + save
app.post("/api/calculate", async (req, res) => {
  try {
    const { num1, num2, operator } = req.body;
    const a = Number(num1);
    const b = Number(num2);
    let result;

    switch (operator) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/":
        if (b === 0) return res.status(400).json({ error: "Zero se divide nahi ho sakta" });
        result = a / b;
        break;
      default:
        return res.status(400).json({ error: "Galat operator" });
    }

    const saved = await History.create({ num1: a, num2: b, operator, result });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get history (latest 10)
app.get("/api/history", async (req, res) => {
  const data = await History.find().sort({ createdAt: -1 }).limit(10);
  res.json(data);
});

// Clear history
app.delete("/api/history", async (req, res) => {
  await History.deleteMany({});
  res.json({ message: "History is cleared" });
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});