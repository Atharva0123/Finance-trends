(function () {
  "use strict";

  /* ===============================
     DEVICE, REGION & THEME
  =============================== */

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const region =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone
      .includes("Asia")
      ? "IN"
      : "GLOBAL";

  const theme =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";

  /* ===============================
     SAFE TRADINGVIEW LOADER
  =============================== */

  function safeLoadWidget(containerId, config, type = "chart") {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`[TradingView] Container missing: #${containerId}`);
      return;
    }

    if (container.offsetWidth === 0) {
      requestAnimationFrame(() =>
        safeLoadWidget(containerId, config, type)
      );
      return;
    }

    const sources = {
      quotes:
        "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
      chart:
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      heatmap:
        "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
    };

    const script = document.createElement("script");
    script.src = sources[type];
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    container.innerHTML = "";
    container.appendChild(script);
  }

  /* ===============================
     SYMBOL MAP (STABLE ONLY)
  =============================== */

  const INDICES = {
    primary: [
      { name: "BSE:SENSEX", label: "Sensex" },
      { name: "NSE:NIFTY1!", label: "NIFTY 50" },
      { name: "TVC:NDX", label: "NASDAQ 100" },
      { name: "TVC:DJI", label: "Dow Jones" },
      { name: "TVC:SPX", label: "S&P 500" }
    ],
    global: [
      { name: "TVC:FTSE", label: "FTSE 100" },
      { name: "TVC:DAX", label: "DAX 40" },
      { name: "TVC:NI225", label: "Nikkei 225" },
      { name: "TVC:HSI", label: "Hang Seng" },
      { name: "TVC:VIX", label: "VIX Volatility" }
    ],
    commodities: [
      { name: "TVC:GOLD", label: "Gold" },
      { name: "TVC:SILVER", label: "Silver" },
      { name: "TVC:USOIL", label: "Crude Oil (WTI)" }
    ]
  };

  /* ===============================
     MARKET SNAPSHOT
  =============================== */

  function loadMarketSnapshot() {
    safeLoadWidget(
      "market-snapshot",
      {
        width: "100%",
        height: isMobile ? 300 : 420,
        symbolsGroups: [
          {
            name: "Major Indices",
            symbols: INDICES.primary.map(i => ({
              name: i.name,
              displayName: i.label
            }))
          },
          {
            name: "Global Markets",
            symbols: INDICES.global.map(i => ({
              name: i.name,
              displayName: i.label
            }))
          },
          {
            name: "Commodities",
            symbols: INDICES.commodities.map(i => ({
              name: i.name,
              displayName: i.label
            }))
          }
        ],
        showSymbolLogo: true,
        colorTheme: theme,
        locale: "en"
      },
      "quotes"
    );
  }

  /* ===============================
     INDIVIDUAL CHARTS
  =============================== */

  function loadCharts() {
    const charts = [
      { id: "tv-gold", symbol: "TVC:GOLD" },
      { id: "tv-silver", symbol: "TVC:SILVER" },
      { id: "tv-bitcoin", symbol: "BINANCE:BTCUSDT" },
      { id: "tv-crude", symbol: "TVC:USOIL" }
    ];

    charts.forEach(({ id, symbol }) => {
      safeLoadWidget(
        id,
        {
          symbol,
          interval: isMobile ? "240" : "60",
          autosize: true,
          theme,
          style: "1",
          locale: "en",
          hide_top_toolbar: isMobile,
          hide_legend: isMobile,
          enable_publishing: false,
          save_image: false
        },
        "chart"
      );
    });
  }

  /* ===============================
     HEATMAP (DESKTOP ONLY)
  =============================== */

  function loadHeatmap() {
    if (isMobile) return;

    safeLoadWidget(
      "tv-heatmap",
      {
        exchange: "US",
        dataSource: "SP500",
        grouping: "sector",
        blockSize: "market_cap_basic",
        blockColor: "change",
        width: "100%",
        height: 420,
        locale: "en",
        colorTheme: theme
      },
      "heatmap"
    );
  }

  /* ===============================
     AUTO-GLOW REFRESH
  =============================== */

  setInterval(() => {
    document
      .querySelectorAll(".glow-refresh")
      .forEach(el => el.classList.toggle("pulse"));
  }, 9000);

  /* ===============================
     INIT
  =============================== */

  function init() {
    loadMarketSnapshot();
    loadCharts();
    loadHeatmap();
  }

  if (document.readyState === "complete") {
    setTimeout(init, 400);
  } else {
    window.addEventListener("load", init, { once: true });
  }
})();
