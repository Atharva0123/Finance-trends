/* =====================================================
   CONFIG
===================================================== */

const API_BASE = "https://your-backend.onrender.com"; // optional
const NEWS_ENDPOINT = `${API_BASE}/api/news`;

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
   DEFAULT OFFLINE DATA
===================================================== */

const DEFAULT_NEWS = [
  {
    title: "AI Stocks Rally as Enterprises Increase Adoption",
    description: "Artificial intelligence companies saw strong gains as demand for enterprise AI solutions surged.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    title: "Gold Prices Strengthen Amid Global Uncertainty",
    description: "Gold continues to act as a safe-haven asset as investors hedge against inflation and volatility.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d"
  },
  {
    title: "Sensex, Nifty End Flat Ahead of Economic Data",
    description: "Indian stock markets remained cautious as investors await key macroeconomic indicators.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
  }
];

const DEFAULT_BLOGS = [
  {
    id: "default-1",
    title: "Why AI & Quantum Computing Matter for Finance",
    content:
      "AI and Quantum Computing are reshaping finance through faster risk analysis, smarter trading strategies, and improved fraud detection. Institutions investing early may gain long-term advantages."
  },
  {
    id: "default-2",
    title: "Gold vs Stocks: Where Should Investors Look?",
    content:
      "Gold remains a hedge during uncertainty, while equities offer growth over time. A balanced portfolio often benefits from exposure to both assets."
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

const bullishWords = ["surge","rise","gain","growth","record","rally","strong"];
const bearishWords = ["fall","drop","loss","crash","decline","risk","weak"];

function detectSentiment(text = "") {
  const t = text.toLowerCase();
  let score = 0;
  bullishWords.forEach(w => t.includes(w) && score++);
  bearishWords.forEach(w => t.includes(w) && score--);
  return score > 0
    ? { label: "Bullish", class: "bullish" }
    : score < 0
    ? { label: "Bearish", class: "bearish" }
    : { label: "Neutral", class: "neutral" };
}

/* =====================================================
   CATEGORY ENGINE
===================================================== */

function detectCategory(text = "") {
  const t = text.toLowerCase();
  if (/(ai|quantum)/.test(t)) return { label: "AI & Quantum", class: "ai" };
  if (/(sensex|nifty|stock|market)/.test(t)) return { label: "Stock Markets", class: "market" };
  if (/(gold|silver)/.test(t)) return { label: "Precious Metals", class: "gold" };
  if (/(fintech|banking|payments)/.test(t)) return { label: "FinTech", class: "fintech" };
  return { label: "Technology", class: "tech" };
}

/* =====================================================
   NEWS RENDER
===================================================== */

function renderNews(articles) {
  newsContainer.innerHTML = articles
    .map(a => {
      const meta = `${a.title} ${a.description || ""}`;
      const sentiment = detectSentiment(meta);
      const category = detectCategory(meta);

      return `
      <article class="post fade-in">
        <img src="${a.urlToImage}">
        <div class="post-content">
          <div class="news-meta">
            <span class="badge ${category.class}">${category.label}</span>
            <span class="sentiment ${sentiment.class}">${sentiment.label}</span>
          </div>
          <h3>${a.title}</h3>
          <p>${a.description || ""}</p>
          <a class="read-more" href="${a.url}" target="_blank">Read →</a>
        </div>
      </article>`;
    })
    .join("");
}

/* =====================================================
   FETCH NEWS (WITH FALLBACK)
===================================================== */

async function fetchNews() {
  newsContainer.innerHTML = "<p>Loading latest news…</p>";

  try {
    const res = await fetch(NEWS_ENDPOINT, { timeout: 4000 });
    if (!res.ok) throw new Error();
    const data = await res.json();
    renderNews(data.articles.slice(0, 6));
  } catch {
    renderNews(DEFAULT_NEWS);
  }
}

/* =====================================================
   COMMUNITY BLOGS
===================================================== */

function initBlogs() {
  if (!blogs.length) {
    blogs = DEFAULT_BLOGS;
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  }
}

function renderBlogs() {
  blogsContainer.innerHTML = blogs
    .map(
      b => `
      <article class="post fade-in">
        <div class="post-content">
          <span class="post-tag">Community Insight</span>
          <h3>${b.title}</h3>
          <p>${b.content.slice(0, 180)}…</p>
          <button class="read-more" onclick="openModal('${b.id}')">Read Full →</button>
        </div>
      </article>`
    )
    .join("");
}

publishBtn.addEventListener("click", () => {
  const title = blogTitleInput.value.trim();
  const content = blogContentInput.value.trim();
  if (!title || !content) return;

  blogs.unshift({ id: "blog-" + Date.now(), title, content });
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

/* =====================================================
   INIT
===================================================== */

initBlogs();
fetchNews();
renderBlogs();
