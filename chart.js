/* =====================================================
   TRADINGVIEW SAFE LOADER (GITHUB PAGES HARDENED)
===================================================== */
(function () {
  "use strict";

  const TV_SRC = {
    chart: "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
    heatmap: "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js",
    quotes: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
  };

  function ensureContainer(id, minHeight = 320) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("section");
      el.id = id;
      el.style.minHeight = minHeight + "px";
      el.style.width = "100%";
      document.body.appendChild(el);
    }
    return el;
  }

  function safeWidget(id, config, type = "chart", attempt = 0) {
    const container = ensureContainer(id);

    if (!container.isConnected || container.offsetWidth < 50) {
      if (attempt < 20) {
        requestAnimationFrame(() =>
          safeWidget(id, config, type, attempt + 1)
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

  function loadAll() {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";

    safeWidget(
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

    safeWidget("tv-gold", {
      symbol: "TVC:GOLD",
      interval: "60",
      autosize: true,
      theme
    });

    safeWidget("tv-silver", {
      symbol: "TVC:SILVER",
      interval: "60",
      autosize: true,
      theme
    });

    safeWidget("tv-bitcoin", {
      symbol: "BINANCE:BTCUSDT",
      interval: "60",
      autosize: true,
      theme
    });

    safeWidget("tv-crude", {
      symbol: "TVC:USOIL",
      interval: "60",
      autosize: true,
      theme
    });

    safeWidget(
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

  window.addEventListener("load", () => {
    setTimeout(loadAll, 700);
  });
})();
