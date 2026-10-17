// Quick POS New Sale Modal Controller
import { api } from "./api.js";

export const newSale = {
  cart: [],
  selectedMethod: "Cash",
  products: [],

  init() {
    this.bindEvents();
    this.loadCatalog();
  },

  bindEvents() {
    // Open modal buttons
    const triggerButtons = [
      document.getElementById("nav-new-sale-trigger"),
      document.getElementById("btn-quick-new-sale"),
      document.getElementById("btn-sales-new-sale")
    ];

    triggerButtons.forEach(btn => {
      if (btn) btn.addEventListener("click", () => this.openModal());
    });

    // Close button
    const closeBtn = document.getElementById("close-modal-sale");
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());

    // Add item to cart
    const addBtn = document.getElementById("btn-add-item-to-cart");
    if (addBtn) addBtn.addEventListener("click", () => this.addItemToCart());

    // Payment method pills
    const payPills = document.querySelectorAll(".payment-pills-row .pay-pill");
    payPills.forEach(pill => {
      pill.addEventListener("click", () => {
        payPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.selectedMethod = pill.dataset.method;
        
        // Auto hint if Udhaar selected
        const nameInput = document.getElementById("pos-customer-name");
        if (this.selectedMethod === "Udhaar" && !nameInput.value) {
          nameInput.focus();
        }
      });
    });

    // Discount change
    const discountInput = document.getElementById("pos-discount");
    if (discountInput) {
      discountInput.addEventListener("input", () => this.updateTotals());
    }

    // Complete sale button
    const completeBtn = document.getElementById("btn-complete-sale");
    if (completeBtn) {
      completeBtn.addEventListener("click", () => this.submitSale());
    }
  },

  async loadCatalog() {
    try {
      const res = await api.getProducts();
      if (!res.success) return;
      this.products = res.products || [];

      const picker = document.getElementById("pos-product-picker");
      if (!picker) return;

      picker.innerHTML = `<option value="">-- Choose product --</option>` +
        this.products.map(p => `
          <option value="${p.id}">${p.name} (₹${p.price} / ${p.unit}) - ${p.stock} in stock</option>
        `).join("");
    } catch (err) {
      console.error("Failed to load catalog:", err);
    }
  },

  openModal() {
    document.getElementById("modal-new-sale").classList.add("active");
    this.cart = [];
    this.renderCart();
    this.updateTotals();
  },

  closeModal() {
    document.getElementById("modal-new-sale").classList.remove("active");
  },

  addItemToCart() {
    const picker = document.getElementById("pos-product-picker");
    const productId = picker.value;
    if (!productId) return;

    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.find(item => item.productId === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1
      });
    }

    this.renderCart();
    this.updateTotals();
  },

  renderCart() {
    const container = document.getElementById("pos-cart-items");
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `<p class="empty-cart-hint" style="color:var(--text-muted); font-size:0.82rem; text-align:center; padding:30px 0;">Cart is empty. Select products above.</p>`;
      return;
    }

    container.innerHTML = this.cart.map((item, index) => `
      <div class="cart-item-row">
        <div>
          <div class="cart-item-info">${item.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">₹${item.price} each</div>
        </div>
        <div class="cart-item-qty-row">
          <button type="button" class="btn-secondary btn-cart-dec" data-index="${index}" style="padding:2px 8px;">-</button>
          <span style="font-size:0.85rem; font-weight:700;">${item.qty}</span>
          <button type="button" class="btn-secondary btn-cart-inc" data-index="${index}" style="padding:2px 8px;">+</button>
          <button type="button" class="btn-secondary btn-cart-del" data-index="${index}" style="padding:2px 8px; color:red;">×</button>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".btn-cart-dec").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        if (this.cart[i].qty > 1) {
          this.cart[i].qty -= 1;
        } else {
          this.cart.splice(i, 1);
        }
        this.renderCart();
        this.updateTotals();
      });
    });

    container.querySelectorAll(".btn-cart-inc").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        this.cart[i].qty += 1;
        this.renderCart();
        this.updateTotals();
      });
    });

    container.querySelectorAll(".btn-cart-del").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        this.cart.splice(i, 1);
        this.renderCart();
        this.updateTotals();
      });
    });
  },

  updateTotals() {
    const subtotal = this.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discount = Number(document.getElementById("pos-discount")?.value) || 0;
    const finalTotal = Math.max(0, subtotal - discount);

    document.getElementById("pos-subtotal").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    document.getElementById("pos-discount-display").textContent = `-₹${discount.toLocaleString("en-IN")}`;
    document.getElementById("pos-grand-total").textContent = `₹${finalTotal.toLocaleString("en-IN")}`;
  },

  async submitSale() {
    if (this.cart.length === 0) {
      alert("Please add at least one item to the cart.");
      return;
    }

    const customer = document.getElementById("pos-customer-name")?.value.trim() || "Walk-in Customer";
    const phone = document.getElementById("pos-customer-phone")?.value.trim() || "-";
    const discount = Number(document.getElementById("pos-discount")?.value) || 0;

    if (this.selectedMethod === "Udhaar" && (!customer || customer === "Walk-in Customer")) {
      alert("Please enter a customer name for Udhaar credit purchases.");
      return;
    }

    try {
      const res = await api.createSale({
        items: this.cart,
        paymentMethod: this.selectedMethod,
        customer,
        phone,
        discount
      });

      if (res.success) {
        alert(`Bill #${res.sale.id} created successfully! Total: ₹${res.sale.total}`);
        this.closeModal();

        // Trigger updates across views
        window.dispatchEvent(new CustomEvent("dukaan:sale_created"));
      }
    } catch (err) {
      console.error("Sale submission error:", err);
      alert("Failed to create sale. Please try again.");
    }
  }
};
