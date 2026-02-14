// Mobile drawer
const openMobile = document.getElementById('openMobile');
const mobileNav = document.getElementById('mobileNav');

openMobile?.addEventListener('click', () => {
  const expanded = openMobile.getAttribute('aria-expanded') === 'true';
  openMobile.setAttribute('aria-expanded', String(!expanded));
  if (mobileNav) mobileNav.style.display = expanded ? 'none' : 'block';
});

mobileNav?.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  openMobile?.setAttribute('aria-expanded', 'false');
  if (mobileNav) mobileNav.style.display = 'none';
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

// ===== Studio OS filtering (FIXED) =====
const grid = document.getElementById('propertyGrid');
const propSearch = document.getElementById('propSearch');
const clearBtn = document.getElementById('clearFilters');
const chips = Array.from(document.querySelectorAll('.osChip'));
const routes = Array.from(document.querySelectorAll('.route'));

function norm(s){ return (s || '').toLowerCase().trim(); }
function cards(){ return Array.from(grid?.querySelectorAll('.prop') || []); }

// Map OS chips to property "type" (based on the tag on each property card)
const chipToTags = {
  all: [],
  publishing: ['studio', 'digest'],       // editorial + studio layer
  research: ['research'],                  // research properties
  'open-source': ['open source'],          // awesome lists etc
  infrastructure: ['tech'],                // platform / infra angle
  systems: ['studio', 'tech', 'research'], // systems thinking spans these
};

let activeChip = 'all';
let query = '';

function setActiveChip(name){
  activeChip = name || 'all';
  chips.forEach(b => b.classList.toggle('isActive', b.dataset.filter === activeChip));
}

function matchesChip(card){
  const needed = chipToTags[activeChip] || [];
  if (!needed.length) return true;
  const tag = norm(card.dataset.tag || '');
  return needed.includes(tag);
}

function matchesQuery(card){
  const q = norm(query);
  if (!q) return true;
  // Search across name, tag, description, and links text
  const hay = [
    card.dataset.name,
    card.dataset.tag,
    card.dataset.desc,
    card.innerText
  ].map(norm).join(' ');
  return hay.includes(q);
}

function apply(){
  const list = cards();
  list.forEach(card => {
    const show = matchesChip(card) && matchesQuery(card);
    card.style.display = show ? '' : 'none';
  });
}

// Chip click
chips.forEach(btn => {
  btn.addEventListener('click', () => {
    setActiveChip(btn.dataset.filter || 'all');
    apply();
  });
});

// Search input
propSearch?.addEventListener('input', (e) => {
  query = e.target.value || '';
  apply();
});

// Clear
clearBtn?.addEventListener('click', () => {
  query = '';
  if (propSearch) propSearch.value = '';
  setActiveChip('all');
  apply();
});

// Quick routing sets the search box value (works like a command palette-lite)
routes.forEach(r => {
  r.addEventListener('click', () => {
    const val = r.dataset.route || '';
    if (!propSearch) return;
    propSearch.value = val;
    query = val;
    apply();
  });
});

// Init
if (chips.length) setActiveChip('all');
apply();
