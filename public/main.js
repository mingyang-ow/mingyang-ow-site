'use strict';

// Nav: darken on scroll past hero
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Scroll reveal via IntersectionObserver
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// GitHub repos
const LANG_COLORS = {
  'Python':           '#3572A5',
  'JavaScript':       '#F1E05A',
  'TypeScript':       '#3178C6',
  'Jupyter Notebook': '#DA5B0B',
  'HTML':             '#E34C26',
  'CSS':              '#563D7C',
  'Java':             '#B07219',
  'C++':              '#F34B7D',
  'C':                '#555555',
  'Go':               '#00ADD8',
  'Rust':             '#DEA584',
  'Ruby':             '#701516',
  'Shell':            '#89E051',
};

function starIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`;
}

function repoCard(repo) {
  const langColor = LANG_COLORS[repo.language] ?? '#8892A4';
  return `
    <a href="${repo.html_url}" class="repo-card" target="_blank" rel="noopener noreferrer">
      <span class="repo-name">${repo.name.replace(/-/g, '‑')}</span>
      <span class="repo-desc">${repo.description ?? 'No description.'}</span>
      <div class="repo-meta">
        ${repo.language ? `
          <span class="repo-lang">
            <span class="lang-dot" style="background:${langColor}"></span>
            ${repo.language}
          </span>
        ` : ''}
        <span class="repo-stars">
          ${starIcon()}
          ${repo.stargazers_count}
        </span>
      </div>
    </a>
  `;
}

async function loadRepos() {
  const grid = document.getElementById('repos-grid');
  try {
    const res = await fetch('https://api.github.com/users/mingyang-ow/repos?sort=updated&per_page=12');
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const repos = await res.json();
    const own = repos.filter(r => !r.fork);
    if (own.length === 0) {
      grid.innerHTML = '<p class="repos-status">No public repositories yet.</p>';
      return;
    }
    grid.innerHTML = own.map(repoCard).join('');
  } catch {
    grid.innerHTML = `<p class="repos-status">Couldn't load repositories &mdash; <a href="https://github.com/mingyang-ow" target="_blank" rel="noopener noreferrer">view them on GitHub</a>.</p>`;
  }
}

loadRepos();
