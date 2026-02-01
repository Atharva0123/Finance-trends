(function () {
  /**
   * Safely loads TradingView widgets with comprehensive DOM verification.
   */
  function safeLoadWidget(containerId, config, widgetType = "chart") {
    const container = document.getElementById(containerId);

    if (!container) {
      console.warn(`Widget Container #${containerId} not found.`);
      return;
    }

    // Ensure container has visibility to prevent layout shifts
    if (container.offsetWidth === 0 && !container.style.width.includes('%')) {
       return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;

    // Source mapping
    const sources = {
      heatmap: "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js",
      quotes: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
      chart: "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    };

    script.src = sources[widgetType] || sources.chart;
    script.innerHTML = JSON.stringify(config);

    container.innerHTML = ""; // Clear loader/previous instances
    container.appendChild(script);
  }

  function loadAllCharts() {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

    // 1. Market Snapshot (Quotes)
    safeLoadWidget("market-snapshot", {
      width: "100%",
      height: 380,
      symbolsGroups: [
        {
          name: "Indices",
          symbols: [
            { name: "BSE:SENSEX", displayName: "Sensex" },
            { name: "NSE:NIFTY", displayName: "Nifty 50" },
            { name: "NASDAQ:NDX", displayName: "NASDAQ 100" }
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
    }, "quotes");

    // 2. Individual Charts
    const symbols = [
      { id: "tv-gold", sym: "TVC:GOLD" },
      { id: "tv-silver", sym: "TVC:SILVER" },
      { id: "tv-bitcoin", sym: "BINANCE:BTCUSDT" },
      { id: "tv-crude", sym: "TVC:USOIL" }
    ];

    symbols.forEach(item => {
      safeLoadWidget(item.id, {
        symbol: item.sym,
        interval: "60",
        autosize: true,
        theme: theme,
        style: "1",
        locale: "en",
        enable_publishing: false,
        hide_top_toolbar: true,
        save_image: false
      }, "chart");
    });

    // 3. Heatmap
    safeLoadWidget("tv-heatmap", {
      exchange: "US",
      dataSource: "SP500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      colorTheme: theme,
      width: "100%",
      height: 400
    }, "heatmap");
  }

  // Initialization with retry logic
  if (document.readyState === "complete") {
    setTimeout(loadAllCharts, 300);
  } else {
    window.addEventListener("load", loadAllCharts);
  }
})();
