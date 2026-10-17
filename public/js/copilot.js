// Gemini AI Co-pilot Drawer Assistant
import { api } from "./api.js";

export const copilot = {
  chatHistory: [],

  init() {
    this.bindEvents();
    this.checkStatus();
  },

  bindEvents() {
    // Open drawer button
    const openBtn = document.getElementById("open-copilot-btn");
    const drawer = document.getElementById("copilot-drawer");
    const closeBtn = document.getElementById("close-copilot-drawer");

    if (openBtn) {
      openBtn.addEventListener("click", () => {
        drawer.classList.add("open");
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    }

    // Chat form submit
    const form = document.getElementById("copilot-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("copilot-input");
        const message = input.value.trim();
        if (!message) return;

        input.value = "";
        this.sendMessage(message);
      });
    }

    // Suggested question chips
    document.querySelectorAll(".chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const prompt = btn.dataset.prompt;
        if (prompt) this.sendMessage(prompt);
      });
    });
  },

  async checkStatus() {
    try {
      const res = await api.getGeminiStatus();
      const dot = document.querySelector(".ai-status-dot");
      const label = document.getElementById("ai-status-text");

      if (res.configured) {
        dot.classList.remove("needs-key");
        label.textContent = `Gemini AI Connected (${res.model})`;
      } else {
        dot.classList.add("needs-key");
        label.textContent = "Gemini Demo Mode (Set Key in .env)";
      }
    } catch (err) {
      console.warn("Unable to check Gemini status:", err);
    }
  },

  async sendMessage(text) {
    const messagesContainer = document.getElementById("copilot-messages");
    if (!messagesContainer) return;

    // Append user bubble
    const userBubble = document.createElement("div");
    userBubble.className = "copilot-bubble bubble-user";
    userBubble.textContent = text;
    messagesContainer.appendChild(userBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Append loading placeholder
    const assistantBubble = document.createElement("div");
    assistantBubble.className = "copilot-bubble bubble-assistant";
    assistantBubble.innerHTML = `<em>Thinking with Gemini...</em>`;
    messagesContainer.appendChild(assistantBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const response = await api.chatWithCopilot(text, this.chatHistory);
      assistantBubble.innerHTML = this.formatMarkdown(response.reply || "No response received.");
      
      this.chatHistory.push({ role: "user", parts: [{ text }] });
      this.chatHistory.push({ role: "model", parts: [{ text: response.reply }] });
    } catch (err) {
      assistantBubble.innerHTML = `<span style="color:red;">Error communicating with Gemini assistant.</span>`;
    } finally {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  },

  formatMarkdown(text) {
    // Simple formatter for bullet points, bold text and line breaks
    return text
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  }
};
