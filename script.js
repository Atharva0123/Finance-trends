/* =====================================================
   SAFE DOM REFERENCES
===================================================== */
const newsContainer = document.getElementById("news-container");
const blogsContainer = document.getElementById("blogs-container");
const seoBlogsContainer = document.getElementById("seo-blogs");
const publishBtn = document.getElementById("publishBtn");
const darkToggle = document.getElementById("dark-mode-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");

/* =====================================================
   THEME TOGGLE (SAFE)
===================================================== */
if (darkToggle) {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    darkToggle.textContent = "☀️";
  }

  darkToggle.onclick = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    darkToggle.textContent = next === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", next);
  };
}

/* =====================================================
   CURSOR GLOW (SAFE)
===================================================== */
const cursor = document.querySelector(".cursor-glow");
if (cursor) {
  document.addEventListener("mousemove", e => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
}

/* =====================================================
   SCROLL REVEAL
===================================================== */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

function observeReveals() {
  document
    .querySelectorAll(".reveal:not(.active)")
    .forEach(el => revealObserver.observe(el));
}

/* =====================================================
   BLOOMBERG STYLE GLOBAL BRIEF
===================================================== */
const BLOOMBERG_POOL = [
  { title: "Global Markets Steady as Investors Await Central Bank Signals", source: "Macro Desk", sentiment: "neutral" },
  { title: "AI Spending Cycle Accelerates Across Tech Giants", source: "Technology", sentiment: "bullish" },
  { title: "Gold Holds Firm as Inflation Hedges Return", source: "Commodities", sentiment: "bullish" },
  { title: "FinTech Faces Regulatory Tightening in Europe", source: "Regulation", sentiment: "bearish" },
  { title: "Emerging Markets See Capital Inflows", source: "FX", sentiment: "bullish" }
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function renderBloombergBrief() {
  const container = document.getElementById("bb-news");
  if (!container) return;

  const items = shuffle(BLOOMBERG_POOL).slice(0, 5);
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
    `).join("")}
  `;
}

/* =====================================================
   CURATED INSIGHTS
===================================================== */
const INSIGHTS = [
  {
    title: "AI Stocks Surge as Adoption Accelerates",
    desc: "Enterprise automation boosts AI earnings outlook.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    title: "Quantum Computing Attracts Capital",
    desc: "Breakthroughs fuel long-term optimism.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
  },
  {
    title: "Markets Volatile Amid Global Cues",
    desc: "Macro uncertainty weighs on indices.",
    category: "market",
    sentiment: "bearish",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
  }
];

function renderInsights() {
  if (!newsContainer) return;

  newsContainer.innerHTML = INSIGHTS.map(i => `
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

  observeReveals();
}

/* =====================================================
   SEO BLOG CARDS
===================================================== */
function renderSEOBlogs() {
  if (!seoBlogsContainer || typeof ALL_BLOGS === "undefined") return;

  seoBlogsContainer.innerHTML = ALL_BLOGS.map(b => `
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

/* =====================================================
   FULL BLOG ROUTING (SEO SAFE)
===================================================== */
function loadFullBlog() {
  const slug = new URLSearchParams(window.location.search).get("blog");
  if (!slug || typeof getBlogBySlug !== "function") return;

  const blog = getBlogBySlug(slug);
  if (!blog) return;

  document.title = blog.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", blog.meta);

  document.body.innerHTML = `
    <main class="container blog-page">
      <article class="blog-full">
        <h1>${blog.title}</h1>
        ${blog.content}
        <a href="index.html" class="cta-link">← Back</a>
      </article>
    </main>
  `;
}

/* =====================================================
   COMMUNITY INSIGHTS
===================================================== */
const BLOG_KEY = "tf_blogs";
let blogs = JSON.parse(localStorage.getItem(BLOG_KEY)) || [];

function renderBlogs() {
  if (!blogsContainer) return;

  blogsContainer.innerHTML = blogs.map(b => `
    <article class="community-post reveal">
      <h3>${b.title}</h3>
      <p>${b.content}</p>
    </article>
  `).join("");

  observeReveals();
}

if (publishBtn) {
  publishBtn.onclick = () => {
    const title = document.getElementById("blog-title")?.value.trim();
    const content = document.getElementById("blog-content")?.value.trim();
    if (!title || !content) return;

    blogs.unshift({ title, content });
    localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));
    renderBlogs();
  };
}

/* =====================================================
   CATEGORY FILTERING (SAFE)
===================================================== */
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll(".post").forEach(post => {
      const show = filter === "all" || post.dataset.category === filter;
      post.classList.toggle("hide", !show);
    });
  });
});

/* =====================================================
   INIT
===================================================== */
renderBloombergBrief();
renderInsights();
renderBlogs();
renderSEOBlogs();
loadFullBlog();
