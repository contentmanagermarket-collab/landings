const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
let parallaxFrame = 0;

function setHeaderState() {
  header?.classList.toggle('scrolled', window.scrollY > 16);
}

function closeMenu() {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
  if (window.innerWidth > 850) closeMenu();
});

window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  navLinks.forEach((link) => {
    const target = link.getAttribute('href')?.slice(1);
    link.classList.toggle('active', target === visible.target.id);
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5] });

sections.forEach((section) => sectionObserver.observe(section));

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

function updateParallax() {
  parallaxFrame = 0;
  const enabled = window.innerWidth >= 1024 && !reducedMotion.matches;

  parallaxItems.forEach((item) => {
    if (!enabled) {
      item.style.removeProperty('transform');
      return;
    }

    const rect = item.getBoundingClientRect();
    if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;

    const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
    const distance = item.dataset.parallax === 'backdrop' ? 18 : 12;
    const scale = item.dataset.parallax === 'backdrop' ? ' scale(1.025)' : '';
    item.style.transform = `translate3d(0, ${(-progress * distance).toFixed(2)}px, 0)${scale}`;
  });
}

function requestParallaxUpdate() {
  if (parallaxFrame) return;
  parallaxFrame = window.requestAnimationFrame(updateParallax);
}

window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
window.addEventListener('resize', requestParallaxUpdate);
reducedMotion.addEventListener?.('change', requestParallaxUpdate);
requestParallaxUpdate();
