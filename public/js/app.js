// Main Application Entrypoint & Router for DukaanSense
import { dashboard } from "./dashboard.js";
import { actionCenter } from "./actionCenter.js";
import { sales } from "./sales.js";
import { newSale } from "./newSale.js";
import { copilot } from "./copilot.js";
import { api } from "./api.js";

class App {
  constructor() {
    this.currentView = "dashboard";
  }

  init() {
    this.bindNavigation();
    this.bindAuthEvents();
    this.bindGlobalEvents();

    // Initialize sub-modules
    dashboard.init();
    actionCenter.init();
    sales.init();
    newSale.init();
    copilot.init();

    // Load initial products & udhaar views
    this.loadProductsView();
    this.loadUdhaarView();
  }

  bindNavigation() {
    const navItems = document.querySelectorAll(".sidebar-nav .nav-item[data-view]");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const view = item.dataset.view;
        this.switchView(view);
      });
    });

    // Logout button switches to Login view
    const logoutBtn = document.getElementById("nav-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        this.switchView("login");
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav item
    document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update breadcrumb
    const crumb = document.getElementById("breadcrumb-current");
    if (crumb) {
      crumb.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1).replace("-", " ");
    }

    // Toggle panels
    document.querySelectorAll(".view-panel").forEach(panel => {
      panel.classList.remove("active");
    });

    const targetPanel = document.getElementById(`view-${viewName}`);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }

    // Trigger views reload if needed
    if (viewName === "dashboard") dashboard.loadData();
    if (viewName === "action-center") actionCenter.loadTasks();
    if (viewName === "sales") sales.loadSales();
    if (viewName === "products") this.loadProductsView();
    if (viewName === "udhaar") this.loadUdhaarView();
  }

  bindAuthEvents() {
    // Login form handler
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.switchView("dashboard");
      });
    }

    const googleBtn = document.getElementById("btn-google-login");
    if (googleBtn) {
      googleBtn.addEventListener("click", () => {
        this.switchView("dashboard");
      });
    }
  }

  bindGlobalEvents() {
    // Whenever a sale is created in POS modal, refresh dashboard and sales
    window.addEventListener("dukaan:sale_created", () => {
      dashboard.loadData();
      sales.loadSales();
      actionCenter.loadTasks();
      newSale.loadCatalog();
      this.loadProductsView();
      this.loadUdhaarView();
    });
  }

  async loadProductsView() {
    try {
      const res = await api.getProducts();
      if (!res.success) return;

      const tbody = document.getElementById("products-table-body");
      if (!tbody) return;

      tbody.innerHTML = res.products.map(p => {
        const margin = Math.round(((p.price - p.cost) / p.price) * 100);
        const isLow = p.stock <= p.reorderLevel;

        return `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.category}</td>
            <td>₹${p.price} / ${p.unit}</td>
            <td>₹${p.cost}</td>
            <td><span style="color:#047857; font-weight:700;">+${margin}%</span></td>
            <td>
              <span class="stock-pill" style="${!isLow ? 'background:#e2f3e8; color:#1b4332;' : ''}">
                ${p.stock} ${p.unit}
              </span>
            </td>
            <td>${p.reorderLevel} ${p.unit}</td>
            <td>
              <span class="status-pill ${isLow ? 'status-reversed' : 'status-completed'}">
                ${isLow ? 'Low Stock' : 'In Stock'}
              </span>
            </td>
          </tr>
        `;
      }).join("");
    } catch (err) {
      console.error("Failed to load products view:", err);
    }
  }

  async loadUdhaarView() {
    try {
      const res = await api.getUdhaarLedger();
      if (!res.success) return;

      const tbody = document.getElementById("udhaar-table-body");
      if (!tbody) return;

      tbody.innerHTML = res.customers.map(c => `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.phone}</td>
          <td><strong style="color:#b91c1c;">₹${c.balance.toLocaleString("en-IN")}</strong></td>
          <td>
            <span class="status-pill ${c.daysOverdue > 7 ? 'status-reversed' : 'status-pending'}">
              ${c.daysOverdue} days
            </span>
          </td>
          <td>${c.lastPurchased ? new Date(c.lastPurchased).toLocaleDateString() : '-'}</td>
          <td>
            <button class="btn-secondary btn-udhaar-wa" data-customer="${c.name}" data-amount="${c.balance}" data-days="${c.daysOverdue}" style="padding:4px 10px; font-size:0.75rem;">
              Draft WhatsApp
            </button>
          </td>
          <td>
            ${c.balance > 0 ? `
              <button class="btn-primary btn-record-pay" data-cust-id="${c.id}" style="padding:4px 10px; font-size:0.75rem;">
                Clear Balance
              </button>
            ` : '<span style="color:green; font-weight:700;">Cleared</span>'}
          </td>
        </tr>
      `).join("");

      // Bind WhatsApp draft buttons
      tbody.querySelectorAll(".btn-udhaar-wa").forEach(btn => {
        btn.addEventListener("click", () => {
          actionCenter.openWhatsAppModal({
            customer: btn.dataset.customer,
            amount: btn.dataset.amount,
            days: btn.dataset.days
          });
        });
      });

      // Bind Pay buttons
      tbody.querySelectorAll(".btn-record-pay").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.custId;
          await api.recordUdhaarPayment(id);
          this.loadUdhaarView();
          dashboard.loadData();
        });
      });
    } catch (err) {
      console.error("Failed to load Udhaar view:", err);
    }
  }
}

// Boot application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
