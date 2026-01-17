document.addEventListener("DOMContentLoaded", () => {
  const REFRESH_INTERVAL = 180000; // 3 minutes

  function theme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function loadMiniChart(containerId, symbol) {
    new TradingView.widget({
      container_id: containerId,
      width: "100%",
      height: 180,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme(),
      style: "3",
      locale: "en",
      hide_top_toolbar: true,
      hide_legend: true,
      allow_symbol_change: false,
      enable_publishing: false,
      save_image: false
    });
  }
  function loadAllCharts() {
    document.querySelectorAll(".glow-refresh").forEach(el => {
      el.classList.remove("pulse");
      void el.offsetWidth; // reflow
      el.classList.add("pulse");
    });

    loadMiniChart("tv-gold", "TVC:GOLD");
    loadMiniChart("tv-silver", "TVC:SILVER");
    loadMiniChart("tv-bitcoin", "BINANCE:BTCUSDT");
    loadMiniChart("tv-crude", "TVC:USOIL");

    new TradingView.widget({
      container_id: "tv-heatmap",
      width: "100%",
      height: 280,
      dataSource: "ECONOMICS",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      colorTheme: theme()
    });
  }

  const tvScript = document.createElement("script");
  tvScript.src = "https://s3.tradingview.com/tv.js";
  tvScript.onload = () => {
    loadAllCharts();
    setInterval(loadAllCharts, REFRESH_INTERVAL);
  };

  document.body.appendChild(tvScript);
});
