/* =====================================================
   BLOG RENDERER (CONTENT PRESERVED)
===================================================== */
(function () {
  "use strict";

  if (!Array.isArray(window.blogs)) {
    console.warn("blogs array not found");
    return;
  }

  function ensureContainer() {
    let c = document.getElementById("blogs-container");
    if (!c) {
      c = document.createElement("section");
      c.id = "blogs-container";
      document.body.appendChild(c);
    }
    return c;
  }

  function render() {
    const container = ensureContainer();
    container.innerHTML = "";

    window.blogs.forEach((blog) => {
      const article = document.createElement("article");
      article.className = "blog-card";

      article.innerHTML = `
        <h2>${blog.title}</h2>
        <p>${blog.description}</p>
        <a href="${blog.link}" target="_blank" rel="noopener">Read more</a>
      `;

      container.appendChild(article);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
