# Verification & Quality Assurance Test Plan: DukaanSense

**Evidence Status**: `[INFERRED]` Test Strategy & `[VERIFIED]` Edge Scenarios  
**Scope**: Unit, Integration, Concurrency, and Money Math Verification

---

## 1. Test Suite Matrix

| Layer | Framework Target | Test Scope | Critical Scenarios |
|---|---|---|---|
| **Unit Tests** | Vitest / Jest | Financial formulas, rounding, stock deductions | Fractional weights, margin calculations, discount boundaries. |
| **Integration Tests** | Supertest | REST endpoints (`/api/sales`, `/api/tasks`) | Bill creation with Udhaar update, reversal restoring stock. |
| **AI Contract Tests**| Mocked AI SDK | Gemini response parser, fallback switches | Schema validation, markdown formatting, quota backoff. |
| **End-to-End (E2E)** | Playwright | Full browser checkout flow, UI transitions | Cart add, payment pill toggle, modal bill generation. |

---

## 2. Critical Edge Cases & Acceptance Criteria

### 2.1 Money & Fractional Weight Math `[VERIFIED]`
- **Scenario**: Customer buys $0.94\text{ kg}$ of tomatoes priced at $₹35.00/\text{kg}$.
- **Expected Subtotal**: $0.94 \times 35 = 32.90 \to \mathbf{₹33.00}$ (Half-Up rounding).
- **Cost Calculation**: $0.94 \times 25 = 23.50 \to \mathbf{₹23.50}$.
- **Gross Profit**: $32.90 - 23.50 = \mathbf{₹9.40}$.
- **Pass Criteria**: No floating-point precision drift (e.g., `32.89999999999999`).

### 2.2 Bill Reversal Stock Restoration `[VERIFIED]`
- **Scenario**: Product $P_1$ has initial stock of 3 units. A bill is completed for 2 units (stock drops to 1). The merchant clicks "Reverse".
- **Pass Criteria**:
  1. `products.stock` returns to exactly 3.
  2. Bill status changes to `Reversed`.
  3. Dashboard total sales and gross profit instantly subtract the reversed amounts.

### 2.3 Udhaar Customer Attribution `[VERIFIED]`
- **Scenario**: Cashier selects "Udhaar" as payment method but leaves customer name empty or as "Walk-in Customer".
- **Pass Criteria**: API must reject request with `400 Bad Request` (`"Please enter a customer name for Udhaar credit purchases"`).

### 2.4 Concurrent Billing Race Condition `[UNKNOWN]`
- **Scenario**: Two cashiers submit sales simultaneously when 1 unit of Surf Excel remains.
- **Pass Criteria**: One sale completes successfully; second sale fails with `409 Conflict` (Insufficient stock) rather than reducing stock to negative.

### 2.5 Gemini Timeout & Failover `[VERIFIED]`
- **Scenario**: Upstream Gemini API call exceeds 5000ms or returns HTTP 429 quota exhausted.
- **Pass Criteria**: Server catches error, logs warning, returns structured fallback analysis without crashing the UI.
