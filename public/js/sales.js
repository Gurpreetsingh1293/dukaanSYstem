// Sales Ledger Controller
import { api } from "./api.js";

export const sales = {
  currentPeriod: "7days",
  bills: [],

  init() {
    this.bindEvents();
    this.loadSales();
  },

  bindEvents() {
    // Period buttons
    const periodButtons = document.querySelectorAll("[data-sales-period]");
    periodButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        periodButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentPeriod = btn.dataset.salesPeriod;
        this.loadSales();
      });
    });

    // Payment method & status filters
    const methodSelect = document.getElementById("filter-payment-method");
    const statusSelect = document.getElementById("filter-status");
    const searchInput = document.getElementById("sales-search-input");

    if (methodSelect) methodSelect.addEventListener("change", () => this.loadSales());
    if (statusSelect) statusSelect.addEventListener("change", () => this.loadSales());
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        clearTimeout(this._searchTimer);
        this._searchTimer = setTimeout(() => this.loadSales(), 300);
      });
    }

    // Export CSV
    const exportBtn = document.getElementById("btn-export-csv");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportCSV());
    }
  },

  async loadSales() {
    const method = document.getElementById("filter-payment-method")?.value || "all";
    const status = document.getElementById("filter-status")?.value || "all";
    const search = document.getElementById("sales-search-input")?.value || "";

    try {
      const res = await api.getSales({
        period: this.currentPeriod,
        paymentMethod: method,
        status: status,
        search: search
      });

      if (!res.success) return;
      this.bills = res.bills || [];
      this.renderTable(this.bills);
    } catch (err) {
      console.error("Failed to load sales bills:", err);
    }
  },

  renderTable(bills = []) {
    const tbody = document.getElementById("sales-table-body");
    if (!tbody) return;

    if (bills.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:32px; color:var(--text-muted);">
            No sales bills found matching the selected filters.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = bills.map(bill => {
      const date = new Date(bill.date);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const itemsSummary = (bill.items || []).map(i => `${i.name} (${i.qty})`).join(", ");
      const isReversed = bill.status === "Reversed";

      return `
        <tr style="${isReversed ? 'opacity:0.6; text-decoration:line-through;' : ''}">
          <td><strong>${bill.id}</strong></td>
          <td>${timeStr}</td>
          <td>${bill.customer}</td>
          <td style="max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${itemsSummary}">
            ${itemsSummary}
          </td>
          <td><span class="status-pill status-pending">${bill.paymentMethod}</span></td>
          <td>
            <span class="status-pill ${isReversed ? 'status-reversed' : 'status-completed'}">
              ${bill.status}
            </span>
          </td>
          <td class="text-right"><strong>₹${(bill.total || 0).toLocaleString("en-IN")}</strong></td>
          <td class="text-right">
            ${!isReversed ? `
              <button class="btn-secondary btn-reverse-bill" data-bill-id="${bill.id}" style="padding:4px 10px; font-size:0.75rem;">
                Reverse
              </button>
            ` : '<span style="font-size:0.75rem; color:var(--text-muted);">Reversed</span>'}
          </td>
        </tr>
      `;
    }).join("");

    // Bind reverse buttons
    tbody.querySelectorAll(".btn-reverse-bill").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.billId;
        if (confirm(`Are you sure you want to reverse bill ${id}? Stock will be refunded.`)) {
          await api.reverseSale(id);
          this.loadSales();
        }
      });
    });
  },

  exportCSV() {
    if (this.bills.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Bill ID", "Date", "Customer", "Phone", "Payment Method", "Status", "Total Amount"];
    const rows = this.bills.map(b => [
      b.id,
      b.date,
      `"${b.customer}"`,
      `"${b.phone}"`,
      b.paymentMethod,
      b.status,
      b.total
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DukaanSense_Sales_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
