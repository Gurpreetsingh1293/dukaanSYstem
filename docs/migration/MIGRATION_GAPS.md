# Migration Gaps & Technical Debt Audit: DukaanSense

**Evidence Status**: `[VERIFIED]` from code inspection & gap analysis.  
**Severity Scale**: High (Financial / Integrity Risk), Medium (Operational Risk), Low (Usability).

---

## 1. High-Severity Technical Gaps & Recommended Fixes

### Gap 1: Invoice Number Collision under Concurrent Billing
- **Severity**: High `[VERIFIED]`
- **Current Code**:
  ```javascript
  const newId = `BILL-${1000 + this.sales.length + 1}`;
  ```
- **Failure Mode**: If two counter terminals submit a sale at the exact same millisecond, both read identical `this.sales.length`, generating duplicate bill IDs (e.g., both generate `BILL-1004`).
- **Impact**: Silent data overwrite or primary key collision in database.
- **Production Fix**: Use a database-backed sequential sequence (`CREATE SEQUENCE bill_seq`) or atomic transactional counter with shop isolation:
  ```sql
  SELECT 'BILL-' || LPAD(nextval('shop_' || :shop_id || '_bill_seq')::text, 5, '0');
  ```

### Gap 2: Lack of Atomic Multi-Table Transactions
- **Severity**: High `[VERIFIED]`
- **Current Code**:
  - Decrements `product.stock`.
  - Appends to `sales`.
  - Appends to `udhaarCustomers`.
- **Failure Mode**: If an exception occurs while updating the Udhaar record, the inventory is already decremented and the sale is recorded, leaving the database in an inconsistent, corrupt state.
- **Production Fix**: Wrap billing inside a database transaction block:
  ```sql
  BEGIN;
  UPDATE products SET stock = stock - :qty WHERE id = :productId AND stock >= :qty;
  INSERT INTO sales_bills (...);
  INSERT INTO sales_bill_items (...);
  UPDATE udhaar_accounts SET balance = balance + :total WHERE customer_id = :custId;
  COMMIT;
  ```

### Gap 3: Missing Idempotency Keys on Expenses & Payments
- **Severity**: Medium `[VERIFIED]`
- **Failure Mode**: Network lag or accidental double-clicking on "Clear Balance" or "Add Expense" causes double payments to be recorded.
- **Production Fix**: Require client-generated UUID `Idempotency-Key` header on all financial mutations, cached in Redis with a 24-hour TTL:
  ```javascript
  const idempotencyKey = req.headers['idempotency-key'];
  if (await redis.exists(`idempotency:${idempotencyKey}`)) {
    return res.status(200).json(cachedResponse);
  }
  ```

### Gap 4: Stored Credit Limits Never Actively Enforced
- **Severity**: Medium `[VERIFIED]`
- **Failure Mode**: Customer entity stores an implicit credit limit, but checkout logic never blocks a sale if $\text{Current Balance} + \text{New Bill} > \text{Credit Limit}$.
- **Production Fix**: Enforce pre-flight validation in the checkout pipeline:
  ```javascript
  if (account.balance + newTotal > account.creditLimit) {
    throw new ValidationError(`Credit limit of ₹${account.creditLimit} exceeded for ${account.name}`);
  }
  ```

### Gap 5: Repayments Not Allocated to Individual Bills (Running Ledger Only)
- **Severity**: Medium `[VERIFIED]`
- **Failure Mode**: A payment of ₹500 reduces the global balance, but does not mark specific historical invoices as settled, making aging disputes difficult to resolve.
- **Production Fix**: Implement First-In-First-Out (FIFO) invoice allocation on debt repayment:
  ```sql
  -- Allocate payment across oldest unpaid invoices
  UPDATE sales_bills SET paid_amount = paid_amount + :alloc
  WHERE customer_id = :custId AND status = 'Pending'
  ORDER BY date ASC;
  ```

### Gap 6: Manual / Absent GST & HSN Tax Automation
- **Severity**: Medium `[INFERRED]`
- **Failure Mode**: The application treats Gross Profit simply as $\text{Sales} - \text{Cost}$ without computing CGST, SGST, or IGST tax splits required for Indian GST registered stores.
- **Production Fix**: Add HSN code and GST rate slab (0%, 5%, 12%, 18%) to product entities, calculating tax breakdowns automatically on invoices.

### Gap 7: Unrestricted Bill Reversals by Staff Members
- **Severity**: High `[VERIFIED]`
- **Failure Mode**: Any cashier or attendant can click "Reverse" on any bill without requiring manager approval or supervisor PIN.
- **Production Fix**: Introduce a 4-digit Owner PIN authorization modal before confirming financial reversals.
