document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     SAFE DOM REFERENCES
  ===================================================== */

  const newsContainer = document.getElementById("news-container");
  const blogsContainer = document.getElementById("blogs-container");
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  if (!newsContainer) {
    console.error("❌ news-container not found in HTML");
    return;
  }

  /* =====================================================
     THEME (SAFE)
  ===================================================== */

  if (
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.setAttribute("data-theme", "dark");
    if (darkModeToggle) darkModeToggle.textContent = "☀️";
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      document.documentElement.setAttribute("data-theme", next);
      darkModeToggle.textContent = next === "dark" ? "☀️" : "🌙";
      localStorage.setItem("theme", next);
    });
  }

  /* =====================================================
     STATIC INSIGHTS (NO API – ALWAYS WORKS)
  ===================================================== */

  const INSIGHTS = [
    {
      title: "AI & Quantum Computing Are Reshaping Financial Markets",
      description:
        "Artificial Intelligence and Quantum Computing are accelerating portfolio optimization, fraud detection, and real-time risk analysis across global financial institutions.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995"
    },
    {
      title: "Stock Markets Remain Volatile Amid Global Economic Signals",
      description:
        "Equity markets continue to fluctuate as investors monitor inflation data, central bank policies, and global macroeconomic trends.",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
    },
    {
      title: "FinTech Innovation Drives the Future of Digital Finance",
      description:
        "From neobanks to blockchain payments, FinTech companies are redefining how consumers access and manage financial services.",
      image:
        "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1"
    },
    {
      title: "Gold and Silver Continue to Act as Safe-Haven Assets",
      description:
        "Precious metals remain attractive to investors seeking protection against inflation, currency risk, and market uncertainty.",
      image:
        "https://images.unsplash.com/photo-1610375461246-83df859d849d"
    }
  ];

  /* =====================================================
     SENTIMENT ENGINE
  ===================================================== */

  function sentiment(text) {
    const t = text.toLowerCase();
    if (/(growth|rise|gain|strong|accelerat)/.test(t))
      return { label: "Bullish", cls: "bullish" };
    if (/(fall|decline|risk|volatile|uncertain)/.test(t))
      return { label: "Bearish", cls: "bearish" };
    return { label: "Neutral", cls: "neutral" };
  }

  /* =====================================================
     CATEGORY ENGINE
  ===================================================== */

  function category(text) {
    const t = text.toLowerCase();
    if (/(ai|quantum)/.test(t)) return { label: "AI & Quantum", cls: "ai" };
    if (/(stock|market|equity)/.test(t)) return { label: "Stock Markets", cls: "market" };
    if (/(fintech|bank|payment)/.test(t)) return { label: "FinTech", cls: "fintech" };
    if (/(gold|silver|precious)/.test(t)) return { label: "Precious Metals", cls: "gold" };
    return { label: "Technology", cls: "tech" };
  }

  /* =====================================================
     RENDER INSIGHTS (NO CONDITIONS)
  ===================================================== */

  newsContainer.innerHTML = INSIGHTS.map(item => {
    const meta = item.title + " " + item.description;
    const s = sentiment(meta);
    const c = category(meta);

    return `
      <article class="post fade-in">
        <img src="${item.image}" alt="">
        <div class="post-content">
          <div class="news-meta">
            <span class="badge ${c.cls}">${c.label}</span>
            <span class="sentiment ${s.cls}">${s.label}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </article>
    `;
  }).join("");

  /* =====================================================
     COMMUNITY BLOGS (SAFE DEFAULT)
  ===================================================== */

  if (blogsContainer) {
    const BLOGS_KEY = "trendsFinance_blogs";
    let blogs = JSON.parse(localStorage.getItem(BLOGS_KEY)) || [
      {
        id: "b1",
        title: "How AI Is Changing Investment Strategies",
        content:
          "AI-powered analytics help investors reduce bias, identify trends earlier, and improve long-term portfolio performance."
      },
      {
        id: "b2",
        title: "FinTech and Financial Inclusion",
        content:
          "Digital finance platforms are expanding access to banking and payments in emerging economies."
      }
    ];

    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));

    blogsContainer.innerHTML = blogs.map(b => `
      <article class="post fade-in">
        <div class="post-content">
          <span class="post-tag">Community Insight</span>
          <h3>${b.title}</h3>
          <p>${b.content}</p>
        </div>
      </article>
    `).join("");
  }
});
