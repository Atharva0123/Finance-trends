/* =====================================================
   DOM
===================================================== */

const newsContainer = document.getElementById("news-container");
const blogsContainer = document.getElementById("blogs-container");

const blogTitleInput = document.getElementById("blog-title");
const blogContentInput = document.getElementById("blog-content");
const publishBtn = document.getElementById("publishBtn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.querySelector(".close-modal");

const darkModeToggle = document.getElementById("dark-mode-toggle");

/* =====================================================
   STORAGE
===================================================== */

const BLOGS_KEY = "trendsFinance_blogs";
let blogs = JSON.parse(localStorage.getItem(BLOGS_KEY)) || [];

/* =====================================================
   STATIC INSIGHTS (NO API)
===================================================== */

const STATIC_INSIGHTS = [
  {
    title: "AI & Quantum Computing Are Redefining Financial Risk Models",
    description:
      "Financial institutions are increasingly adopting AI-driven analytics and exploring quantum computing to improve portfolio optimization and real-time risk assessment.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    title: "Stock Markets Remain Volatile as Investors Track Global Cues",
    description:
      "Equity markets continue to fluctuate amid inflation concerns, central bank signals, and geopolitical developments impacting global trade.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
  },
  {
    title: "FinTech Innovation Accelerates Digital Payments Worldwide",
    description:
      "FinTech companies are driving growth in digital payments, neobanking, and blockchain-based financial services, reshaping consumer banking.",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1"
  },
  {
    title: "Gold and Silver Continue to Attract Long-Term Investors",
    description:
      "Precious metals remain a preferred hedge against inflation and economic uncertainty, supporting steady demand from investors.",
    image:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d"
  }
];

/* =====================================================
   THEME
===================================================== */

if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.setAttribute("data-theme", "dark");
  darkModeToggle.textContent = "☀️";
}

darkModeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  document.documentElement.setAttribute("data-theme", next);
  darkModeToggle.textContent = next === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", next);
});

/* =====================================================
   SENTIMENT ENGINE
===================================================== */

const bullishWords = [
  "growth","rise","gain","rally","strong","optimistic","accelerates"
];
const bearishWords = [
  "fall","decline","risk","uncertainty","volatile","pressure"
];

function detectSentiment(text = "") {
  const t = text.toLowerCase();
  let score = 0;

  bullishWords.forEach(w => t.includes(w) && score++);
  bearishWords.forEach(w => t.includes(w) && score--);

  if (score > 0) return { label: "Bullish", class: "bullish" };
  if (score < 0) return { label: "Bearish", class: "bearish" };
  return { label: "Neutral", class: "neutral" };
}

/* =====================================================
   CATEGORY ENGINE
===================================================== */

function detectCategory(text = "") {
  const t = text.toLowerCase();

  if (/(ai|quantum)/.test(t))
    return { label: "AI & Quantum", class: "ai" };

  if (/(stock|market|equity|investor)/.test(t))
    return { label: "Stock Markets", class: "market" };

  if (/(fintech|payment|banking|blockchain)/.test(t))
    return { label: "FinTech", class: "fintech" };

  if (/(gold|silver|precious)/.test(t))
    return { label: "Precious Metals", class: "gold" };

  return { label: "Technology", class: "tech" };
}

/* =====================================================
   RENDER STATIC INSIGHTS
===================================================== */

function renderInsights() {
  newsContainer.innerHTML = STATIC_INSIGHTS.map(item => {
    const meta = `${item.title} ${item.description}`;
    const sentiment = detectSentiment(meta);
    const category = detectCategory(meta);

    return `
      <article class="post fade-in">
        <img src="${item.image}">
        <div class="post-content">
          <div class="news-meta">
            <span class="badge ${category.class}">${category.label}</span>
            <span class="sentiment ${sentiment.class}">
              ${sentiment.label}
            </span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </article>
    `;
  }).join("");
}

/* =====================================================
   COMMUNITY BLOGS (OPTIMIZED)
===================================================== */

const DEFAULT_BLOGS = [
  {
    id: "default-1",
    title: "How AI Is Transforming Investment Decision-Making",
    content:
      "AI-driven models enable investors to analyze massive datasets, identify trends faster, and reduce emotional bias in decision-making."
  },
  {
    id: "default-2",
    title: "Why FinTech Is Critical for Financial Inclusion",
    content:
      "Digital financial services are expanding access to banking, credit, and payments, especially in emerging markets."
  }
];

function initBlogs() {
  if (!blogs.length) {
    blogs = DEFAULT_BLOGS;
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  }
}

function renderBlogs() {
  blogsContainer.innerHTML = blogs.map(b => `
    <article class="post fade-in">
      <div class="post-content">
        <span class="post-tag">Community Insight</span>
        <h3>${b.title}</h3>
        <p>${b.content.slice(0, 180)}…</p>
        <button class="read-more" onclick="openModal('${b.id}')">
          Read Full →
        </button>
      </div>
    </article>
  `).join("");
}

publishBtn.addEventListener("click", () => {
  const title = blogTitleInput.value.trim();
  const content = blogContentInput.value.trim();
  if (!title || !content) return;

  blogs.unshift({
    id: "blog-" + Date.now(),
    title,
    content
  });

  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  blogTitleInput.value = "";
  blogContentInput.value = "";
  renderBlogs();
});

/* =====================================================
   MODAL
===================================================== */

window.openModal = id => {
  const blog = blogs.find(b => b.id === id);
  modalTitle.textContent = blog.title;
  modalBody.textContent = blog.content;
  modal.style.display = "flex";
};

closeModalBtn.onclick = () => (modal.style.display = "none");
modal.onclick = e => e.target === modal && (modal.style.display = "none");

/* =====================================================
   INIT
===================================================== */

initBlogs();
renderInsights();
renderBlogs();
