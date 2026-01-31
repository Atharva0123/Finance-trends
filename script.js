/* =========================================================
   GLOBAL SAFETY GUARDS
========================================================= */

// Prevent extension async noise
window.addEventListener("unhandledrejection", event => {
  const msg = String(event.reason || "");
  if (msg.includes("message channel closed")) {
    event.preventDefault();
  }
});

// Inject favicon dynamically to prevent favicon.ico 404
(function ensureFavicon() {
  if (document.querySelector("link[rel~='icon']")) return;

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href =
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>📊</text></svg>";
  document.head.appendChild(link);
})();

/* =========================================================
   SAFE DOM REFERENCES
========================================================= */

const newsContainer = document.getElementById("news-container");
const blogsContainer = document.getElementById("blogs-container");
const publishBtn = document.getElementById("publishBtn");
const darkToggle = document.getElementById("dark-mode-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const revealElements = document.querySelectorAll(".reveal");

/* =========================================================
   SCROLL REVEAL (IntersectionObserver)
========================================================= */

if ("IntersectionObserver" in window) {
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

  revealElements.forEach(el => revealObserver.observe(el));
}

/* =========================================================
   THEME TOGGLE (NULL SAFE)
========================================================= */

if (darkToggle) {
  darkToggle.onclick = () => {
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    darkToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", theme);
  };

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    darkToggle.textContent = "☀️";
  }
}

/* =========================================================
   CURATED INSIGHTS (STATIC, NO API)
========================================================= */

const INSIGHTS = [
  {
    title: "AI Stocks Surge as Enterprises Accelerate Adoption",
    desc: "Enterprise automation and analytics continue to drive AI-led revenue growth.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    title: "Quantum Computing Attracts Long-Term Capital",
    desc: "Next-gen processors push optimism for future computing dominance.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
  },
  {
    title: "Global Markets Balance Growth and Risk",
    desc: "Investors hedge portfolios amid macroeconomic uncertainty.",
    category: "market",
    sentiment: "neutral",
    image: "https://images.unsplash.com/photo-1549421263-5ec394a5ad6b"
  },
  {
    title: "FinTech Expands Financial Inclusion",
    desc: "Digital wallets and neobanks accelerate access to banking.",
    category: "fintech",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1"
  },
  {
    title: "Gold Strengthens as Safe-Haven Demand Rises",
    desc: "Precious metals gain amid inflation and currency volatility.",
    category: "gold",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d"
  }
];

function renderInsights() {
  if (!newsContainer) return;

  newsContainer.innerHTML = INSIGHTS.map(i => `
    <article class="post reveal" data-category="${i.category}">
      <img src="${i.image}" loading="lazy" alt="${i.title}">
      <div class="post-content">
        <span class="badge ${i.category}">${i.category.toUpperCase()}</span>
        <span class="sentiment ${i.sentiment}">${i.sentiment}</span>
        <h3>${i.title}</h3>
        <p>${i.desc}</p>
      </div>
    </article>
  `).join("");
}

/* =========================================================
   COMMUNITY BLOGS (LOCAL STORAGE)
========================================================= */

const BLOG_KEY = "tf_blogs";

let blogs = [];
try {
  blogs = JSON.parse(localStorage.getItem(BLOG_KEY)) || [];
} catch {
  blogs = [];
}

if (blogs.length === 0) {
  blogs = [
    {
      title: "AI and the Future of Investing",
      content: "AI-driven analytics improve forecasting and risk management."
    },
    {
      title: "FinTech as a Growth Catalyst",
      content: "Digital finance is reshaping global capital flows."
    }
  ];
  localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));
}

function renderBlogs() {
  if (!blogsContainer) return;

  blogsContainer.innerHTML = blogs.map(b => `
    <article class="post reveal">
      <div class="post-content">
        <span class="badge market">Community</span>
        <h3>${b.title}</h3>
        <p>${b.content}</p>
      </div>
    </article>
  `).join("");
}

if (publishBtn) {
  publishBtn.onclick = () => {
    const title = document.getElementById("blog-title")?.value;
    const content = document.getElementById("blog-content")?.value;
    if (!title || !content) return;

    blogs.unshift({ title, content });
    localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));
    renderBlogs();
  };
}

/* =========================================================
   FILTERS (NULL SAFE)
========================================================= */

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll(".post").forEach(post => {
      const match =
        filter === "all" || post.dataset.category === filter;
      post.classList.toggle("hide", !match);
    });
  });
});

/* =========================================================
   INIT
========================================================= */

renderInsights();
renderBlogs();
