# Project Overview: DukaanSense (DukaanSystem)

**Evidence Status**: `[VERIFIED]` / `[OBSERVED]`  
**Domain**: Indian Neighborhood Retail (Kirana / General Merchant Store Management)  
**Primary Brand Slogan**: *"Shop · Numbers · Decisions"*

---

## 1. Executive Summary

DukaanSense is a domain-specialized retail operating system and decision engine tailored for Indian small and medium grocery stores (Kirana dukaans). Traditional Indian retail operates under unique operational dynamics: high transaction frequency, thin gross margins (8% to 20%), a substantial volume of informal credit extended to trusted neighborhood patrons (**Udhaar**), and unpredictable consumer purchasing patterns.

While existing general-purpose point-of-sale systems focus primarily on inventory counting or heavy ERP bookkeeping, DukaanSense focuses directly on the shopkeeper's financial reality: **Numbers, Margins, Credit Recovery, and Daily Actionable Decisions**.

---

## 2. Target Personas

### Persona 1: The Shop Owner (e.g., Gurpreet Singh, Patel Stores) `[OBSERVED]`
- **Role**: Primary stakeholder, inventory purchaser, credit risk manager, and business strategist.
- **Pain Points**:
  - Unclear daily net profit after paying operating expenses (electricity, staff chai, packaging).
  - Uncollected Udhaar aging beyond 14–30 days, causing working capital crunches.
  - Stockouts on fast-moving household essentials (e.g., Surf Excel, Parle-G, Good Knight) losing customers to competitors.
  - Reluctance to send aggressive payment demands that could offend neighborhood regulars.
- **DukaanSense Value**: Clear gross and net profit figures every evening; AI-drafted polite WhatsApp reminders that recover cash without damaging relationships.

### Persona 2: The Counter Attendant / Cashier `[INFERRED]`
- **Role**: High-speed billing during evening peak hours (6:00 PM – 9:30 PM).
- **Pain Points**:
  - Complex multi-step checkout processes that slow down the counter queue.
  - Forgetting to deduct inventory or manually writing in paper Khata books.
- **DukaanSense Value**: Single-modal POS billing with instant item selection, automatic payment method attribution (Cash, UPI, Card, Udhaar), and zero lag.

---

## 3. Core Problems Addressed

```
[ Problem 1: Khata Ledger Leakage ]
  Paper khata books lead to forgotten debts, disputed balances, and slow repayments.
  --> Solved by: Real-time digital Udhaar book with customer balance aging and 1-click WhatsApp drafts.

[ Problem 2: Misleading Top-Line Sales ]
  A shopkeeper celebrating ₹20,000 in daily sales might actually be losing money due to high COGS and uncontrolled overheads.
  --> Solved by: Immediate Gross Profit calculation (Sales minus Cost of Goods Sold) and Net Profit (Gross minus Expenses).

[ Problem 3: Decision Fatigue & Stockouts ]
  Hundreds of SKUs make it difficult to know what to reorder until the shelf is completely empty.
  --> Solved by: Daily Action Center separating hard rule-based threshold alerts from predictive Gemini AI restock advice.
```

---

## 4. Key Value Propositions

1. **Rule-Based Integrity vs. AI Separation `[VERIFIED]`**:
   - The platform strictly separates objective facts (e.g., stock count is 3, below reorder level 6) from subjective AI advice (e.g., bundle biscuits with evening tea).
   - This ensures the merchant always trusts the accounting data while benefiting from AI optimization.

2. **Frictionless Multimodal Payment Attribution `[VERIFIED]`**:
   - Every bill attributes receipts to Cash, UPI, Card, or Udhaar.
   - Pending Udhaar automatically syncs into the customer's balance history without requiring double-entry bookkeeping.

3. **Built-in AI Co-pilot for Non-Technical Merchants `[VERIFIED]`**:
   - Embedded Google Gemini integration allows merchants to ask plain-language questions in English or Hinglish about margins, fast-moving items, and debt collection.

4. **Reversible Accounting Ledger `[VERIFIED]`**:
   - No financial records are silently deleted. Returns and cancellations are explicitly recorded as "Reversed", ensuring a traceable audit trail.
