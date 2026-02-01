/* ===========================
   TRADINGVIEW SAFE LOADER
=========================== */

const TV_SCRIPT = "https://s3.tradingview.com/tv.js";

function loadTradingView(cb) {
  if (window.TradingView) return cb();

  const s = document.createElement("script");
  s.src = TV_SCRIPT;
  s.async = true;
  s.onload = cb;
  s.onerror = () => console.warn("TradingView failed to load");
  document.head.appendChild(s);
}

/* ===========================
   SAFE WIDGET CREATOR
=========================== */

function createTVWidget(containerId, config) {
  const container = document.getElementById(containerId);
  if (!container || !window.TradingView) {
    console.warn(`Widget skipped: ${containerId}`);
    return;
  }

  container.innerHTML = ""; // avoid parentNode errors

  try {
    new TradingView.widget({
      container_id: containerId,
      autosize: true,
      theme: "dark",
      locale: "en",
      hide_side_toolbar: false,
      allow_symbol_change: true,
      ...config
    });
  } catch (e) {
    container.innerHTML = `<div class="widget-fallback">
      Chart temporarily unavailable
    </div>`;
  }
}

/* ===========================
   ALL CHARTS
=========================== */

function loadAllCharts() {
  createTVWidget("chart-xauusd", {
    symbol: "FX:XAUUSD",
    interval: "15",
    studies: ["RSI@tv-basicstudies"]
  });

  createTVWidget("chart-silver", {
    symbol: "FX:XAGUSD",
    interval: "15"
  });

  createTVWidget("chart-btc", {
    symbol: "BINANCE:BTCUSDT",
    interval: "15"
  });

  createTVWidget("chart-crude", {
    symbol: "TVC:USOIL",
    interval: "15"
  });

  createTVWidget("heatmap-economy", {
    symbol: "SP:SPX",
    studies: [],
  });
}

/* ===========================
   INIT
=========================== */

runWhenReady(() => {
  const charts = safeGet("charts-section");

  [
    "chart-xauusd",
    "chart-silver",
    "chart-btc",
    "chart-crude",
    "heatmap-economy"
  ].forEach(id => safeGet(id, charts));

  loadTradingView(() => runWhenIdle(loadAllCharts));
});
