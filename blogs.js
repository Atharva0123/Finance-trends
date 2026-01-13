const ALL_BLOGS = [
  {title:"AI in Portfolio Optimization",content:"AI models enhance diversification.",category:"ai"},
  {title:"Quantum Computing and Cryptography",content:"Quantum threatens traditional encryption.",category:"ai"},
  {title:"Market Cycles Explained",content:"Understanding bull and bear markets.",category:"market"},
  {title:"How FinTech Is Reshaping Banking",content:"Neobanks redefine finance.",category:"fintech"},
  {title:"AI Trading Systems",content:"Algorithms reduce emotional bias.",category:"ai"},
  {title:"Global Equity Risks in 2026",content:"Macro risks remain elevated.",category:"market"}
];

function renderBlogs(category) {
  const container = document.getElementById("blogs-container");
  container.innerHTML = ALL_BLOGS
    .filter(b => b.category === category)
    .map(b => `
      <article class="post reveal">
        <div class="post-content">
          <span class="badge ${category}">${category.toUpperCase()}</span>
          <h3>${b.title}</h3>
          <p>${b.content}</p>
        </div>
      </article>
    `).join("");
}
