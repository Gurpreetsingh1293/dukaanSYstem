# Backend REST API Specification: DukaanSense

**Evidence Status**: `[VERIFIED]` from [`routes/api.js`](file:///c:/Users/Mark/Desktop/dukanSense/routes/api.js) and [`routes/gemini.js`](file:///c:/Users/Mark/Desktop/dukanSense/routes/gemini.js)  
**Base URL**: `/api`  
**Content-Type**: `application/json`

---

## 1. Core Store & Dashboard Endpoints

### 1.1 `GET /api/dashboard`
- **Description**: Returns top-level KPIs, receipts breakdown by payment method, and low stock warnings.
- **Query Parameters**:
  - `period` (optional, string): `'today'` (default), `'7days'`, `'30days'`.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "shop": { "name": "Patel Stores", "owner": "Gurpreet Singh", "currency": "₹" },
    "period": "today",
    "metrics": {
      "sales": 881,
      "billsCount": 3,
      "salesGrowth": "+392% vs previous period",
      "expenses": 240,
      "expensesNote": "Shop running costs, not stock purchases",
      "grossProfit": 123,
      "grossProfitNote": "Sales minus cost of goods billed",
      "udhaarPending": 1178,
      "udhaarCount": 3,
      "udhaarNote": "3 customers with a balance",
      "discountsGiven": 0,
      "stockBought": 0,
      "netProfit": -117
    },
    "receiptsByMethod": { "cash": 171, "upi": 476, "card": 0, "udhaar": 234 },
    "lowStock": [
      { "id": "p1", "name": "Good Knight Refill", "stock": 3, "reorderLevel": 6, "unit": "piece" }
    ]
  }
}
```

---

## 2. Sales & POS Billing Endpoints

### 2.1 `GET /api/sales`
- **Query Parameters**:
  - `period` (string): `'today'`, `'7days'`, `'30days'`.
  - `paymentMethod` (string): `'all'`, `'cash'`, `'upi'`, `'card'`, `'udhaar'`.
  - `status` (string): `'all'`, `'completed'`, `'reversed'`.
  - `search` (string): Search query against invoice ID, customer name, or phone.
- **Response `200 OK`**:
```json
{
  "success": true,
  "total": 3,
  "bills": [
    {
      "id": "BILL-1001",
      "date": "2026-10-17T10:15:00.000Z",
      "customer": "Walk-in Customer",
      "phone": "-",
      "paymentMethod": "Cash",
      "status": "Completed",
      "items": [
        { "productId": "p1", "name": "Good Knight Refill", "qty": 1, "price": 85, "cost": 68 }
      ],
      "subtotal": 171,
      "discount": 0,
      "total": 171,
      "totalCost": 135
    }
  ]
}
```

### 2.2 `POST /api/sales`
- **Request Body**:
```json
{
  "items": [
    { "productId": "p1", "name": "Good Knight Refill", "qty": 1, "price": 85 }
  ],
  "paymentMethod": "Udhaar",
  "customer": "Amit Verma",
  "phone": "+91 99887 76655",
  "discount": 0
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "sale": {
    "id": "BILL-1004",
    "date": "2026-10-17T15:00:00.000Z",
    "customer": "Amit Verma",
    "paymentMethod": "Udhaar",
    "total": 85,
    "status": "Completed"
  },
  "dashboard": { /* updated dashboard state */ }
}
```
- **Error `400 Bad Request`**: `{ "error": "At least one item is required" }`

### 2.3 `POST /api/sales/:id/reverse`
- **Description**: Reverses a bill and returns item quantities to active stock.
- **Response `200 OK`**:
```json
{
  "success": true,
  "bill": { "id": "BILL-1001", "status": "Reversed" }
}
```
- **Error `404 Not Found`**: `{ "error": "Bill not found" }`

---

## 3. Product Catalog & Inventory Endpoints

### 3.1 `GET /api/products`
- **Response `200 OK`**:
```json
{
  "success": true,
  "total": 10,
  "products": [
    {
      "id": "p1",
      "name": "Good Knight Refill",
      "category": "Household",
      "price": 85,
      "cost": 68,
      "stock": 3,
      "reorderLevel": 6,
      "unit": "piece",
      "barcode": "8901234001"
    }
  ]
}
```

### 3.2 `POST /api/products`
- **Request Body**:
```json
{
  "name": "Maggi 2-Minute Noodles 70g",
  "category": "Instant Foods",
  "price": 14,
  "cost": 11,
  "stock": 24,
  "reorderLevel": 12,
  "unit": "packet",
  "barcode": "8901058852357"
}
```
- **Response `201 Created`**: `{ "success": true, "product": { "id": "p11", ... } }`

---

## 4. Daily Action Center Endpoints

### 4.1 `GET /api/tasks`
- **Query Parameters**: `status` (`'open'`, `'done'`, `'closed'`, `'all'`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "stats": { "open": 3, "highPriority": 2, "lastChecked": "2026-10-17T14:30:00.000Z" },
  "tasks": [
    {
      "id": "t1",
      "title": "Reorder Good Knight Refill",
      "category": "Stock Alert",
      "type": "rule",
      "priority": "high",
      "reason": "Stock reached 3 piece, threshold is 6 piece.",
      "status": "open"
    }
  ]
}
```

