// DukaanSense In-Memory Data Store (Initialized with Patel Stores demo data)

class DukaanStore {
  constructor() {
    this.shop = {
      name: process.env.SHOP_NAME || "Patel Stores",
      owner: process.env.SHOP_OWNER || "Gurpreet Singh",
      role: "Owner",
      currency: "₹"
    };

    this.products = [
      { id: "p1", name: "Good Knight Refill", category: "Household", price: 85, cost: 68, stock: 3, reorderLevel: 6, unit: "piece", barcode: "8901234001" },
      { id: "p2", name: "Britannia Good Day 200g", category: "Bakery & Biscuits", price: 40, cost: 32, stock: 4, reorderLevel: 8, unit: "packet", barcode: "8901234002" },
      { id: "p3", name: "Dettol Antiseptic 250ml", category: "Personal Care", price: 160, cost: 130, stock: 4, reorderLevel: 4, unit: "bottle", barcode: "8901234003" },
      { id: "p4", name: "Surf Excel 1kg", category: "Detergent", price: 145, cost: 118, stock: 6, reorderLevel: 6, unit: "packet", barcode: "8901234004" },
      { id: "p5", name: "Tamatar (Tomato)", category: "Vegetables", price: 35, cost: 25, stock: 6, reorderLevel: 10, unit: "kg", barcode: "8901234005" },
      { id: "p6", name: "Parle-G Biscuit 250g", category: "Bakery & Biscuits", price: 25, cost: 20, stock: 10, reorderLevel: 20, unit: "packet", barcode: "8901234006" },
      { id: "p7", name: "Fortune Sunflower Oil 1L", category: "Cooking Oil", price: 155, cost: 135, stock: 14, reorderLevel: 10, unit: "pouch", barcode: "8901234007" },
      { id: "p8", name: "Tata Salt 1kg", category: "Grocery Staples", price: 28, cost: 22, stock: 25, reorderLevel: 12, unit: "packet", barcode: "8901234008" },
      { id: "p9", name: "Aashirvaad Atta 5kg", category: "Grocery Staples", price: 245, cost: 210, stock: 9, reorderLevel: 8, unit: "bag", barcode: "8901234009" },
      { id: "p10", name: "Amul Butter 100g", category: "Dairy", price: 58, cost: 48, stock: 12, reorderLevel: 8, unit: "pack", barcode: "8901234010" }
    ];

    this.sales = [
      {
        id: "BILL-1001",
        date: "2026-10-17T10:15:00",
        customer: "Walk-in Customer",
        phone: "-",
        paymentMethod: "Cash",
        status: "Completed",
        items: [
          { productId: "p1", name: "Good Knight Refill", qty: 1, price: 85, cost: 68 },
          { productId: "p6", name: "Parle-G Biscuit 250g", qty: 2, price: 25, cost: 20 },
          { productId: "p8", name: "Tata Salt 1kg", qty: 1, price: 28, cost: 22 },
          { productId: "p5", name: "Tamatar (Tomato)", qty: 0.94, price: 35, cost: 25 }
        ],
        subtotal: 171,
        discount: 0,
        total: 171,
        totalCost: 135
      },
      {
        id: "BILL-1002",
        date: "2026-10-17T12:40:00",
        customer: "Suresh Sharma",
        phone: "+91 98200 12345",
        paymentMethod: "UPI",
        status: "Completed",
        items: [
          { productId: "p4", name: "Surf Excel 1kg", qty: 2, price: 145, cost: 118 },
          { productId: "p3", name: "Dettol Antiseptic 250ml", qty: 1, price: 160, cost: 130 },
          { productId: "p6", name: "Parle-G Biscuit 250g", qty: 1, price: 26, cost: 20 }
        ],
        subtotal: 476,
        discount: 0,
        total: 476,
        totalCost: 386
      },
      {
        id: "BILL-1003",
        date: "2026-10-17T14:20:00",
        customer: "Amit Verma",
        phone: "+91 99887 76655",
        paymentMethod: "Udhaar",
        status: "Completed",
        items: [
          { productId: "p2", name: "Britannia Good Day 200g", qty: 3, price: 40, cost: 32 },
          { productId: "p5", name: "Tamatar (Tomato)", qty: 2, price: 35, cost: 25 },
          { productId: "p10", name: "Amul Butter 100g", qty: 1, price: 44, cost: 38 }
        ],
        subtotal: 234,
        discount: 0,
        total: 234,
        totalCost: 237
      }
    ];

    this.expenses = [
      { id: "e1", title: "Shop electricity & inverter bill", amount: 150, date: "2026-10-17", category: "Utilities" },
      { id: "e2", title: "Cleaning supplies & chai for staff", amount: 90, date: "2026-10-17", category: "Daily Operations" }
    ];

    this.udhaarCustomers = [
      { id: "u1", name: "Ramesh Kumar", phone: "+91 98765 43210", balance: 520, daysOverdue: 14, lastPurchased: "2026-10-03", notes: "Regular customer, usually clears monthly" },
      { id: "u2", name: "Sunita Devi", phone: "+91 98123 45678", balance: 424, daysOverdue: 8, lastPurchased: "2026-10-09", notes: "Requested reminder on Saturday" },
      { id: "u3", name: "Amit Verma", phone: "+91 99887 76655", balance: 234, daysOverdue: 1, lastPurchased: "2026-10-17", notes: "From today Bill #BILL-1003" }
    ];

    this.tasks = [
      {
        id: "t1",
        title: "Reorder Good Knight Refill",
        category: "Stock Alert",
        type: "rule",
        priority: "high",
        reason: "Stock reached 3 piece, threshold is 6 piece. High velocity repellent item.",
        status: "open",
        createdAt: "2026-10-17T09:00:00"
      },
      {
        id: "t2",
        title: "Udhaar payment follow-up: Ramesh Kumar (₹520)",
        category: "Credit / Udhaar",
        type: "rule",
        priority: "medium",
        reason: "Balance of ₹520 is unpaid for 14 days. Reached credit limit threshold.",
        status: "open",
        createdAt: "2026-10-17T09:30:00"
      },
      {
        id: "t3",
        title: "Restock Britannia Good Day 200g",
        category: "Stock Alert",
        type: "rule",
        priority: "high",
        reason: "Only 4 packets left. Reorder level is 8 packets.",
        status: "open",
        createdAt: "2026-10-17T11:00:00"
      }
    ];

    this.lastChecked = "2026-10-17T14:30:00";
  }

