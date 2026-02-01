/* =====================================================
   TRADINGVIEW SAFE LOADER (HARDENED)
===================================================== */
(function () {
  const TV_SRC = {
    chart: "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
    heatmap: "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js",
    quotes: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
  };

  function ensureContainer(id, minHeight = 320) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.style.minHeight = minHeight + "px";
      document.body.appendChild(el);
    }
    el.style.minHeight = minHeight + "px";
    return el;
  }

  function safeLoadWidget(id, config, type = "chart", retries = 3) {
    const container = ensureContainer(id);

    const ready =
      container.offsetWidth > 50 &&
      container.offsetHeight > 50 &&
      container.isConnected;

    if (!ready) {
      if (retries > 0) {
        requestAnimationFrame(() =>
          safeLoadWidget(id, config, type, retries - 1)
        );
      }
      return;
    }

    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = TV_SRC[type];
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    container.appendChild(script);
  }

  function loadAllCharts() {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";

    safeLoadWidget(
      "market-snapshot",
      {
        width: "100%",
        height: 380,
        symbolsGroups: [
          {
            name: "Indices",
            symbols: [
              { name: "NSE:NIFTY", displayName: "NIFTY 50" },
              { name: "BSE:SENSEX", displayName: "SENSEX" },
              { name: "NASDAQ:NDX", displayName: "NASDAQ 100" }
            ]
          }
        ],
        showSymbolLogo: true,
        colorTheme: theme,
        locale: "en"
      },
      "quotes"
    );

    safeLoadWidget("tv-gold", {
      symbol: "TVC:GOLD",
      interval: "60",
      autosize: true,
      theme
    });

    safeLoadWidget("tv-silver", {
      symbol: "TVC:SILVER",
      interval: "60",
      autosize: true,
      theme
    });

    safeLoadWidget("tv-bitcoin", {
      symbol: "BINANCE:BTCUSDT",
      interval: "60",
      autosize: true,
      theme
    });

    safeLoadWidget("tv-crude", {
      symbol: "TVC:USOIL",
      interval: "60",
      autosize: true,
      theme
    });

    safeLoadWidget(
      "tv-heatmap",
      {
        exchange: "US",
        dataSource: "SP500",
        grouping: "sector",
        blockSize: "market_cap_basic",
        blockColor: "change",
        width: "100%",
        height: 400,
        colorTheme: theme
      },
      "heatmap"
    );
  }

  // 🔒 wait until DOM + layout + fonts are ready
  window.addEventListener("load", () => {
    setTimeout(loadAllCharts, 600);
  });
})();
