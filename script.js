/* =====================================================
   GLOBAL SITE SCRIPT (SAFE INIT)
===================================================== */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(() => {
    document.documentElement.classList.add("js-ready");
  });

  window.addEventListener("error", () => {});
  window.addEventListener("unhandledrejection", () => {});
})();
