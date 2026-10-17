// Standard REST API routes for DukaanSense
import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// GET /api/dashboard
router.get("/dashboard", (req, res) => {
  const period = req.query.period || "today";
  const data = store.getDashboardData(period);
  res.json({
    success: true,
    data
  });
});

// GET /api/sales
router.get("/sales", (req, res) => {
  const { period, paymentMethod, status, search } = req.query;
  let bills = [...store.sales];

  if (paymentMethod && paymentMethod !== "all") {
    bills = bills.filter(b => b.paymentMethod.toLowerCase() === paymentMethod.toLowerCase());
  }

  if (status && status !== "all") {
    bills = bills.filter(b => b.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    bills = bills.filter(b =>
      b.id.toLowerCase().includes(s) ||
      b.customer.toLowerCase().includes(s) ||
      b.phone.toLowerCase().includes(s)
    );
  }

  res.json({
    success: true,
    total: bills.length,
    bills
  });
});

// POST /api/sales - Create new bill
router.post("/sales", (req, res) => {
  try {
    const { items, paymentMethod, customer, phone, discount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required" });
    }

    const created = store.createSale({
      items,
      paymentMethod: paymentMethod || "Cash",
      customer: customer || "Walk-in Customer",
      phone: phone || "-",
      discount: Number(discount) || 0
    });

    res.status(201).json({
      success: true,
      sale: created,
      dashboard: store.getDashboardData("today")
    });
  } catch (err) {
    console.error("Create sale error:", err);
    res.status(500).json({ error: err.message || "Failed to create sale" });
  }
});

// POST /api/sales/:id/reverse - Mark bill as reversed
router.post("/sales/:id/reverse", (req, res) => {
  const bill = store.sales.find(s => s.id === req.params.id);
  if (!bill) {
    return res.status(404).json({ error: "Bill not found" });
  }

  bill.status = "Reversed";
  // Restore stock
  bill.items.forEach(item => {
    const p = store.products.find(prod => prod.id === item.productId);
    if (p) {
      p.stock += item.qty;
    }
  });

  res.json({ success: true, bill });
});

// GET /api/products
router.get("/products", (req, res) => {
  res.json({
    success: true,
    total: store.products.length,
    products: store.products
  });
});

// POST /api/products
router.post("/products", (req, res) => {
  const { name, category, price, cost, stock, reorderLevel, unit, barcode } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Product name and price are required" });
  }

  const newProd = {
    id: `p${store.products.length + 1}`,
    name,
    category: category || "General",
    price: Number(price),
    cost: Number(cost) || Math.round(Number(price) * 0.8),
    stock: Number(stock) || 0,
    reorderLevel: Number(reorderLevel) || 5,
    unit: unit || "piece",
    barcode: barcode || `${Date.now()}`
  };

  store.products.push(newProd);
  res.status(201).json({ success: true, product: newProd });
});

// GET /api/tasks - Action Center tasks
router.get("/tasks", (req, res) => {
  const { status } = req.query;
  let tasks = [...store.tasks];

  if (status && status !== "all") {
    tasks = tasks.filter(t => t.status === status);
  }

  const openCount = store.tasks.filter(t => t.status === "open").length;
  const highPriorityCount = store.tasks.filter(t => t.status === "open" && t.priority === "high").length;

  res.json({
    success: true,
    stats: {
      open: openCount,
      highPriority: highPriorityCount,
      lastChecked: store.lastChecked || "not yet"
    },
    tasks
  });
});

// PATCH /api/tasks/:id - Update status (e.g. done/closed)
router.patch("/tasks/:id", (req, res) => {
  const { status } = req.body;
  const updated = store.updateTask(req.params.id, status || "done");
  if (!updated) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json({ success: true, task: updated });
});

// GET /api/udhaar - Pending customers ledger
router.get("/udhaar", (req, res) => {
  res.json({
    success: true,
    totalPending: store.udhaarCustomers.reduce((acc, u) => acc + u.balance, 0),
    customers: store.udhaarCustomers
  });
});

// POST /api/udhaar/:id/pay - Record repayment
router.post("/udhaar/:id/pay", (req, res) => {
  const { amount } = req.body;
  const cust = store.udhaarCustomers.find(u => u.id === req.params.id);
  if (!cust) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const payAmt = Number(amount) || cust.balance;
  cust.balance = Math.max(0, cust.balance - payAmt);

  res.json({ success: true, customer: cust });
});

export default router;
