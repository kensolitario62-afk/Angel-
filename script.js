// ====== EDIT THIS ======
const USERNAME = "kensolitario62-afk";
// =======================

const $ = id => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
$("gh-link").href = "https://github.com/" + USERNAME;
$("all-link").href = "https://github.com/" + USERNAME + "?tab=repositories";

let repos = [];

function card(r, i) {
  const li = document.createElement("li");
  li.className = "card";

  const rank = document.createElement("span");
  rank.className = "rank"; rank.textContent = "#" + (i + 1);
  li.appendChild(rank);

  const ageDays = (Date.now() - new Date(r.pushed_at)) / 864e5;
  if (ageDays < 14) {
    const b = document.createElement("span");
    b.className = "badge"; b.textContent = "NEW!";
    li.appendChild(b);
  }

  const h = document.createElement("h3"); h.textContent = r.name;
  const p = document.createElement("p"); p.textContent = r.description || "No description yet.";

  const tags = document.createElement("div"); tags.className = "tags";
  [r.language, ...(r.topics || []).slice(0, 2), "★ " + r.stargazers_count]
    .filter(Boolean)
    .forEach(t => { const s = document.createElement("span"); s.textContent = t; tags.appendChild(s); });

  const a = document.createElement("a");
  a.className = "btn yellow"; a.textContent = "Visit now";
  a.href = r.homepage || r.html_url; a.target = "_blank"; a.rel = "noopener";

  li.append(h, p, tags, a);
  return li;
}

fetch(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=30`)
  .then(res => { if (!res.ok) throw new Error(res.status); return res.json(); })
  .then(data => {
    repos = data.filter(r => !r.fork);
    $("count").textContent = repos.length;
    if (!repos.length) {
      $("status").textContent = "No public projects yet. Push one and refresh this page.";
      return;
    }
    $("status").remove();
    repos.slice(0, 6).forEach((r, i) => $("repos").appendChild(card(r, i)));
  })
  .catch(() => {
    $("status").textContent = "Couldn't load projects. Check that USERNAME in script.js matches your GitHub username.";
  });

$("random").addEventListener("click", () => {
  const note = $("lucky-note");
  if (!repos.length) { note.textContent = "No projects loaded yet. Try again in a moment."; return; }
  const r = repos[Math.floor(Math.random() * repos.length)];
  note.textContent = "Opening " + r.name + "…";
  window.open(r.homepage || r.html_url, "_blank", "noopener");
});
