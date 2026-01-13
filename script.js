const newsContainer = document.getElementById("news-container");
const blogsContainer = document.getElementById("blogs-container");
const publishBtn = document.getElementById("publishBtn");
const darkToggle = document.getElementById("dark-mode-toggle");
const newsContainer = document.getElementById("news-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target); // reveal once
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(el => revealObserver.observe(el));
/* ===============================
   THEME
================================ */
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

/* ===============================
   CURATED INSIGHTS (UNIQUE IMAGES)
================================ */
const INSIGHTS = [
  {
    title: "AI Stocks Surge as Enterprises Accelerate Adoption",
    desc: "Artificial intelligence leaders report strong revenue growth driven by enterprise automation and analytics demand.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    title: "Quantum Computing Breakthroughs Attract Global Investors",
    desc: "Advances in quantum processors push long-term optimism for next-generation computing.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
  },
  {
    title: "Sensex and Nifty Face Volatility Amid Global Cues",
    desc: "Indian equity markets remain range-bound due to global inflation and rate concerns.",
    category: "market",
    sentiment: "bearish",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
  },
  {
    title: "US Stock Markets React to Federal Reserve Policy Signals",
    desc: "Investors closely monitor interest rate guidance impacting global equity sentiment.",
    category: "market",
    sentiment: "neutral",
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29"
  },
  {
    title: "FinTech Firms Drive Financial Inclusion Worldwide",
    desc: "Digital wallets and neobanks expand access to banking services in emerging economies.",
    category: "fintech",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1"
  },
  {
    title: "Blockchain and Payments Redefine Cross-Border Transactions",
    desc: "FinTech platforms reduce transaction costs and settlement times globally.",
    category: "fintech",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485"
  },
  {
    title: "Gold Prices Rise as Investors Seek Safe Havens",
    desc: "Precious metals gain traction amid market uncertainty and currency volatility.",
    category: "gold",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d"
  },
  {
    title: "Silver Demand Increases Due to Green Energy Applications",
    desc: "Industrial usage of silver in solar and EV technologies boosts long-term demand.",
    category: "gold",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265"
  },
  {
    title: "Global Finance Enters a Data-Driven Era",
    desc: "Advanced analytics and AI-driven insights reshape investment strategies.",
    category: "market",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938"
  },
  {
    title: "Emerging Technologies Redefine the Future of Work",
    desc: "AI, automation, and cloud platforms transform productivity across industries.",
    category: "ai",
    sentiment: "neutral",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    title: "Central Bank Digital Currencies Gain Momentum",
    desc: "Governments explore digital currencies to modernize financial infrastructure.",
    category: "fintech",
    sentiment: "neutral",
    image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476"
  },
  {
    title: "Global Markets Balance Growth and Risk in 2026",
    desc: "Investors diversify portfolios to manage geopolitical and economic uncertainty.",
    category: "market",
    sentiment: "neutral",
    image: "https://images.unsplash.com/photo-1549421263-5ec394a5ad6b"
  },
  {
    title: "AI-Powered Trading Systems Improve Market Efficiency",
    desc: "Algorithmic models enhance liquidity and reduce human bias in trading decisions.",
    category: "ai",
    sentiment: "bullish",
    image: "https://images.unsplash.com/photo-1642790551116-18e4f8c4d1f0"
  },
  {
    title: "FinTech Security Becomes Top Priority Amid Digital Expansion",
    desc: "Cybersecurity investments rise as digital finance adoption accelerates.",
    category: "fintech",
    sentiment: "neutral",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3"
  }
];

function renderInsights() {
  newsContainer.innerHTML = INSIGHTS.map(i => `
    <article class="post reveal" data-category="${i.category}">
      <img src="${i.image}">
      <div class="post-content">
        <span class="badge ${i.category}">${i.category.toUpperCase()}</span>
        <span class="sentiment ${i.sentiment}">${i.sentiment}</span>
        <h3>${i.title}</h3>
        <p>${i.desc}</p>
      </div>
    </article>
  `).join("");
}
/* ===============================
   COMMUNITY BLOGS (UNCHANGED)
================================ */
const BLOG_KEY = "tf_blogs";
let blogs = JSON.parse(localStorage.getItem(BLOG_KEY)) || [
  {
    title: "How AI Is Transforming Long-Term Investing",
    content: "AI-driven analytics help investors detect trends early and manage risk effectively."
  },
  {
    title: "Why FinTech Is the Backbone of Digital Economies",
    content: "Digital payments and neobanks accelerate economic inclusion."
  }
];

localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));

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
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll(".post").forEach(post => {
      const match = filter === "all" || post.dataset.category === filter;
      post.classList.toggle("hide", !match);
    });
  });
});
/* ===============================
   INIT
================================ */
renderInsights();
renderBlogs();


