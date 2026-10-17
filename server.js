// DukaanSense Server - Integrated Frontend & Backend with Gemini AI
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./routes/api.js";
import geminiRoutes from "./routes/gemini.js";
import { geminiService } from "./services/geminiService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, "public")));

// API Endpoints
app.use("/api", apiRoutes);
app.use("/api/gemini", geminiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    geminiConfigured: geminiService.isConfigured(),
    timestamp: new Date().toISOString()
  });
});

// Single Page Application fallback for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🏪 DukaanSense Server running on http://localhost:${PORT}`);
  console.log(`✨ Gemini AI Status: ${geminiService.isConfigured() ? `CONNECTED (${geminiService.getModelName()})` : "FALLBACK MODE (Set GEMINI_API_KEY in .env)"}`);
  console.log(`📊 Shop: ${process.env.SHOP_NAME || "Patel Stores"} (${process.env.SHOP_OWNER || "Gurpreet Singh"})`);
  console.log(`========================================\n`);
});
