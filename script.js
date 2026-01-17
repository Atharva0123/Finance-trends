/* =====================================================
   DOM REFERENCES (SAFE)
===================================================== */
const newsContainer = document.getElementById("news-container");
const blogsContainer = document.getElementById("blogs-container");
const publishBtn = document.getElementById("publishBtn");
const darkToggle = document.getElementById("dark-mode-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");

/* =====================================================
   THEME (SAFE FOR GITHUB PAGES)
===================================================== */
if (darkToggle) {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    darkToggle.textContent = "☀️";
  }

  darkToggle.onclick = () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    darkToggle.textContent = next === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", next);
  };
}
/* ===============================
   CURSOR GLOW FOLLOW
================================ */
const cursor = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", e => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

/* =====================================================
   SCROLL REVEAL (REAL – FIXED)
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
/* ===============================
   BLOOMBERG-STYLE GLOBAL BRIEF
   (ROTATES ON EVERY REFRESH)
================================ */

const BLOOMBERG_POOL = [
  {
    title: "Global Markets Steady as Investors Await Central Bank Signals",
    source: "Global Macro Desk",
    sentiment: "neutral"
  },
  {
    title: "AI Spending Cycle Accelerates Across US and Asian Tech Giants",
    source: "Technology & AI",
    sentiment: "bullish"
  },
  {
    title: "Gold Holds Firm as Inflation Hedges Regain Attention",
    source: "Commodities",
    sentiment: "bullish"
  },
  {
    title: "FinTech Firms Face Regulatory Tightening Across Europe",
    source: "Financial Regulation",
    sentiment: "bearish"
  },
  {
    title: "Energy Markets Watch Middle-East Supply Risks Closely",
    source: "Energy Markets",
    sentiment: "neutral"
  },
  {
    title: "Bond Yields Stabilize as Recession Fears Ease Slightly",
    source: "Rates & Credit",
    sentiment: "bullish"
  },
  {
    title: "Emerging Markets See Capital Inflows After Dollar Softens",
    source: "FX & Macro",
    sentiment: "bullish"
  },
  {
    title: "Equity Volatility Persists as Earnings Season Approaches",
    source: "Equities",
    sentiment: "neutral"
  },
  {
    title: "Digital Payments Expand Rapidly Across Southeast Asia",
    source: "FinTech",
    sentiment: "bullish"
  }
];

/* Shuffle utility */
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function renderBloombergBrief() {
  const container = document.getElementById("bb-news");
  if (!container) return;

  const latest = shuffle(BLOOMBERG_POOL).slice(0, 5);
  const timestamp = new Date().toLocaleTimeString();

  container.innerHTML = `
    <div class="bb-updated">Last updated: ${timestamp}</div>
    ${latest.map(n => `
      <div class="bb-item ${n.sentiment}">
        <span class="bb-dot"></span>
        <div>
          <h4>${n.title}</h4>
          <small>${n.source}</small>
        </div>
      </div>
    `).join("")}
  `;
}

renderBloombergBrief();

/* =====================================================
   CURATED INSIGHTS (STATIC – NO API)
===================================================== */
const INSIGHTS = [
  {
    title: "AI Stocks Surge as Enterprises Accelerate Adoption",
    desc: "Artificial intelligence leaders report strong revenue growth driven by enterprise automation.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    title: "Quantum Computing Breakthroughs Attract Global Investors",
    desc: "Advances in quantum processors fuel optimism for next-generation computing.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
  },
  {
    title: "Sensex and Nifty Face Volatility Amid Global Cues",
    desc: "Indian markets remain volatile due to global macroeconomic uncertainty.",
    category: "market",
    sentiment: "bearish",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
  },
  {
    title: "FinTech Firms Drive Financial Inclusion Worldwide",
    desc: "Digital wallets and neobanks expand access to banking services.",
    category: "fintech",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1"
  },
  {
    title: "Gold Prices Rise as Investors Seek Safe Havens",
    desc: "Precious metals gain traction amid global uncertainty.",
    category: "gold",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d"
  }
];

function renderInsights() {
  if (!newsContainer) return;

  newsContainer.innerHTML = INSIGHTS.map(i => `
    <article class="post reveal" data-category="${i.category}">
      <img src="${i.image}" alt="${i.title}">
      <div class="post-content">
        <span class="badge ${i.category}">
          ${i.category.toUpperCase()}
        </span>
        <span class="sentiment ${i.sentiment}">
          ${i.sentiment}
        </span>
        <h3>${i.title}</h3>
        <p>${i.desc}</p>
      </div>
    </article>
  `).join("");

  observeReveals();
}

/* =====================================================
   COMMUNITY BLOGS (SAFE)
===================================================== */
const BLOG_KEY = "tf_blogs";

let blogs = JSON.parse(localStorage.getItem(BLOG_KEY)) || [
  {
    title: "How AI Is Transforming Long-Term Investing",
    content:
      "AI-driven analytics help investors detect trends early and manage risk."
  },
  {
    title: "Why FinTech Is the Backbone of Digital Economies",
    content:
      "Digital payments and neobanks accelerate economic inclusion worldwide."
  }
];

localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));

function renderBlogs() {
  if (!blogsContainer) return;

  blogsContainer.innerHTML = blogs.map(b => `
    <article class="post reveal" data-category="community">
      <div class="post-content">
        <span class="badge market">Community</span>
        <h3>${b.title}</h3>
        <p>${b.content}</p>
      </div>
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
   CATEGORY FILTERING (FIXED)
===================================================== */
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document
      .querySelector(".filter-btn.active")
      ?.classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    document.querySelectorAll(".post").forEach(post => {
      const category = post.dataset.category;
      const show =
        filter === "all" ||
        category === filter ||
        category === "community";

      post.classList.toggle("hide", !show);
    });
  });
});

/* =====================================================
   INIT
===================================================== */
renderInsights();
renderBlogs();
