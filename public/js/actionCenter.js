// Daily Action Center Controller with Gemini AI
import { api } from "./api.js";

export const actionCenter = {
  currentFilter: "open",

  init() {
    this.bindEvents();
    this.loadTasks();
  },

  bindEvents() {
    // Filter tabs
    const filterButtons = document.querySelectorAll(".action-filter-tabs .pill-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.taskFilter;
        this.loadTasks();
      });
    });

    // Run Today's Check button
    const runBtn = document.getElementById("btn-run-check");
    if (runBtn) {
      runBtn.addEventListener("click", () => this.runCheck());
    }

    // Modal WhatsApp close button
    const closeWaBtn = document.getElementById("close-modal-whatsapp");
    if (closeWaBtn) {
      closeWaBtn.addEventListener("click", () => {
        document.getElementById("modal-whatsapp-reminder").classList.remove("active");
      });
    }

    // Copy reminder text
    const copyBtn = document.getElementById("btn-copy-reminder");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const text = document.getElementById("whatsapp-draft-hindi").value;
        navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy Message"; }, 2000);
      });
    }
  },

  async loadTasks() {
    try {
      const response = await api.getTasks(this.currentFilter);
      if (!response.success) return;

      // Update counters
      document.getElementById("action-open-count").textContent = response.stats.open;
      document.getElementById("action-high-count").textContent = response.stats.highPriority;
      
      const badge = document.getElementById("open-tasks-badge");
      if (badge) badge.textContent = response.stats.open;

      const lastCheckedStr = response.stats.lastChecked;
      if (lastCheckedStr && lastCheckedStr !== "not yet") {
        const date = new Date(lastCheckedStr);
        document.getElementById("action-last-checked").textContent = `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        document.getElementById("action-last-checked").textContent = "not yet";
      }

      this.renderTasks(response.tasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  },

  async runCheck() {
    const btn = document.getElementById("btn-run-check");
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span style="display:inline-block; animation:spin 1s infinite linear;">↻</span> Analyzing records with Gemini...`;
    btn.disabled = true;

    try {
      const result = await api.runDailyActionCheck();
      if (result.success) {
        await this.loadTasks();
      }
    } catch (err) {
      console.error("Action check failed:", err);
      alert("Failed to run check. Please verify server connection.");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  },

  renderTasks(tasks = []) {
    const container = document.getElementById("tasks-list");
    if (!container) return;

    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="content-card" style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
          <p>No tasks found in this view. Great job keeping your shop up to date!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = tasks.map(task => {
      const isAI = task.type === "ai";
      const priorityClass = task.priority === "high" ? "badge-priority-high" : (task.priority === "medium" ? "badge-priority-med" : "badge-priority-low");
      
      return `
        <div class="task-card" data-task-id="${task.id}">
          <div class="task-main">
            <div class="task-meta-row">
              <span class="task-badge ${isAI ? 'badge-ai' : 'badge-rule'}">
                ${isAI ? '✨ GEMINI AI SUGGESTION' : 'RULE-BASED'}
              </span>
              <span class="task-badge ${priorityClass}">
                ${task.priority ? task.priority.toUpperCase() : 'NORMAL'}
              </span>
              <span style="font-size:0.75rem; color:var(--text-muted);">${task.category || 'General'}</span>
            </div>
            <h4 class="task-title">${task.title}</h4>
            <p class="task-reason">${task.reason}</p>
          </div>
          <div class="task-actions">
            ${task.actionType === "whatsapp" || task.title.includes("Udhaar") ? `
              <button class="btn-secondary btn-wa-trigger" data-customer="${task.actionData?.customer || 'Ramesh Kumar'}" data-amount="${task.actionData?.amount || 520}" data-days="14">
                📱 WhatsApp Draft
              </button>
            ` : ''}
            ${task.status === "open" ? `
              <button class="btn-primary btn-task-done" data-task-id="${task.id}">
                Mark Done
              </button>
            ` : `
              <span class="status-pill status-completed">Done</span>
            `}
          </div>
        </div>
      `;
    }).join("");

    // Bind item buttons
    container.querySelectorAll(".btn-task-done").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.taskId;
        await api.updateTaskStatus(id, "done");
        this.loadTasks();
      });
    });

    container.querySelectorAll(".btn-wa-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        this.openWhatsAppModal({
          customer: btn.dataset.customer,
          amount: btn.dataset.amount,
          days: btn.dataset.days
        });
      });
    });
  },

  async openWhatsAppModal({ customer, amount, days }) {
    const modal = document.getElementById("modal-whatsapp-reminder");
    const spinner = document.getElementById("whatsapp-loading-spinner");
    const content = document.getElementById("whatsapp-content-box");
    
    modal.classList.add("active");
    spinner.style.display = "block";
    content.style.display = "none";

    try {
      const res = await api.generateUdhaarReminder({ customer, amount, days });
      spinner.style.display = "none";
      content.style.display = "block";

      document.getElementById("whatsapp-draft-hindi").value = res.messageHindi || "";
      document.getElementById("whatsapp-draft-english").value = res.messageEnglish || "";
      
      const waBtn = document.getElementById("btn-open-wa");
      if (waBtn && res.whatsappUrl) {
        waBtn.href = res.whatsappUrl;
      }
    } catch (err) {
      console.error("WhatsApp draft error:", err);
      spinner.innerHTML = `<p style="color:red;">Failed to draft message.</p>`;
    }
  }
};
