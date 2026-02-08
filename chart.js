(function () {
  "use strict";

  /* ===============================
     DEVICE + REGION DETECTION
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
     SAFE WIDGET LOADER
  =============================== */

  function safeLoadWidget(containerId, config, type = "chart") {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`[TV] Missing container: #${containerId}`);
      return;
    }

    // Avoid TradingView zero-width crash
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
     SYMBOL MAP (REGION AWARE)
  =============================== */

  const SYMBOLS = {
    IN: {
      sensex: "BSE:SENSEX",
      nifty: "NSE:NIFTY1!",
      nasdaq: "TVC:NDX"
    },
    GLOBAL: {
      sensex: "TVC:NDX",
      nifty: "TVC:SPX",
      nasdaq: "TVC:NDX"
    }
  };

  /* ===============================
     MARKET SNAPSHOT
  =============================== */

  function loadMarketSnapshot() {
    safeLoadWidget(
      "market-snapshot",
      {
        width: "100%",
        height: isMobile ? 260 : 380,
        symbolsGroups: [
          {
            name: "Indices",
            symbols: [
              {
                name: SYMBOLS[region].sensex,
                displayName: "Sensex"
              },
              {
                name: SYMBOLS[region].nifty,
                displayName: "NIFTY 50"
              },
              {
                name: SYMBOLS[region].nasdaq,
                displayName: "NASDAQ 100"
              }
            ]
          },
          {
            name: "Commodities",
            symbols: [
              { name: "TVC:GOLD", displayName: "Gold" },
              { name: "TVC:SILVER", displayName: "Silver" },
              { name: "TVC:USOIL", displayName: "Crude Oil" }
            ]
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
     INDIVIDUAL CHARTS (RESPONSIVE)
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
     AUTO-REFRESH GLOW (PRICE MOVE)
  =============================== */

  setInterval(() => {
    document
      .querySelectorAll(".glow-refresh")
      .forEach(el => el.classList.toggle("pulse"));
  }, 8000);

  /* ===============================
     INITIALIZATION
  =============================== */

  function initTradingView() {
    loadMarketSnapshot();
    loadCharts();
    loadHeatmap();
  }

  if (document.readyState === "complete") {
    setTimeout(initTradingView, 400);
  } else {
    window.addEventListener("load", initTradingView, { once: true });
  }
})();