### 4.2 `PATCH /api/tasks/:id`
- **Request Body**: `{ "status": "done" }`
- **Response `200 OK`**: `{ "success": true, "task": { "id": "t1", "status": "done" } }`

---

## 5. Udhaar Credit Ledger Endpoints

### 5.1 `GET /api/udhaar`
- **Response `200 OK`**:
```json
{
  "success": true,
  "totalPending": 1178,
  "customers": [
    {
      "id": "u1",
      "name": "Ramesh Kumar",
      "phone": "+91 98765 43210",
      "balance": 520,
      "daysOverdue": 14,
      "lastPurchased": "2026-10-03"
    }
  ]
}
```

### 5.2 `POST /api/udhaar/:id/pay`
- **Request Body**: `{ "amount": 520 }`
- **Response `200 OK`**:
```json
{
  "success": true,
  "customer": { "id": "u1", "name": "Ramesh Kumar", "balance": 0 }
}
```

---

## 6. Gemini AI Assistant Endpoints

### 6.1 `GET /api/gemini/status`
- **Response `200 OK`**:
```json
{
  "configured": true,
  "model": "gemini-2.5-flash",
  "status": "active",
  "message": "Gemini AI Connected (gemini-2.5-flash)"
}
```

### 6.2 `POST /api/gemini/action-check`
- **Description**: Evaluates store data using Gemini 2.5 Flash and returns prioritized action tasks.
- **Response `200 OK`**:
```json
{
  "success": true,
  "source": "live-gemini",
  "model": "gemini-2.5-flash",
  "analysisSummary": "Shop operations steady. 6 items require replenishment.",
  "tasks": [
    {
      "id": "ai-1729158-1",
      "title": "Weekend Demand Surge: Surf Excel 1kg",
      "category": "Inventory AI Insight",
      "type": "ai",
      "priority": "high",
      "reason": "Surf Excel sees 3x velocity on Saturday morning. Restock 12 units.",
      "status": "open",
      "actionType": "reorder"
    }
  ]
}
```

### 6.3 `POST /api/gemini/udhaar-reminder`
- **Request Body**:
```json
{
  "customer": "Ramesh Kumar",
  "amount": 520,
  "days": 14,
  "phone": "+91 98765 43210"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "source": "live-gemini",
  "customer": "Ramesh Kumar",
  "amount": 520,
  "messageHindi": "नमस्ते Ramesh Kumar जी, आशा है आप सकुशल हैं। Patel Stores से आपका ₹520 का हिसाब बकाया है।",
  "messageEnglish": "Hello Ramesh Kumar, greetings from Patel Stores! A gentle reminder that your pending balance of ₹520 is due.",
  "whatsappUrl": "https://wa.me/?text=..."
}
```

### 6.4 `POST /api/gemini/chat`
- **Request Body**:
```json
{
  "message": "Which product has the highest profit margin in my catalog?",
  "history": []
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "source": "live-gemini",
  "model": "gemini-2.5-flash",
  "reply": "Based on your catalog at Patel Stores, **Tamatar (Tomato)** has the highest margin at 28.5% (Selling price ₹35, Cost ₹25)."
}
```
