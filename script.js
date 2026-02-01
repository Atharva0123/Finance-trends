/* =====================================================
   GLOBAL CONFIG & SAFETY
===================================================== */
const BLOOMBERG_POOL = [
  { title: "Global Markets Steady as Investors Await Central Bank Signals", source: "Macro Desk", sentiment: "neutral" },
  { title: "AI Spending Cycle Accelerates Across Tech Giants", source: "Technology", sentiment: "bullish" },
  { title: "Gold Holds Firm as Inflation Hedges Return", source: "Commodities", sentiment: "bullish" },
  { title: "FinTech Faces Regulatory Tightening in Europe", source: "Regulation", sentiment: "bearish" },
  { title: "Emerging Markets See Capital Inflows", source: "FX", sentiment: "bullish" }
];

const INSIGHTS = [
  { title: "AI Stocks Surge as Adoption Accelerates", desc: "Enterprise automation boosts AI earnings outlook.", category: "ai", sentiment: "bullish", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995" },
  { title: "Quantum Computing Attracts Capital", desc: "Breakthroughs fuel long-term optimism.", category: "ai", sentiment: "bullish", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb" },
  { title: "Markets Volatile Amid Global Cues", desc: "Macro uncertainty weighs on indices.", category: "market", sentiment: "bearish", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3" }
];

/* =====================================================
   CORE ENGINE
===================================================== */

// Initialize Observers
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function observeReveals() {
  document.querySelectorAll(".reveal:not(.active)").forEach(el => revealObserver.observe(el));
}

// Theme Management
function initTheme() {
  const darkToggle = document.getElementById("dark-mode-toggle");
  if (!darkToggle) return;

  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  darkToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  darkToggle.onclick = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    darkToggle.textContent = next === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", next);
    // Reload charts to update widget themes
    if (typeof loadAllCharts === "function") window.location.reload(); 
  };
}

// Render Bloomberg Brief
function renderBloombergBrief() {
  const container = document.getElementById("bb-news");
  if (!container) return;

  const items = [...BLOOMBERG_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
  container.innerHTML = `
    <div class="bb-updated">Updated: ${new Date().toLocaleTimeString()}</div>
    ${items.map(i => `
      <div class="bb-item ${i.sentiment}">
        <span class="bb-dot"></span>
        <div>
          <h4>${i.title}</h4>
          <small>${i.source}</small>
        </div>
      </div>
    `).join("")}`;
}

// Render Curated Insights
function renderInsights() {
  const container = document.getElementById("news-container");
  if (!container) return;

  container.innerHTML = INSIGHTS.map(i => `
    <article class="post reveal" data-category="${i.category}">
      <img src="${i.image}" alt="${i.title}" loading="lazy">
      <div class="post-content">
        <span class="badge ${i.category}">${i.category.toUpperCase()}</span>
        <span class="sentiment ${i.sentiment}">${i.sentiment}</span>
        <h3>${i.title}</h3>
        <p>${i.desc}</p>
      </div>
    </article>
  `).join("");
  observeReveals();
}

// Community Insights (LocalStorage)
function initCommunityBlogs() {
  const container = document.getElementById("blogs-container");
  const publishBtn = document.getElementById("publishBtn");
  const BLOG_KEY = "tf_blogs";
  
  let blogs = JSON.parse(localStorage.getItem(BLOG_KEY)) || [];

  const render = () => {
    if (!container) return;
    container.innerHTML = blogs.map(b => `
      <article class="community-post reveal">
        <h3>${b.title}</h3>
        <p>${b.content}</p>
      </article>
    `).join("");
    observeReveals();
  };

  if (publishBtn) {
    publishBtn.onclick = () => {
      const titleEl = document.getElementById("blog-title");
      const contentEl = document.getElementById("blog-content");
      if (!titleEl?.value || !contentEl?.value) return;

      blogs.unshift({ title: titleEl.value, content: contentEl.value });
      localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));
      titleEl.value = "";
      contentEl.value = "";
      render();
    };
  }
  render();
}

// SEO Blogs & Routing
function initSEOBlogs() {
  const seoContainer = document.getElementById("seo-blogs");
  // Check if external blog data exists to prevent crashes
  if (!seoContainer || typeof ALL_BLOGS === "undefined") return;

  seoContainer.innerHTML = ALL_BLOGS.map(b => `
    <article class="post reveal" data-category="finance">
      <div class="post-content">
        <span class="badge finance">FINANCE</span>
        <h3>${b.title}</h3>
        <p>${b.meta}</p>
        <a href="?blog=${b.slug}" class="cta-link">Read Full →</a>
      </div>
    </article>
  `).join("");
  observeReveals();
}

function handleBlogRouting() {
  const slug = new URLSearchParams(window.location.search).get("blog");
  if (!slug || typeof getBlogBySlug !== "function") return;

  const blog = getBlogBySlug(slug);
  if (!blog) return;

  document.body.innerHTML = `
    <main class="container blog-page">
      <article class="blog-full">
        <h1>${blog.title}</h1>
        <div class="blog-meta">${blog.meta}</div>
        <div class="blog-body">${blog.content}</div>
        <a href="index.html" class="cta-link">← Back to Dashboard</a>
      </article>
    </main>`;
}

// Category Filters
function initFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(btn => {
    btn.onclick = () => {
      document.querySelector(".filter-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      document.querySelectorAll(".post").forEach(post => {
        const isMatch = filter === "all" || post.dataset.category === filter;
        post.style.display = isMatch ? "block" : "none";
      });
    };
  });
}

// Cursor Glow
function initCursor() {
  const cursor = document.querySelector(".cursor-glow");
  if (!cursor) return;
  document.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
}

/* =====================================================
   INITIALIZE
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCursor();
  renderBloombergBrief();
  renderInsights();
  initCommunityBlogs();
  initSEOBlogs();
  initFilters();
  handleBlogRouting();
});
