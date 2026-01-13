const newsContainer = document.getElementById("news-container");
const blogsContainer = document.getElementById("blogs-container");
const publishBtn = document.getElementById("publishBtn");
const darkToggle = document.getElementById("dark-mode-toggle");

const BLOG_KEY = "tf_blogs";

/* ===============================
   THEME
================================ */
darkToggle.onclick = () => {
  const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
  darkToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
};

if (localStorage.getItem("theme") === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  darkToggle.textContent = "☀️";
}

/* ===============================
   OFFLINE NEWS DATA
================================ */
const NEWS = [
  {
    title: "AI Stocks Rally as Enterprises Accelerate Adoption",
    desc: "Artificial intelligence companies see strong growth as demand rises.",
    category: "ai",
    sentiment: "bullish"
  },
  {
    title: "Sensex Slips Amid Global Market Uncertainty",
    desc: "Indian equities face pressure due to global cues.",
    category: "market",
    sentiment: "bearish"
  },
  {
    title: "Gold Prices Rise on Inflation Concerns",
    desc: "Investors turn to precious metals as a hedge.",
    category: "gold",
    sentiment: "bullish"
  },
  {
    title: "FinTech Platforms Transform Digital Banking",
    desc: "Neobanks and payment startups expand rapidly.",
    category: "fintech",
    sentiment: "bullish"
  }
];

function renderNews() {
  newsContainer.innerHTML = NEWS.map(n => `
    <article class="post reveal">
      <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3">
      <div class="post-content">
        <span class="badge ${n.category}">${n.category.toUpperCase()}</span>
        <span class="sentiment ${n.sentiment}">${n.sentiment}</span>
        <h3>${n.title}</h3>
        <p>${n.desc}</p>
      </div>
    </article>
  `).join("");
}

/* ===============================
   COMMUNITY BLOGS
================================ */
let blogs = JSON.parse(localStorage.getItem(BLOG_KEY)) || [];

publishBtn.onclick = () => {
  const title = document.getElementById("blog-title").value;
  const content = document.getElementById("blog-content").value;
  if (!title || !content) return;

  blogs.unshift({ title, content });
  localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));
  renderBlogs();
};

function renderBlogs() {
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

renderNews();
renderBlogs();
