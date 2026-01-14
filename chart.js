document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("market-snapshot");
  if (!container) return; // ✅ prevents GitHub runtime crash

  // Clear container (safe re-render)
  container.innerHTML = "";

  const script = document.createElement("script");
  script.src =
    "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
  script.type = "text/javascript";
  script.async = true;

  // Detect theme from HTML attribute
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";

  const config = {
    width: "100%",
    height: "380",
    symbolsGroups: [
      {
        name: "India",
        symbols: [
          { name: "BSE:SENSEX", displayName: "Sensex" },
          { name: "NSE:NIFTY", displayName: "Nifty 50" }
        ]
      },
      {
        name: "Global",
        symbols: [
          { name: "NASDAQ:NDX", displayName: "NASDAQ" },
          { name: "TVC:GOLD", displayName: "Gold" },
          { name: "BINANCE:BTCUSDT", displayName: "Bitcoin" }
        ]
      }
    ],
    showSymbolLogo: true,
    colorTheme: isDark ? "dark" : "light",
    locale: "en"
  };

  // TradingView requires JSON as text
  script.innerHTML = JSON.stringify(config);

  container.appendChild(script);
});
