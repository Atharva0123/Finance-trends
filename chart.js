document.addEventListener("DOMContentLoaded", () => {

  function loadTradingView(containerId, symbol) {
    new TradingView.widget({
      container_id: containerId,
      width: "100%",
      height: 180,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light",
      style: "3",
      locale: "en",
      hide_top_toolbar: true,
      hide_legend: true,
      allow_symbol_change: false,
      enable_publishing: false,
      save_image: false
    });
  }

  function loadWidgets() {
    loadTradingView("tv-gold", "TVC:GOLD");
    loadTradingView("tv-silver", "TVC:SILVER");
    loadTradingView("tv-bitcoin", "BINANCE:BTCUSDT");
    loadTradingView("tv-crude", "TVC:USOIL");

    new TradingView.widget({
      container_id: "tv-heatmap",
      width: "100%",
      height: 280,
      dataSource: "ECONOMICS",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      colorTheme:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light"
    });
  }

  const tvScript = document.createElement("script");
  tvScript.src = "https://s3.tradingview.com/tv.js";
  tvScript.onload = loadWidgets;
  document.body.appendChild(tvScript);
});
