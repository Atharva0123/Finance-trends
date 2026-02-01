/* ===========================
   COMMUNITY INSIGHTS
=========================== */

runWhenReady(() => {
  const container = safeGet("community-insights");

  container.innerHTML = `
    <h2>Community Insights</h2>
    <div class="insights-grid" id="insights-grid"></div>
  `;

  const grid = safeGet("insights-grid", container);

  const insights = [
    {
      title: "Gold vs Dollar Outlook",
      text: "Macro pressure remains bullish for gold amid global debt."
    },
    {
      title: "Crypto Risk Appetite",
      text: "BTC volatility signals institutional accumulation."
    },
    {
      title: "Oil Market Signals",
      text: "Crude demand remains fragile despite OPEC controls."
    }
  ];

  insights.forEach(item => {
    const card = document.createElement("div");
    card.className = "insight-card";
    card.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    grid.appendChild(card);
  });
});

/* ===========================
   BLOOMBERG-STYLE NEWS
=========================== */

runWhenIdle(() => {
  const news = safeGet("news-section");
  news.innerHTML = `
    <h2>Global Brief</h2>
    <p class="news-live">Latest financial headlines auto-refresh on reload.</p>
  `;
});
