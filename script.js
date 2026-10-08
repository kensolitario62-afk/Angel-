// ====== EDIT THIS ======
const USERNAME = "your-github-username";
// =======================

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("gh-link").href = "https://github.com/" + USERNAME;

// Decorative activity grid
const graph = document.getElementById("graph");
for (let i = 0; i < 26 * 7; i++) {
  const cell = document.createElement("i");
  const r = Math.random();
  if (r > 0.88) cell.className = "l3";
  else if (r > 0.7) cell.className = "l2";
  else if (r > 0.5) cell.className = "l1";
  graph.appendChild(cell);
}

// Live repositories from GitHub
const list = document.getElementById("repos");
const status = document.getElementById("status");

fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=12`)
  .then(res => {
    if (!res.ok) throw new Error(res.status);
    return res.json();
  })
  .then(repos => {
    repos = repos.filter(r => !r.fork && r.name.toLowerCase() !== `${USERNAME}.github.io`);
    if (!repos.length) {
      status.textContent = "No public repositories yet. Push a project and refresh this page.";
      return;
    }
    status.remove();
    repos.forEach(r => {
      const li = document.createElement("li");
      li.className = "repo";
      const h = document.createElement("h3");
      const a = document.createElement("a");
      a.href = r.html_url; a.textContent = r.name;
      a.target = "_blank"; a.rel = "noopener";
      h.appendChild(a);
      const p = document.createElement("p");
      p.textContent = r.description || "No description yet.";
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = [r.language, "★ " + r.stargazers_count].filter(Boolean).join("   ");
      li.append(h, p, meta);
      list.appendChild(li);
    });
  })
  .catch(() => {
    status.textContent = "Couldn't load repositories. Check that USERNAME in script.js matches your GitHub username.";
  });
