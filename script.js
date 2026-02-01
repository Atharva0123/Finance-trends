/* ===========================
   GLOBAL SAFETY & PERFORMANCE
=========================== */

(function () {
  // Passive event listener patch (performance warnings)
  const origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (
      type === "scroll" ||
      type === "wheel" ||
      type === "touchmove"
    ) {
      options = typeof options === "object"
        ? { ...options, passive: true }
        : { passive: true };
    }
    return origAdd.call(this, type, listener, options);
  };

  // Suppress TradingView support-portal 403 spam
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    if (
      typeof args[0] === "string" &&
      args[0].includes("support-portal-problems")
    ) {
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    return originalFetch.apply(this, args);
  };
})();

/* ===========================
   SAFE DOM HELPERS
=========================== */

function safeGet(id, parent = document.body) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    parent.appendChild(el);
  }
  return el;
}

function runWhenReady(fn) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  }
}

function runWhenIdle(fn) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(fn, { timeout: 200 });
  } else {
    setTimeout(fn, 1);
  }
}

/* ===========================
   CORE PAGE STRUCTURE
=========================== */

runWhenReady(() => {
  const main = safeGet("app-root");

  safeGet("sidebar", main);
  safeGet("main-content", main);
  safeGet("charts-section", main);
  safeGet("community-insights", main);
  safeGet("news-section", main);
  safeGet("footer-links", main);
});

/* ===========================
   CURSOR BACKGROUND ANIMATION
=========================== */

runWhenIdle(() => {
  const cursor = document.createElement("div");
  cursor.className = "cursor-glow";
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
});
