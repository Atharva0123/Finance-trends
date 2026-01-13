/* =====================================================
   CONFIG
===================================================== */

// const NEWS_API_KEY = "...";
// const NEWS_BASE = "https://newsapi.org/v2/everything";
const API_BASE = "https://your-backend.onrender.com";

fetch(`${API_BASE}/api/news`);

/* =====================================================
   DOM
===================================================== */

const newsContainer = document.getElementById("news-container");
const blogsContainer = document.getElementById("blogs-container");
const bookmarksList = document.getElementById("bookmarks-list");

const blogTitleInput = document.getElementById("blog-title");
const blogContentInput = document.getElementById("blog-content");
const publishBtn = document.getElementById("publishBtn");
const refreshNewsBtn = document.getElementById("refresh-news");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.querySelector(".close-modal");

const darkModeToggle = document.getElementById("dark-mode-toggle");

/* =====================================================
   STORAGE
===================================================== */

const BLOGS_KEY = "trendsFinance_blogs";
const BOOKMARKS_KEY = "trendsFinance_bookmarks";

let blogs = JSON.parse(localStorage.getItem(BLOGS_KEY)) || [];
let bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];

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
   SENTIMENT ENGINE (FIXED)
===================================================== */

const bullishWords = [
  "surge","rise","rally","gain","growth","record high","bullish",
  "strong","beats","profit","optimistic","expansion","uptrend"
];

const bearishWords = [
  "fall","drop","decline","loss","bearish","crash","sell-off",
  "weak","concern","risk","downturn","recession","slowdown"
];

function detectSentiment(text = "") {
  const t = text.toLowerCase();
  let score = 0;

  bullishWords.forEach(w => { if (t.includes(w)) score++; });
  bearishWords.forEach(w => { if (t.includes(w)) score--; });

  if (score > 0) return { label: "Bullish", class: "bullish" };
  if (score < 0) return { label: "Bearish", class: "bearish" };
  return { label: "Neutral", class: "neutral" };
}

/* =====================================================
   CATEGORY ENGINE (STRICT)
===================================================== */

function detectCategory(text = "") {
  const t = text.toLowerCase();

  if (/(ai|artificial intelligence|quantum)/.test(t))
    return { label: "AI & Quantum", class: "ai" };

  if (/(sensex|nifty|stock market|equity|shares|dow|nasdaq)/.test(t))
    return { label: "Stock Markets", class: "market" };

  if (/(technology|tech company|software|hardware|semiconductor)/.test(t))
    return { label: "Technology", class: "tech" };

  if (/(fintech|digital payment|banking|neobank|blockchain|crypto)/.test(t))
    return { label: "FinTech", class: "fintech" };

  if (/(gold|silver|precious metal|bullion)/.test(t))
    return { label: "Precious Metals", class: "gold" };

  return null;
}

/* =====================================================
   NEWS (STRICT + SENTIMENT + BADGES)
===================================================== */

async function fetchNews() {
  newsContainer.innerHTML = `<p class="loading">Loading curated news…</p>`;

  const query =
    '(AI OR "Quantum Computing") OR ("Stock Market" OR Sensex OR Nifty) OR Technology OR FinTech OR ("Gold price" OR Silver)';

  try {
    const res = await fetch("http://localhost:5000/api/news");
    const data = await res.json();
    if (!data.articles) throw new Error();

    const html = data.articles
      .map((a, i) => {
        const combined = `${a.title} ${a.description || ""}`;
        const category = detectCategory(combined);
        if (!category) return "";

        const sentiment = detectSentiment(combined);

        return `
        <article class="post fade-in">
          <img src="${a.urlToImage || "https://images.unsplash.com/photo-1559526324-593bc073d938"}">
          <div class="post-content">
            <div class="news-meta">
              <span class="badge ${category.class}">${category.label}</span>
              <span class="sentiment ${sentiment.class}">
                ${sentiment.label}
              </span>
            </div>
            <h3>${a.title}</h3>
            <p>${a.description || ""}</p>
            <div class="actions">
              <a href="${a.url}" target="_blank" class="read-more">Read →</a>
              <button class="bookmark-btn" data-id="news-${i}" data-type="news">♥</button>
            </div>
          </div>
        </article>`;
      })
      .join("");

    newsContainer.innerHTML = html || "<p>No relevant news found.</p>";
  } catch {
    newsContainer.innerHTML = "<p>News unavailable.</p>";
  }
}

refreshNewsBtn.onclick = fetchNews;

/* =====================================================
   COMMUNITY / BLOGS (OPTIMIZED)
===================================================== */

function renderBlogs() {
  if (!blogs.length) {
    blogsContainer.innerHTML = "<p>No community insights yet.</p>";
    return;
  }

  blogsContainer.innerHTML = blogs
    .map(
      b => `
    <article class="post fade-in">
      <div class="post-content">
        <span class="post-tag">Community Insight</span>
        <h3>${b.title}</h3>
        <p>${b.content.slice(0, 200)}${b.content.length > 200 ? "…" : ""}</p>
        <div class="actions">
          <button class="read-more" onclick="openModal('${b.id}')">Read Full →</button>
          <button class="delete-btn" onclick="deleteBlog('${b.id}')">Delete</button>
        </div>
      </div>
    </article>`
    )
    .join("");
}

publishBtn.addEventListener("click", () => {
  const title = blogTitleInput.value.trim();
  const content = blogContentInput.value.trim();
  if (!title || !content) return alert("Title & content required");

  blogs.unshift({
    id: "blog-" + Date.now(),
    title,
    content,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  blogTitleInput.value = "";
  blogContentInput.value = "";
  renderBlogs();
});

window.deleteBlog = id => {
  if (!confirm("Delete this insight?")) return;
  blogs = blogs.filter(b => b.id !== id);
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  renderBlogs();
};

/* =====================================================
   MODAL
===================================================== */

window.openModal = id => {
  const blog = blogs.find(b => b.id === id);
  if (!blog) return;
  modalTitle.textContent = blog.title;
  modalBody.textContent = blog.content;
  modal.style.display = "flex";
};

closeModalBtn.onclick = () => (modal.style.display = "none");
modal.onclick = e => e.target === modal && (modal.style.display = "none");

/* =====================================================
   INIT
===================================================== */

fetchNews();
renderBlogs();
