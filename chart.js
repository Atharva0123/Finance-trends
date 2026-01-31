(() => {
  function waitForContainer(id, cb, tries = 40) {
    const el = document.getElementById(id);
    if (el && el.offsetHeight > 0 && el.parentNode) {
      cb(el);
    } else if (tries > 0) {
      setTimeout(() => waitForContainer(id, cb, tries - 1), 250);
    }
  }

  function loadWidget(id, src, config) {
    waitForContainer(id, el => {
      el.innerHTML = "";
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.innerHTML = JSON.stringify(config);
      el.appendChild(s);
    });
  }

  function loadAll() {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";

    loadWidget(
      "market-snapshot",
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
      {
        width: "100%",
        height: 380,
        colorTheme: theme,
        locale: "en",
        symbolsGroups: [
          {
            name: "Markets",
            symbols: [
              { name: "BSE:SENSEX" },
              { name: "NSE:NIFTY" },
              { name: "TVC:GOLD" },
              { name: "BINANCE:BTCUSDT" }
            ]
          }
        ]
      }
    );

    loadWidget("tv-gold",
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      { symbol: "TVC:GOLD", autosize: true, theme }
    );

    loadWidget("tv-silver",
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      { symbol: "TVC:SILVER", autosize: true, theme }
    );

    loadWidget("tv-bitcoin",
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      { symbol: "BINANCE:BTCUSDT", autosize: true, theme }
    );

    loadWidget("tv-crude",
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      { symbol: "TVC:USOIL", autosize: true, theme }
    );

    loadWidget(
      "tv-heatmap",
      "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js",
      {
        exchange: "US",
        dataSource: "SP500",
        blockColor: "change",
        colorTheme: theme,
        width: "100%",
        height: 400
      }
    );
  }

  window.addEventListener("load", () => {
    setTimeout(loadAll, 600);
  });

  window.addEventListener("themeChange", () => {
    setTimeout(loadAll, 400);
  });
})();
