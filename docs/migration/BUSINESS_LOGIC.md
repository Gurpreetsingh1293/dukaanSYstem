# Business Logic & Financial Mathematics: DukaanSense

**Evidence Status**: `[VERIFIED]` from [`data/store.js`](file:///c:/Users/Mark/Desktop/dukanSense/data/store.js)  
**Financial Currency**: Indian Rupee (`₹` / INR)  
**Rounding Rule**: Standard Half-Up Banker's Rounding to 2 decimal places (`Math.round` for integers on display)

---

## 1. Money & Period Calculation Formulas

### 1.1 Period Window Boundaries `[VERIFIED]`
All date filters evaluate relative to the merchant's local timezone (IST, UTC+05:30):
- **`today`**: From `YYYY-MM-DD 00:00:00.000` to `YYYY-MM-DD 23:59:59.999`.
- **`7days`**: From `(T - 6 days) 00:00:00.000` to `T 23:59:59.999` (Rolling 7 full calendar days).
- **`30days`**: From `(T - 29 days) 00:00:00.000` to `T 23:59:59.999` (Rolling 30 full calendar days).

### 1.2 Sales & Profit Equations `[VERIFIED]`

$$\text{Subtotal} = \sum_{i=1}^{n} (\text{Qty}_i \times \text{SellingPrice}_i)$$

$$\text{Bill Total} = \max(0, \text{Subtotal} - \text{Discount})$$

$$\text{Cost of Goods Sold (COGS)} = \sum_{i=1}^{n} (\text{Qty}_i \times \text{UnitCost}_i)$$

$$\text{Est. Gross Profit} = \sum (\text{Active Bill Total}) - \sum (\text{Active Bill COGS})$$

$$\text{Net Profit} = \text{Est. Gross Profit} - \sum (\text{Period Expenses})$$

> **Critical Rule**: All invoices where `status == "Cancelled"` or `status == "Reversed"` are strictly filtered out of top-line sales, receipts breakdown, and profit calculations.

---

## 2. Worked Examples (Reconciled with Patel Stores Dataset) `[VERIFIED]`

### Bill Reconciliations
- **Bill #1001 (Cash)**:
  - 1x Good Knight Refill ($₹85$, cost $₹68$)
  - 2x Parle-G Biscuit 250g ($₹50$, cost $₹40$)
  - 1x Tata Salt 1kg ($₹28$, cost $₹22$)
  - 0.94kg Tamatar ($₹33$, cost $₹23.50$)
  - $\text{Total Billed} = ₹171$, $\text{Total Cost} = ₹135$, $\text{Gross Profit} = ₹36$.
- **Bill #1002 (UPI)**:
  - 2x Surf Excel 1kg ($₹290$, cost $₹236$)
  - 1x Dettol Antiseptic 250ml ($₹160$, cost $₹130$)
  - 1x Parle-G Biscuit 250g ($₹26$, cost $₹20$)
  - $\text{Total Billed} = ₹476$, $\text{Total Cost} = ₹386$, $\text{Gross Profit} = ₹90$.
- **Bill #1003 (Udhaar / Credit to Amit Verma)**:
  - 3x Britannia Good Day 200g ($₹120$, cost $₹96$)
  - 2kg Tamatar ($₹70$, cost $₹50$)
  - 1x Amul Butter 100g ($₹44$, cost $₹38$)
  - $\text{Total Billed} = ₹234$, $\text{Total Cost} = ₹237$, $\text{Gross Profit} = -₹3$.

### Period Aggregates (Today)
$$\text{Total Sales} = 171 + 476 + 234 = \mathbf{₹881} \quad (3 \text{ bills})$$
$$\text{Receipts by Method}: \text{Cash } (₹171) + \text{UPI } (₹476) + \text{Card } (₹0) + \text{Udhaar } (₹234) = \mathbf{₹881}$$
$$\text{Total COGS} = 135 + 386 + 237 = \mathbf{₹758}$$
$$\text{Est. Gross Profit} = 881 - 758 = \mathbf{₹123}$$
$$\text{Expenses}: \text{Electricity } (₹150) + \text{Staff Chai } (₹90) = \mathbf{₹240}$$
$$\text{Net Profit} = 123 - 240 = \mathbf{-₹117}$$

### Udhaar Credit Book Reconciliations
- **Ramesh Kumar**: $₹520$ (14 days overdue)
- **Sunita Devi**: $₹424$ (8 days overdue)
- **Amit Verma**: $₹234$ (Created today via Bill #1003)
- $\text{Total Pending Udhaar} = 520 + 424 + 234 = \mathbf{₹1,178}$ across **3 customers**.

---

## 3. The 13 Business Functions Specification

### 1. `createSaleBill` `[VERIFIED]`
- **Action**: Validates cart items, generates sequential invoice ID, deducts shelf inventory, records customer Udhaar if applicable.
- **Inputs**: `{ items: [{ productId, qty, price, cost }], paymentMethod, customer, phone, discount }`
- **Outputs**: `{ id: "BILL-XXXX", total, date, status: "Completed" }`
- **Errors**: `400 Bad Request` if cart is empty or if method is Udhaar without a customer name.
- **Side Effects**: Atomic inventory decrement on `products.stock`. Appends balance to `udhaar_accounts` if payment method is `Udhaar`.

### 2. `reverseSaleBill` `[VERIFIED]`
- **Action**: Marks invoice as `Reversed` without deleting records; restores stock.
- **Inputs**: `billId`
- **Outputs**: Updated bill object `{ id, status: "Reversed" }`.
- **Errors**: `404 Not Found` if bill does not exist.
- **Side Effects**: Increments `products.stock` by the reversed quantities. Excludes bill from dashboard revenue.

### 3. `recordUdhaarRepayment` `[VERIFIED]`
- **Action**: Records partial or full payment against a customer's outstanding debt.
- **Inputs**: `customerId`, `amount` (defaults to full balance if omitted).
- **Outputs**: Updated customer credit record `{ id, balance, status: "Cleared" | "Pending" }`.
- **Errors**: `404 Not Found` if customer missing.
- **Side Effects**: Decrements `udhaar_accounts.balance`. Emits ledger credit entry.

### 4. `checkLowStockAlerts` `[VERIFIED]`
- **Action**: Evaluates all products against reorder threshold.
- **Rule**: $\text{stock} \le \text{reorderLevel}$.
- **Outputs**: Array of low-stock alert tasks tagged `type: "rule"`, `priority: "high"`.
- **Side Effects**: Generates task cards in Daily Action Center.

### 5. `checkOverdueUdhaar` `[VERIFIED]`
- **Action**: Identifies customer balances exceeding acceptable credit period (e.g., 7 or 14 days).
- **Rule**: $\text{daysOverdue} \ge 7 \text{ and } \text{balance} > 0$.
- **Outputs**: Array of credit tasks tagged `priority: "medium" | "high"`.
- **Side Effects**: Activates 1-click WhatsApp recovery button on customer cards.

### 6. `runDailyActionEngine` `[VERIFIED]`
- **Action**: Orchestrator executing both deterministic rule checks and Gemini AI models.
- **Inputs**: Current shop snapshot (sales, expenses, inventory, credit book).
- **Outputs**: Task matrix with deduplicated action items.
- **Side Effects**: Updates `lastChecked` timestamp; stores AI tasks in database.

### 7. `generateWhatsAppUdhaarReminder` `[VERIFIED]`
- **Action**: Prompts Gemini 2.5 Flash to synthesize culturally polite debt collection messages in Hinglish and English.
- **Inputs**: `{ customer, amount, days, phone, shopName }`
- **Outputs**: `{ messageHindi, messageEnglish, whatsappUrl }`
- **Side Effects**: None (idempotent text generation).

### 8. `askDukaanAICopilot` `[VERIFIED]`
- **Action**: Context-grounded multi-turn conversational advisory.
- **Inputs**: User message, session history, real-time store financial state.
- **Outputs**: Markdown formatted advisory response.
- **Side Effects**: Chat session memory update.

### 9. `createProduct` `[VERIFIED]`
- **Action**: Registers a new product SKU into catalog.
- **Inputs**: `{ name, category, price, cost, stock, reorderLevel, unit, barcode }`
- **Outputs**: Created product entity with generated ID.
- **Errors**: `400 Bad Request` if name or price missing.

### 10. `updateStock` `[INFERRED]`
- **Action**: Manual stock count adjustment (for breakages, shrinkage, or audit).
- **Inputs**: `{ productId, newStock, reason }`
- **Side Effects**: Writes entry to `inventory_batches`.

### 11. `recordExpense` `[VERIFIED]`
- **Action**: Logs non-stock daily operating expenditure.
- **Inputs**: `{ title, amount, category, date }`
- **Outputs**: Created expense record.
- **Side Effects**: Reduces net profit calculation immediately.

### 12. `createPurchaseOrder` `[VERIFIED]`
- **Action**: Logs restock deliveries from wholesale distributors.
- **Inputs**: `{ supplierId, items: [{ productId, qty, unitCost }] }`
- **Side Effects**: Increments `products.stock` and records inventory acquisition cost.

### 13. `exportSalesCsv` `[VERIFIED]`
- **Action**: Transforms filtered bill array into standard comma-separated tabular text.
- **Inputs**: Active filter parameters (`period`, `paymentMethod`, `status`, `search`).
- **Outputs**: CSV data blob formatted with standard quotation escapes.
- **Side Effects**: Triggers client-side browser download.
