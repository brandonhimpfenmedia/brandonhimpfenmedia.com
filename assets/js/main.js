// Mobile drawer
const openMobile = document.getElementById('openMobile');
const mobileNav = document.getElementById('mobileNav');

openMobile?.addEventListener('click', () => {
  const expanded = openMobile.getAttribute('aria-expanded') === 'true';
  openMobile.setAttribute('aria-expanded', String(!expanded));
  mobileNav.style.display = expanded ? 'none' : 'block';
});

mobileNav?.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  openMobile.setAttribute('aria-expanded', 'false');
  mobileNav.style.display = 'none';
});

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Studio OS filtering =====
const grid = document.getElementById('propertyGrid');
const propSearch = document.getElementById('propSearch');
const clearBtn = document.getElementById('clearFilters');
const chips = Array.from(document.querySelectorAll('.osChip'));
const routes = Array.from(document.querySelectorAll('.route'));

function getCards() {
  return Array.from(grid?.querySelectorAll('.prop') || []);
}

function normalize(s) {
  return (s || '').toLowerCase().trim();
}

// Map OS filters to property tags/themes
const filterMap = {
  all: () => true,
  publishing: (card) => normalize(card.innerText).includes('studio') || normalize(card.innerText).includes('publishing'),
  research: (card) => normalize(card.innerText).includes('research'),
  'open-source': (card) => normalize(card.innerText).includes('open source') || normalize(card.innerText).includes('awesome'),
  infrastructure: (card) => normalize(card.innerText).includes('platform') || normalize(card.innerText).includes('infrastructure'),
  systems: (card) => normalize(card.innerText).includes('systems') || normalize(card.innerText).includes('governance'),
};

let activeFilter = 'all';
let activeQuery = '';

function applyFilters() {
  const cards = getCards();
  const q = normalize(activeQuery);

  cards.forEach(card => {
    const text = normalize(card.innerText);
    const passesQuery = q ? text.includes(q) : true;
    const fn = filterMap[activeFilter] || filterMap.all;
    const passesFilter = fn(card);

    const show = passesQuery && passesFilter;
    card.style.display = show ? '' : 'none';
    card.style.opacity = show ? '1' : '0';
  });
}

chips.forEach(btn => {
  btn.addEventListener('click', () => {
    chips.forEach(b => b.classList.remove('isActive'));
    btn.classList.add('isActive');
    activeFilter = btn.dataset.filter || 'all';
    applyFilters();
  });
});

// Default active chip
const firstChip = chips.find(c => c.dataset.filter === 'all') || chips[0];
firstChip?.classList.add('isActive');

propSearch?.addEventListener('input', (e) => {
  activeQuery = e.target.value || '';
  applyFilters();
});

clearBtn?.addEventListener('click', () => {
  activeFilter = 'all';
  activeQuery = '';
  if (propSearch) propSearch.value = '';
  chips.forEach(b => b.classList.remove('isActive'));
  firstChip?.classList.add('isActive');
  applyFilters();
});

// Quick routing: set search value based on route
routes.forEach(r => {
  r.addEventListener('click', () => {
    const val = r.dataset.route || '';
    if (!propSearch) return;
    propSearch.value = val;
    activeQuery = val;
    applyFilters();
  });
});

// Run once
applyFilters();
