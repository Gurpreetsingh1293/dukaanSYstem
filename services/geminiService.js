// Gemini AI Service for DukaanSense
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let aiClient = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn("⚠️ Failed to initialize GoogleGenAI with provided key:", err.message);
  }
}

export const geminiService = {
  isConfigured() {
    return Boolean(apiKey && apiKey.trim().length > 10);
  },

  getModelName() {
    return modelName;
  },

  // Perform daily intelligent shop analysis
  async analyzeShopDailyAction(shopData) {
    const hasKey = this.isConfigured();

    if (!hasKey || !aiClient) {
      // Return smart fallback simulated data based on real store numbers
      return {
        source: "mock-fallback",
        message: "Gemini API key is not configured in .env. Showing simulated AI analysis.",
        analysisSummary: "Shop operations are steady. Gross margin is 14% on ₹881 sales. 6 items require urgent replenishment.",
        tasks: [
          {
            id: `ai-${Date.now()}-1`,
            title: "Weekend Demand Surge: Surf Excel 1kg",
            category: "Inventory AI Insight",
            type: "ai",
            priority: "high",
            reason: "Surf Excel 1kg (6 left) sees 3x velocity on Saturday morning laundry runs. Restock 12 units by Friday evening.",
            status: "open",
            actionType: "reorder",
            actionData: { productId: "p4", suggestedQty: 12 }
          },
          {
            id: `ai-${Date.now()}-2`,
            title: "Draft polite Udhaar recovery reminder for Ramesh Kumar (₹520)",
            category: "Udhaar AI Recovery",
            type: "ai",
            priority: "medium",
            reason: "Pending 14 days. Gemini AI has prepared a respectful Hindi/English WhatsApp message to collect without damaging customer relations.",
            status: "open",
            actionType: "whatsapp",
            actionData: { customer: "Ramesh Kumar", amount: 520, phone: "+91 98765 43210" }
          },
          {
            id: `ai-${Date.now()}-3`,
            title: "Bundle Britannia Good Day with Evening Tea/Coffee",
            category: "Margin Optimization",
            type: "ai",
            priority: "low",
            reason: "Current gross profit is ₹123. Pairing Good Day biscuits with tea/coffee shelf display can lift average ticket size by ₹40.",
            status: "open",
            actionType: "merchandising"
          }
        ]
      };
    }

    try {
      const prompt = `You are "DukaanSense AI", an expert retail business advisor for Indian Kirana and grocery stores.
Analyze this shop's daily operational metrics:
Shop Name: ${shopData.shop?.name || "Patel Stores"}
Owner: ${shopData.shop?.owner || "Gurpreet Singh"}
Today's Sales: ₹${shopData.metrics?.sales} (${shopData.metrics?.billsCount} bills)
Expenses: ₹${shopData.metrics?.expenses}
Gross Profit: ₹${shopData.metrics?.grossProfit}
Pending Udhaar: ₹${shopData.metrics?.udhaarPending} (${shopData.metrics?.udhaarCount} customers)
Low Stock Items: ${JSON.stringify(shopData.lowStock?.map(p => ({ name: p.name, stock: p.stock, reorderLevel: p.reorderLevel })))}
Udhaar Customers: ${JSON.stringify(shopData.udhaarCustomers?.map(u => ({ name: u.name, balance: u.balance, days: u.daysOverdue })))}

Generate 2 to 3 highly specific, actionable recommendations for today.
Format your response ONLY as valid JSON matching this schema:
{
  "analysisSummary": "1-2 sentence executive briefing for the owner",
  "tasks": [
    {
      "title": "Clear concise action title",
      "category": "Stock / Udhaar / Margin / Sales",
      "type": "ai",
      "priority": "high" or "medium" or "low",
      "reason": "Exact reason citing data points",
      "actionType": "reorder" or "whatsapp" or "discount" or "merchandising"
    }
  ]
}`;

      const response = await aiClient.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);

      return {
        source: "live-gemini",
        model: modelName,
        analysisSummary: parsed.analysisSummary || "Daily check completed successfully.",
        tasks: (parsed.tasks || []).map((t, index) => ({
          id: `ai-${Date.now()}-${index}`,
          status: "open",
          createdAt: new Date().toISOString(),
          ...t
        }))
      };
    } catch (error) {
      console.error("Gemini API Error in analyzeShopDailyAction:", error);
      throw error;
    }
  },

  // Generate personalized WhatsApp Udhaar reminder in English and Hinglish
  async generateUdhaarReminder({ customer, amount, days, phone, shopName = "Patel Stores" }) {
    if (!this.isConfigured() || !aiClient) {
      return {
        source: "mock-fallback",
        customer,
        amount,
        phone,
        messageHindi: `नमस्ते ${customer} जी, आशा है आप सकुशल हैं। ${shopName} की तरफ से आपके पिछले बिल का ₹${amount} बकाया है (${days} दिन)। जब भी समय मिले, कृपया Google Pay / PhonePe या दुकान पर आकर जमा करा दें। धन्यवाद! 🙏`,
        messageEnglish: `Hello ${customer}, greetings from ${shopName}! A gentle reminder that your pending balance of ₹${amount} is due (${days} days). Kindly pay via UPI or whenever you visit the store next. Thank you! 🙏`,
        whatsappUrl: `https://wa.me/?text=${encodeURIComponent(`नमस्ते ${customer} जी, ${shopName} से आपका ₹${amount} का हिसाब बकाया है। कृपया सुविधानुसार भुगतान कर दें। धन्यवाद!`)}`
      };
    }

    try {
      const prompt = `Draft two friendly, respectful payment reminder messages for an Indian grocery customer who has pending credit (Udhaar).
Shop Name: ${shopName}
Customer Name: ${customer}
Pending Amount: ₹${amount}
Days Pending: ${days} days

Tone: Polite, respectful, maintaining warm neighborhood shopkeeper relationship (no harsh or demanding language).
Output ONLY valid JSON with keys:
- "messageHindi": Hinglish / Hindi friendly message with polite tone & emoji
- "messageEnglish": Professional yet warm English reminder`;

      const response = await aiClient.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      const defaultText = parsed.messageHindi || `नमस्ते ${customer} जी, ${shopName} से ₹${amount} का बकाया भुगतान याद दिला रहे हैं। धन्यवाद!`;

      return {
        source: "live-gemini",
        customer,
        amount,
        phone,
        messageHindi: parsed.messageHindi,
        messageEnglish: parsed.messageEnglish,
        whatsappUrl: `https://wa.me/?text=${encodeURIComponent(defaultText)}`
      };
    } catch (err) {
      console.error("Gemini generateUdhaarReminder error:", err);
      throw err;
    }
  },

  // Interactive Dukaan AI Assistant Chat
  async chatWithCopilot({ message, history = [], shopContext = {} }) {
    if (!this.isConfigured() || !aiClient) {
      // Helpful fallback response
      return {
        source: "mock-fallback",
        reply: `Hello! I am your DukaanSense Assistant. Currently running in demo mode.\n\n` +
          `Based on your records today at ${shopContext.shopName || "Patel Stores"}:\n` +
          `• Total Sales: ₹${shopContext.sales || 881} across ${shopContext.billsCount || 3} bills\n` +
          `• Gross Profit: ₹${shopContext.grossProfit || 123}\n` +
          `• Udhaar Pending: ₹${shopContext.udhaarPending || 1178} from 3 customers\n` +
          `• Urgent Reorder: Good Knight Refill (3 left), Britannia Good Day (4 left), Dettol (4 left).\n\n` +
          `💡 *Tip: Add your GEMINI_API_KEY to .env to enable unrestricted real-time AI reasoning!*`
      };
    }

    try {
      const systemInstruction = `You are DukaanSense AI Co-pilot, an intelligent retail assistant for Indian Kirana & neighborhood store owners.
You provide clear, practical business advice in simple language (English/Hinglish).
Current shop context:
Shop: ${shopContext.shopName || "Patel Stores"}
Sales: ₹${shopContext.sales || 881}
Expenses: ₹${shopContext.expenses || 240}
Gross Profit: ₹${shopContext.grossProfit || 123}
Pending Udhaar: ₹${shopContext.udhaarPending || 1178}
Keep answers structured with bullet points and clear numbers.`;

      const contents = [
        { role: "user", parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }] }
      ];

      const response = await aiClient.models.generateContent({
        model: modelName,
        contents: contents
      });

      return {
        source: "live-gemini",
        model: modelName,
        reply: response.text?.trim() || "I processed your request, but received an empty response."
      };
    } catch (err) {
      console.error("Gemini chat error:", err);
      throw err;
    }
  }
};
