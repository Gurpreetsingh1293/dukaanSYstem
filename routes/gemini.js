// Gemini AI Router for DukaanSense
import express from "express";
import { geminiService } from "../services/geminiService.js";
import { store } from "../data/store.js";

const router = express.Router();

// GET /api/gemini/status
router.get("/status", (req, res) => {
  res.json({
    configured: geminiService.isConfigured(),
    model: geminiService.getModelName(),
    status: geminiService.isConfigured() ? "active" : "needs_key",
    message: geminiService.isConfigured()
      ? `Gemini AI Connected (${geminiService.getModelName()})`
      : "Gemini API key not found in .env. Running in simulated fallback mode."
  });
});

// POST /api/gemini/action-check
router.post("/action-check", async (req, res) => {
  try {
    const dashboardData = store.getDashboardData("today");
    const shopData = {
      ...dashboardData,
      udhaarCustomers: store.udhaarCustomers
    };

    const aiResult = await geminiService.analyzeShopDailyAction(shopData);

    // Save generated AI tasks into store
    if (aiResult.tasks && aiResult.tasks.length > 0) {
      aiResult.tasks.forEach(task => {
        store.addTask(task);
      });
    }

    store.lastChecked = new Date().toISOString();

    res.json({
      success: true,
      lastChecked: store.lastChecked,
      ...aiResult
    });
  } catch (error) {
    console.error("Action check error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to run Gemini daily check"
    });
  }
});

// POST /api/gemini/udhaar-reminder
router.post("/udhaar-reminder", async (req, res) => {
  try {
    const { customer, amount, days, phone } = req.body;
    if (!customer || !amount) {
      return res.status(400).json({ error: "Customer name and amount are required" });
    }

    const result = await geminiService.generateUdhaarReminder({
      customer,
      amount,
      days: days || 1,
      phone,
      shopName: store.shop.name
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Udhaar reminder error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/gemini/chat
router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const dash = store.getDashboardData("today");
    const shopContext = {
      shopName: store.shop.name,
      owner: store.shop.owner,
      sales: dash.metrics.sales,
      expenses: dash.metrics.expenses,
      grossProfit: dash.metrics.grossProfit,
      udhaarPending: dash.metrics.udhaarPending,
      billsCount: dash.metrics.billsCount
    };

    const result = await geminiService.chatWithCopilot({
      message,
      history,
      shopContext
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Gemini chat error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
