// 1. Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// 2. Typing effect (Home page)
const typedEl = document.getElementById("typed");
if (typedEl) {
  const words = ["BSIT Student", "Admin Assistant", "Bookkeeping Support", "Aspiring Web Developer"];
  let w = 0, c = 0, deleting = false;
  (function type() {
    const word = words[w];
    typedEl.textContent = word.slice(0, c);
    if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1200); }
    if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
    c += deleting ? -1 : 1;
    setTimeout(type, deleting ? 50 : 100);
  })();
}

// 3. Scroll reveal + skill bars
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    entry.target.querySelectorAll(".bar div").forEach((b) => (b.style.width = b.dataset.level + "%"));
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// 4. Contact form validation
const form = document.getElementById("contactForm");
if (form) {
  const status = document.getElementById("formStatus");
  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Enter your name (at least 2 characters)."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email like you@example.com."),
    subject: (v) => (v.trim().length >= 3 ? "" : "Enter a subject (at least 3 characters)."),
    message: (v) => (v.trim().length >= 10 ? "" : "Write a message of at least 10 characters."),
  };

  function check(field) {
    const input = form.elements[field];
    const msg = rules[field](input.value);
    form.querySelector(`[data-for="${field}"]`).textContent = msg;
    input.classList.toggle("invalid", !!msg);
    return !msg;
  }

  Object.keys(rules).forEach((f) => form.elements[f].addEventListener("input", () => check(f)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(rules).map(check).every(Boolean);
    if (!allValid) { status.className = "bad"; status.textContent = "Fix the highlighted fields and try again."; return; }
    status.className = "ok";
    status.textContent = `Thanks, ${form.elements.name.value.trim()}! Your message was sent.`;
    form.reset();
  });
}

// 5. Dark / light mode toggle (remembers your choice)
const themeBtn = document.createElement("button");
themeBtn.className = "theme-btn";
themeBtn.setAttribute("aria-label", "Toggle dark or light mode");
nav.appendChild(themeBtn);
function showIcon() {
  themeBtn.textContent = document.documentElement.dataset.theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
}
showIcon();
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
  showIcon();
});

// 6. Back-to-top button
const toTop = document.createElement("button");
toTop.className = "to-top";
toTop.setAttribute("aria-label", "Back to top");
toTop.innerHTML = "&#8593;";
document.body.appendChild(toTop);
window.addEventListener("scroll", () => toTop.classList.toggle("visible", window.scrollY > 300));
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));