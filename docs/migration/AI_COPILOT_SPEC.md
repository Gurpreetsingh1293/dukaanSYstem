# AI Co-Pilot & Gemini Engine Specification: DukaanSense

**Evidence Status**: `[VERIFIED]` from [`services/geminiService.js`](file:///c:/Users/Mark/Desktop/dukanSense/services/geminiService.js) and [`routes/gemini.js`](file:///c:/Users/Mark/Desktop/dukanSense/routes/gemini.js)  
**SDK Package**: `@google/genai` (v2.30.0) / `@google/generative-ai` (v0.24.1)  
**Primary Engine**: `gemini-2.5-flash`

---

## 1. Model Configuration & Failover Matrix

| Model Tier | Model Name | Primary Use Case | Latency Target | Retry Limit |
|---|---|---|---|---|
| **Tier 1 (Default)** | `gemini-2.5-flash` | Daily Action Engine, WhatsApp message synthesis, Co-pilot chat | $< 1.5$s | 3 attempts |
| **Tier 2 (Fallback)** | `gemini-1.5-flash` | Quota exhaustion failover | $< 2.0$s | 2 attempts |
| **Tier 3 (High-Reasoning)**| `gemini-1.5-pro` | Monthly P&L audit, tax summary generation | $< 4.5$s | 1 attempt |
| **Tier 4 (Offline/Mock)** | `mock-fallback` | Offline mode, invalid key, or network failure | $< 50$ms | N/A |

### Exponential Backoff Policy `[INFERRED]`
```javascript
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffFactor: 2, // 1s -> 2s -> 4s
  statusCodesToRetry: [429, 500, 503]
};
```

---

## 2. Prompts & Structured Generation

### 2.1 Daily Shop Action Analysis Prompt `[VERIFIED]`
- **System Role**: *"You are DukaanSense AI, an expert retail business advisor for Indian Kirana and grocery stores."*
- **Structured Schema Enforced via `responseMimeType: "application/json"`**:
```json
{
  "analysisSummary": "1-2 sentence executive briefing for the owner",
  "tasks": [
    {
      "title": "Clear concise action title",
      "category": "Stock / Udhaar / Margin / Sales",
      "type": "ai",
      "priority": "high | medium | low",
      "reason": "Exact reason citing data points",
      "actionType": "reorder | whatsapp | discount | merchandising"
    }
  ]
}
```

### 2.2 WhatsApp Udhaar Recovery Prompt `[VERIFIED]`
- **System Instruction**: *"Draft two friendly, respectful payment reminder messages for an Indian grocery customer who has pending credit (Udhaar). Tone: Polite, respectful, maintaining warm neighborhood shopkeeper relationship (no harsh or demanding language)."*
- **Output Schema**:
```json
{
  "messageHindi": "Hinglish / Hindi friendly message with polite tone & emoji",
  "messageEnglish": "Professional yet warm English reminder"
}
```

### 2.3 Conversational Co-pilot Grounding Prompt `[VERIFIED]`
- **Dynamic Context Injection**:
```
Current shop context:
Shop: {shopName}
Today Sales: ₹{sales} across {billsCount} bills
Gross Profit: ₹{grossProfit}
Pending Udhaar: ₹{udhaarPending}
Urgent Low Stock Items: {lowStockList}
Keep answers concise, structured with bullet points and clear numbers.
```

---

## 3. Label Separation & Truth Architecture

To prevent customer distrust or algorithmic confusion, the platform strictly segregates facts from predictions:

```
+-----------------------------------------------------------------------------------------+
|                                  DAILY ACTION CENTER                                    |
+-----------------------------------------------------------------------------------------+
|  [RULE-BASED]  [HIGH PRIORITY]  Stock Alert                                            |
|  Reorder Good Knight Refill                                                             |
|  Evidence: Current stock count is 3 piece, which is strictly below reorder level of 6.  |
|  [Action: Reorder Stock]                                                                |
+-----------------------------------------------------------------------------------------+
|  [✨ GEMINI AI SUGGESTION]  [HIGH PRIORITY]  Inventory AI Insight                        |
|  Weekend Demand Surge: Surf Excel 1kg                                                   |
|  Evidence: Historical velocity shows 3x spike on Saturday laundry runs. Reorder 12 units|
|  [Action: Create Purchase Order]                                                        |
+-----------------------------------------------------------------------------------------+
```

---

## 4. Fallback Mode Specification `[VERIFIED]`

When `GEMINI_API_KEY` is not present in `.env` or network connectivity fails:
1. The server flags response source: `"source": "mock-fallback"`.
2. Header indicator displays: `Gemini Demo Mode (Set Key in .env)`.
3. Pre-computed, deterministic recommendations derived directly from current inventory counts and overdue debts are served seamlessly.
4. No user workflows (billing, ledger, printing) are ever blocked by AI downtime.
