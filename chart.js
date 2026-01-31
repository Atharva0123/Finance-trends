document.addEventListener("DOMContentLoaded", () => {

  function loadTradingViewWidget(containerId, config) {
    const container = document.getElementById(containerId);
    if (!container) return; // 🔐 prevents parentNode crash

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    container.innerHTML = ""; // clean mount
    container.appendChild(script);
  }

  function loadHeatmap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      exchange: "US",
      dataSource: "SP500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      colorTheme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      hasTopBar: false,
      isDataSetEnabled: false,
      width: "100%",
      height: "400"
    });

    container.innerHTML = "";
    container.appendChild(script);
  }

  // ================= MARKET SNAPSHOT =================
  const snapshot = document.getElementById("market-snapshot");
  if (snapshot) {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
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
      colorTheme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      locale: "en"
    });

    snapshot.appendChild(script);
  }

  // ================= INDIVIDUAL CHARTS =================
  loadTradingViewWidget("tv-gold", {
    symbol: "TVC:GOLD",
    interval: "60",
    autosize: true,
    theme: "dark",
    style: "1",
    locale: "en"
  });

  loadTradingViewWidget("tv-silver", {
    symbol: "TVC:SILVER",
    interval: "60",
    autosize: true,
    theme: "dark",
    style: "1",
    locale: "en"
  });

  loadTradingViewWidget("tv-bitcoin", {
    symbol: "BINANCE:BTCUSDT",
    interval: "60",
    autosize: true,
    theme: "dark",
    style: "1",
    locale: "en"
  });

  loadTradingViewWidget("tv-crude", {
    symbol: "TVC:USOIL",
    interval: "60",
    autosize: true,
    theme: "dark",
    style: "1",
    locale: "en"
  });

  loadHeatmap("tv-heatmap");

});