  // Dashboard calculations matching screenshot
  getDashboardData(period = "today") {
    const validSales = this.sales.filter(s => s.status !== "Cancelled" && s.status !== "Reversed");
    const totalSales = validSales.reduce((acc, s) => acc + s.total, 0);
    const totalCost = validSales.reduce((acc, s) => acc + (s.totalCost || (s.total * 0.8)), 0);
    const totalExpenses = this.expenses.reduce((acc, e) => acc + e.amount, 0);
    const grossProfit = Math.round(totalSales - totalCost);
    const netProfit = grossProfit - totalExpenses;

    const receiptsByMethod = {
      cash: validSales.filter(s => s.paymentMethod.toLowerCase() === "cash").reduce((acc, s) => acc + s.total, 0),
      upi: validSales.filter(s => s.paymentMethod.toLowerCase() === "upi").reduce((acc, s) => acc + s.total, 0),
      card: validSales.filter(s => s.paymentMethod.toLowerCase() === "card").reduce((acc, s) => acc + s.total, 0),
      udhaar: validSales.filter(s => s.paymentMethod.toLowerCase() === "udhaar").reduce((acc, s) => acc + s.total, 0)
    };

    const udhaarPending = this.udhaarCustomers.reduce((acc, u) => acc + u.balance, 0);

    const lowStockItems = this.products
      .filter(p => p.stock <= p.reorderLevel)
      .sort((a, b) => (a.stock / a.reorderLevel) - (b.stock / b.reorderLevel));

    return {
      shop: this.shop,
      period,
      metrics: {
        sales: totalSales,
        billsCount: validSales.length,
        salesGrowth: "+392% vs previous period",
        expenses: totalExpenses,
        expensesNote: "Shop running costs, not stock purchases",
        grossProfit: grossProfit,
        grossProfitNote: "Sales minus cost of goods billed",
        udhaarPending: udhaarPending,
        udhaarCount: this.udhaarCustomers.length,
        udhaarNote: `${this.udhaarCustomers.length} customers with a balance`,
        discountsGiven: validSales.reduce((acc, s) => acc + (s.discount || 0), 0),
        stockBought: 0,
        netProfit: netProfit
      },
      receiptsByMethod,
      lowStock: lowStockItems
    };
  }

  // Create a new sale
  createSale(saleData) {
    const newId = `BILL-${1000 + this.sales.length + 1}`;
    const now = new Date().toISOString();

    let calculatedTotal = 0;
    let calculatedCost = 0;

    const items = (saleData.items || []).map(item => {
      const product = this.products.find(p => p.id === item.productId);
      const price = item.price || (product ? product.price : 0);
      const cost = product ? product.cost : (price * 0.75);
      const qty = Number(item.qty) || 1;

      calculatedTotal += price * qty;
      calculatedCost += cost * qty;

      // Deduct stock if product found
      if (product) {
        product.stock = Math.max(0, product.stock - qty);
      }

      return {
        productId: item.productId,
        name: item.name || (product ? product.name : "Custom Item"),
        qty,
        price,
        cost
      };
    });

    const discount = Number(saleData.discount) || 0;
    const finalTotal = Math.max(0, calculatedTotal - discount);

    const newSale = {
      id: newId,
      date: now,
      customer: saleData.customer || "Walk-in Customer",
      phone: saleData.phone || "-",
      paymentMethod: saleData.paymentMethod || "Cash",
      status: "Completed",
      items,
      subtotal: calculatedTotal,
      discount,
      total: finalTotal,
      totalCost: calculatedCost
    };

    this.sales.unshift(newSale);

    // If payment method is Udhaar, record or update customer udhaar
    if (saleData.paymentMethod === "Udhaar" && saleData.customer) {
      let cust = this.udhaarCustomers.find(u => u.name.toLowerCase() === saleData.customer.toLowerCase());
      if (cust) {
        cust.balance += finalTotal;
        cust.lastPurchased = now;
      } else {
        this.udhaarCustomers.push({
          id: `u${this.udhaarCustomers.length + 1}`,
          name: saleData.customer,
          phone: saleData.phone || "-",
          balance: finalTotal,
          daysOverdue: 0,
          lastPurchased: now,
          notes: `Created from ${newId}`
        });
      }
    }

    return newSale;
  }

  // Add action center task
  addTask(task) {
    const newTask = {
      id: `t${Date.now()}`,
      status: "open",
      createdAt: new Date().toISOString(),
      ...task
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  // Update task status
  updateTask(taskId, status) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      return task;
    }
    return null;
  }
}

export const store = new DukaanStore();
