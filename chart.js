/* =====================================================
   TRADINGVIEW SAFE LOADER — GITHUB PAGES HARDENED
===================================================== */
(() => {
  "use strict";

  const TV_SRC = {
    chart: "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
    heatmap: "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js",
    quotes: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
  };

  function ensureContainer(id, minHeight = 360) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("section");
      el.id = id;
      el.style.minHeight = minHeight + "px";
      el.style.width = "100%";
      el.style.margin = "40px auto";
      document.body.appendChild(el);
    }
    return el;
  }

  function waitForLayout(el, cb, attempts = 20) {
    if (!el || attempts <= 0) return;
    const ready = el.offsetWidth > 100 && el.offsetHeight > 100;
    if (ready) cb();
    else requestAnimationFrame(() => waitForLayout(el, cb, attempts - 1));
  }

  function loadWidget(id, config, type = "chart") {
    const container = ensureContainer(id);
    waitForLayout(container, () => {
      container.innerHTML = "";
      const script = document.createElement("script");
      script.src = TV_SRC[type];
      script.async = true;
      script.textContent = JSON.stringify(config);
      container.appendChild(script);
    });
  }

  function loadAll() {
    const theme = "light";

    loadWidget("market-snapshot", {
      width: "100%",
      height: 380,
      symbolsGroups: [{
        name: "Indices",
        symbols: [
          { name: "NSE:NIFTY", displayName: "NIFTY 50" },
          { name: "BSE:SENSEX", displayName: "SENSEX" },
          { name: "NASDAQ:NDX", displayName: "NASDAQ 100" }
        ]
      }],
      showSymbolLogo: true,
      colorTheme: theme,
      locale: "en"
    }, "quotes");

    loadWidget("tv-gold", {
      symbol: "TVC:GOLD",
      interval: "60",
      autosize: true,
      theme
    });

    loadWidget("tv-silver", {
      symbol: "TVC:SILVER",
      interval: "60",
      autosize: true,
      theme
    });

    loadWidget("tv-bitcoin", {
      symbol: "BINANCE:BTCUSDT",
      interval: "60",
      autosize: true,
      theme
    });

    loadWidget("tv-crude", {
      symbol: "TVC:USOIL",
      interval: "60",
      autosize: true,
      theme
    });

    loadWidget("tv-heatmap", {
      exchange: "US",
      dataSource: "SP500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      width: "100%",
      height: 420,
      colorTheme: theme
    }, "heatmap");
  }

  window.addEventListener("load", () => {
    setTimeout(loadAll, 500);
  });
})();
