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
