(function () {
  "use strict";

  const SRC = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

  function ensure(id) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("section");
      el.id = id;
      el.style.minHeight = "350px";
      document.body.appendChild(el);
    }
    return el;
  }

  function widget(id, symbol) {
    const el = ensure(id);
    el.innerHTML = "";

    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;

    s.innerHTML = JSON.stringify({
      symbol,
      interval: "60",
      autosize: true,
      theme: "dark",
      locale: "en",

      /* 🔒 HARD BLOCK SUPPORT / PUBLISHING */
      enable_publishing: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      details: false,
      hotlist: false,
      studies: false,
      withdateranges: false,
      show_popup_button: false,
      hide_side_toolbar: true,
      hide_top_toolbar: true,
      hide_legend: true
    });

    el.appendChild(s);
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      widget("tv-gold", "TVC:GOLD");
      widget("tv-silver", "TVC:SILVER");
      widget("tv-bitcoin", "BINANCE:BTCUSDT");
      widget("tv-crude", "TVC:USOIL");
    }, 600);
  });
})();
