/* =====================================================
   SAFE DOM HELPERS
===================================================== */
const $ = id => document.getElementById(id);
const $$ = q => document.querySelectorAll(q);

/* =====================================================
   THEME TOGGLE
===================================================== */
(() => {
  const toggle = $("dark-mode-toggle");
  if (!toggle) return;

  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.dataset.theme = "dark";
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = isDark ? "light" : "dark";
    toggle.textContent = isDark ? "🌙" : "☀️";
    localStorage.setItem("theme", isDark ? "light" : "dark");
    window.dispatchEvent(new Event("themeChange"));
  });
})();

/* =====================================================
   CURSOR GLOW (SAFE)
===================================================== */
(() => {
  const glow = document.querySelector(".cursor-glow");
  if (!glow) return;

  document.addEventListener("mousemove", e => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
})();

/* =====================================================
   SCROLL REVEAL
===================================================== */
(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  const observe = () =>
    $$(".reveal:not(.active)").forEach(el => observer.observe(el));

  window.addEventListener("load", observe);
})();

/* =====================================================
   BLOOMBERG STYLE BRIEF
===================================================== */
const BLOOMBERG = [
  { t: "Global Markets Await Fed Signals", s: "Macro", mood: "neutral" },
  { t: "AI Investment Cycle Accelerates", s: "Tech", mood: "bullish" },
  { t: "Gold Strengthens on Inflation Hedge", s: "Commodities", mood: "bullish" },
  { t: "FinTech Faces New Regulation", s: "Policy", mood: "bearish" },
  { t: "Emerging Markets Attract Capital", s: "FX", mood: "bullish" }
];

function renderBloomberg() {
  const box = $("bb-news");
  if (!box) return;

  const shuffled = [...BLOOMBERG].sort(() => Math.random() - 0.5);
  box.innerHTML = `
    <div class="bb-updated">Updated ${new Date().toLocaleTimeString()}</div>
    ${shuffled.map(n => `
      <div class="bb-item ${n.mood}">
        <span class="bb-dot"></span>
        <div>
          <h4>${n.t}</h4>
          <small>${n.s}</small>
        </div>
      </div>
    `).join("")}
  `;
}

/* =====================================================
   INSIGHTS
===================================================== */
const INSIGHTS = [
  {
    title: "AI & Quantum Stocks Surge",
    desc: "Enterprise adoption fuels earnings optimism.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    title: "Markets Volatile on Global Cues",
    desc: "Macro uncertainty pressures equities.",
    category: "market",
    sentiment: "bearish",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
  }
];

function renderInsights() {
  const box = $("news-container");
  if (!box) return;

  box.innerHTML = INSIGHTS.map(i => `
    <article class="post reveal" data-category="${i.category}">
      <img src="${i.image}" alt="${i.title}">
      <div class="post-content">
        <span class="badge ${i.category}">${i.category.toUpperCase()}</span>
        <span class="sentiment ${i.sentiment}">${i.sentiment}</span>
        <h3>${i.title}</h3>
        <p>${i.desc}</p>
      </div>
    </article>
  `).join("");
}

/* =====================================================
   COMMUNITY INSIGHTS
===================================================== */
const KEY = "tf_community";
let posts = JSON.parse(localStorage.getItem(KEY) || "[]");

function renderCommunity() {
  const box = $("blogs-container");
  if (!box) return;

  box.innerHTML = posts.map(p => `
    <article class="community-post reveal">
      <h3>${p.title}</h3>
      <p>${p.content}</p>
    </article>
  `).join("");
}

(() => {
  const btn = $("publishBtn");
  if (!btn) return;

  btn.onclick = () => {
    const title = $("blog-title")?.value.trim();
    const content = $("blog-content")?.value.trim();
    if (!title || !content) return;

    posts.unshift({ title, content });
    localStorage.setItem(KEY, JSON.stringify(posts));
    renderCommunity();
  };
})();

/* =====================================================
   FILTERING
===================================================== */
$$(".filter-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");

    const f = btn.dataset.filter;
    $$(".post").forEach(p => {
      p.classList.toggle("hide", f !== "all" && p.dataset.category !== f);
    });
  };
});

/* =====================================================
   INIT
===================================================== */
window.addEventListener("load", () => {
  renderBloomberg();
  renderInsights();
  renderCommunity();
});
