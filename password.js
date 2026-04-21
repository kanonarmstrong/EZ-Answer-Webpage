const PASSWORD = "joe";
const STORAGE_KEY = "bolt-site-access";

function initGate() {
  if (sessionStorage.getItem(STORAGE_KEY) === "granted") {
    return;
  }

  document.body.classList.add("password-hidden");

  const gate = document.createElement("div");
  gate.className = "password-gate";
  gate.innerHTML = `
    <h1>Protected Preview</h1>
    <p>Enter the access password to continue.</p>
    <form>
      <input type="password" placeholder="Password" aria-label="Password" required />
      <button type="submit">Unlock</button>
    </form>
    <div class="password-error" aria-live="polite"></div>
  `;

  const form = gate.querySelector("form");
  const input = gate.querySelector("input");
  const error = gate.querySelector(".password-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = (input.value || "").trim();
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "granted");
      gate.remove();
      document.body.classList.remove("password-hidden");
    } else {
      error.textContent = "Incorrect password. Try again.";
      input.value = "";
      input.focus();
    }
  });

  document.body.appendChild(gate);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGate);
} else {
  initGate();
}
