const PER_PAGE = 9;
let newsData = [];
let contentData = [];
let newsPage = 1;
let contentPage = 1;

// Tab switching
document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((s) => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('my-MM', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderImage(entry) {
  if (entry.image) {
    return `<img class="card-image" src="${entry.image}" alt="${entry.title}" onerror="this.outerHTML='<div class=\\'card-image placeholder\\'>🌌</div>'">`;
  }
  return '<div class="card-image placeholder">🌌</div>';
}

function renderNewsCard(entry) {
  return `
    <article class="card">
      ${renderImage(entry)}
      <div class="card-body">
        <h3>${entry.title}</h3>
        <p>${entry.summary}</p>
        <div class="tags">
          ${(entry.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="card-meta">
          <span>${entry.source}</span>
          <span>${formatDate(entry.createdAt)}</span>
        </div>
        <a class="card-link" href="${entry.link}" target="_blank" rel="noopener">
          မူရင်းဆောင်းပါး ဖတ်ရန် →
        </a>
      </div>
    </article>
  `;
}

function renderContentCard(entry) {
  const facts = (entry.keyFacts || [])
    .map((f) => `<li>${f}</li>`)
    .join('');

  return `
    <article class="card">
      ${renderImage(entry)}
      <div class="card-body">
        <h3>${entry.title}</h3>
        <p>${entry.introduction}</p>
        ${facts ? `<ul class="key-facts">${facts}</ul>` : ''}
        <div class="tags">
          ${(entry.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="card-meta">
          <span>${entry.category}</span>
          <span>${formatDate(entry.createdAt)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderPagination(totalItems, currentPage, onPageChange) {
  const totalPages = Math.ceil(totalItems / PER_PAGE);
  if (totalPages <= 1) return '';

  let html = '<div class="pagination">';
  html += `<button class="page-btn" ${currentPage <= 1 ? 'disabled' : ''} data-page="${currentPage - 1}">← နောက်သို့</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  html += `<button class="page-btn" ${currentPage >= totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">ရှေ့သို့ →</button>`;
  html += '</div>';
  return html;
}

function paginate(data, page) {
  const start = (page - 1) * PER_PAGE;
  return data.slice(start, start + PER_PAGE);
}

function renderNews() {
  const grid = document.getElementById('news-grid');
  if (newsData.length === 0) {
    grid.innerHTML = '<p class="empty">သတင်းများ မရှိသေးပါ။ Agent များ ပထမဆုံးအကြိမ် run ပြီးမှ ပေါ်လာပါမည်။</p>';
    return;
  }
  const pageItems = paginate(newsData, newsPage);
  grid.innerHTML = pageItems.map(renderNewsCard).join('') + renderPagination(newsData.length, newsPage);

  grid.querySelectorAll('.pagination .page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page);
      if (p >= 1 && p <= Math.ceil(newsData.length / PER_PAGE)) {
        newsPage = p;
        renderNews();
        document.getElementById('news').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function renderContent() {
  const grid = document.getElementById('content-grid');
  if (contentData.length === 0) {
    grid.innerHTML = '<p class="empty">ဆောင်းပါးများ မရှိသေးပါ။ Agent များ ပထမဆုံးအကြိမ် run ပြီးမှ ပေါ်လာပါမည်။</p>';
    return;
  }
  const pageItems = paginate(contentData, contentPage);
  grid.innerHTML = pageItems.map(renderContentCard).join('') + renderPagination(contentData.length, contentPage);

  grid.querySelectorAll('.pagination .page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page);
      if (p >= 1 && p <= Math.ceil(contentData.length / PER_PAGE)) {
        contentPage = p;
        renderContent();
        document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function renderStats() {
  document.getElementById('stats').innerHTML = `
    <span class="stat-item">📡 သတင်း ${newsData.length} ခု</span>
    <span class="stat-item">📖 ဆောင်းပါး ${contentData.length} ခု</span>
  `;
}

async function loadNews() {
  try {
    const res = await fetch('/api/news.json');
    newsData = await res.json();
    newsData.reverse();
    newsPage = 1;
    renderNews();
  } catch (err) {
    document.getElementById('news-grid').innerHTML = '<p class="empty">သတင်းများ ရယူ၍ မရပါ။</p>';
  }
}

async function loadContent() {
  try {
    const res = await fetch('/api/content.json');
    contentData = await res.json();
    contentData.reverse();
    contentPage = 1;
    renderContent();
  } catch (err) {
    document.getElementById('content-grid').innerHTML = '<p class="empty">ဆောင်းပါးများ ရယူ၍ မရပါ။</p>';
  }
}

// Initial load
async function init() {
  await Promise.all([loadNews(), loadContent()]);
  renderStats();
}
init();
