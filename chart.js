(function () {
  function safeLoadWidget(containerId, config, widgetType = "chart") {
    const container = document.getElementById(containerId);

    // 🔐 Absolute safety checks
    if (
      !container ||
      !container.parentNode ||
      container.offsetHeight === 0
    ) {
      return;
    }

    const script = document.createElement("script");

    if (widgetType === "heatmap") {
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    } else if (widgetType === "quotes") {
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    } else {
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    }

    script.async = true;
    script.innerHTML = JSON.stringify(config);

    container.innerHTML = "";
    container.appendChild(script);
  }

  function loadAllCharts() {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";

    // ===== MARKET SNAPSHOT =====
    safeLoadWidget(
      "market-snapshot",
      {
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
      },
      "quotes"
    );

    // ===== INDIVIDUAL CHARTS =====
    safeLoadWidget("tv-gold", {
      symbol: "TVC:GOLD",
      interval: "60",
      autosize: true,
      theme,
      style: "1",
      locale: "en"
    });

    safeLoadWidget("tv-silver", {
      symbol: "TVC:SILVER",
      interval: "60",
      autosize: true,
      theme,
      style: "1",
      locale: "en"
    });

    safeLoadWidget("tv-bitcoin", {
      symbol: "BINANCE:BTCUSDT",
      interval: "60",
      autosize: true,
      theme,
      style: "1",
      locale: "en"
    });

    safeLoadWidget("tv-crude", {
      symbol: "TVC:USOIL",
      interval: "60",
      autosize: true,
      theme,
      style: "1",
      locale: "en"
    });

    // ===== HEATMAP =====
    safeLoadWidget(
      "tv-heatmap",
      {
        exchange: "US",
        dataSource: "SP500",
        grouping: "sector",
        blockSize: "market_cap_basic",
        blockColor: "change",
        locale: "en",
        colorTheme: theme,
        width: "100%",
        height: 400
      },
      "heatmap"
    );
  }

  // 🔐 CRITICAL: wait until EVERYTHING is painted
  window.addEventListener("load", () => {
    setTimeout(loadAllCharts, 300);
  });
})();
