// Dashboard Controller for DukaanSense
import { api } from "./api.js";

export const dashboard = {
  currentPeriod: "today",

  init() {
    this.bindEvents();
    this.loadData();
  },

  bindEvents() {
    // Period button filters
    const periodButtons = document.querySelectorAll(".period-toggle-group .pill-btn");
    periodButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        periodButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentPeriod = btn.dataset.period;
        this.loadData();
      });
    });
  },

  async loadData() {
    try {
      const response = await api.getDashboard(this.currentPeriod);
      if (!response.success) return;

      const data = response.data;
      this.renderKPIs(data.metrics);
      this.renderReceipts(data.receiptsByMethod, data.metrics);
      this.renderLowStock(data.lowStock);
      this.renderShopDetails(data.shop);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  },

  renderShopDetails(shop) {
    if (!shop) return;
    const nameEl = document.getElementById("shop-name-display");
    const ownerEl = document.getElementById("shop-owner-display");
    if (nameEl) nameEl.textContent = shop.name;
    if (ownerEl) ownerEl.textContent = `${shop.owner} · Owner`;
  },

  renderKPIs(metrics) {
    if (!metrics) return;
    document.getElementById("kpi-sales").textContent = `₹${metrics.sales.toLocaleString("en-IN")}`;
    document.getElementById("kpi-sales-sub").textContent = `${metrics.billsCount} bills · ${metrics.salesGrowth || "+392% vs previous period"}`;
    
    document.getElementById("kpi-expenses").textContent = `₹${metrics.expenses.toLocaleString("en-IN")}`;
    
    const profitEl = document.getElementById("kpi-gross-profit");
    profitEl.textContent = `₹${metrics.grossProfit.toLocaleString("en-IN")}`;
    if (metrics.grossProfit < 0) {
      profitEl.classList.add("stat-negative");
    } else {
      profitEl.classList.remove("stat-negative");
    }

    document.getElementById("kpi-udhaar").textContent = `₹${metrics.udhaarPending.toLocaleString("en-IN")}`;
    document.getElementById("kpi-udhaar-sub").textContent = metrics.udhaarNote || `${metrics.udhaarCount} customers with a balance`;
  },

  renderReceipts(receipts, metrics) {
    if (!receipts) return;
    document.getElementById("receipt-cash").textContent = `₹${(receipts.cash || 0).toLocaleString("en-IN")}`;
    document.getElementById("receipt-upi").textContent = `₹${(receipts.upi || 0).toLocaleString("en-IN")}`;
    document.getElementById("receipt-card").textContent = `₹${(receipts.card || 0).toLocaleString("en-IN")}`;
    document.getElementById("receipt-udhaar").textContent = `₹${(receipts.udhaar || 0).toLocaleString("en-IN")}`;

    if (metrics) {
      document.getElementById("strip-bills").textContent = metrics.billsCount;
      document.getElementById("strip-discounts").textContent = `₹${metrics.discountsGiven || 0}`;
      document.getElementById("strip-stock-bought").textContent = `₹${metrics.stockBought || 0}`;
      
      const netProfitEl = document.getElementById("strip-net-profit");
      const net = metrics.netProfit || 0;
      netProfitEl.textContent = `${net < 0 ? "-" : ""}₹${Math.abs(net).toLocaleString("en-IN")}`;
      if (net < 0) {
        netProfitEl.classList.add("stat-negative");
      } else {
        netProfitEl.classList.remove("stat-negative");
      }
    }
  },

  renderLowStock(items = []) {
    const container = document.getElementById("low-stock-items-container");
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `<p class="item-subtext" style="padding:16px 0;">All stock levels are optimal.</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="low-stock-row">
        <div>
          <div class="item-name">${item.name}</div>
          <div class="item-subtext">Reorder level ${item.reorderLevel} ${item.unit}</div>
        </div>
        <span class="stock-pill">${item.stock} left</span>
      </div>
    `).join("");
  }
};
