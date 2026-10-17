// DukaanSense Frontend API Client
const BASE_URL = "";

export const api = {
  // Check Gemini Status
  async getGeminiStatus() {
    const res = await fetch(`${BASE_URL}/api/gemini/status`);
    return res.json();
  },

  // Dashboard Data
  async getDashboard(period = "today") {
    const res = await fetch(`${BASE_URL}/api/dashboard?period=${period}`);
    return res.json();
  },

  // Sales
  async getSales(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/api/sales?${query}`);
    return res.json();
  },

  async createSale(saleData) {
    const res = await fetch(`${BASE_URL}/api/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saleData)
    });
    return res.json();
  },

  async reverseSale(id) {
    const res = await fetch(`${BASE_URL}/api/sales/${id}/reverse`, {
      method: "POST"
    });
    return res.json();
  },

  // Products
  async getProducts() {
    const res = await fetch(`${BASE_URL}/api/products`);
    return res.json();
  },

  async createProduct(product) {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  // Action Center Tasks
  async getTasks(status = "open") {
    const res = await fetch(`${BASE_URL}/api/tasks?status=${status}`);
    return res.json();
  },

  async updateTaskStatus(taskId, status) {
    const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Gemini AI Operations
  async runDailyActionCheck() {
    const res = await fetch(`${BASE_URL}/api/gemini/action-check`, {
      method: "POST"
    });
    return res.json();
  },

  async generateUdhaarReminder(data) {
    const res = await fetch(`${BASE_URL}/api/gemini/udhaar-reminder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async chatWithCopilot(message, history = []) {
    const res = await fetch(`${BASE_URL}/api/gemini/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });
    return res.json();
  },

  // Udhaar
  async getUdhaarLedger() {
    const res = await fetch(`${BASE_URL}/api/udhaar`);
    return res.json();
  },

  async recordUdhaarPayment(customerId, amount) {
    const res = await fetch(`${BASE_URL}/api/udhaar/${customerId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });
    return res.json();
  }
};
