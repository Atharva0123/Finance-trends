document.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
  script.async = true;

  script.innerHTML = JSON.stringify({
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
    colorTheme: "light",
    locale: "en"
  });

  document.getElementById("market-snapshot").appendChild(script);
});
