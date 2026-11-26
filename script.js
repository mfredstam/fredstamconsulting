'use strict';

/* ──────────────────────────────────────────────
   1. Footer year
────────────────────────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────────
   2. Hamburger toggle
────────────────────────────────────────────── */
const hamburgerBtn = document.getElementById('hamburger-btn');
const siteNav = document.getElementById('site-nav');

function openMenu() {
  siteNav.classList.add('is-open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  hamburgerBtn.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
  siteNav.classList.remove('is-open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
}

if (hamburgerBtn && siteNav) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close when a nav link is clicked (mobile)
  siteNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburgerBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      hamburgerBtn.focus();
    }
  });
}

/* ──────────────────────────────────────────────
   3. Scroll-spy (active nav link highlight)
────────────────────────────────────────────── */
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = document.querySelectorAll('.nav-link');

// Read navbar height from CSS custom property, resolving rem against the root font size
// (parseInt('4rem') would return 4, not 64)
function getNavbarHeight() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--navbar-height')
    .trim();
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return 64;
  if (value.endsWith('rem')) {
    return parsed * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  return parsed;
}

// Scroll-position based spy: the current section is the last one whose top edge
// has passed the navbar line. Works on any viewport height and at page bottom
// (where a rootMargin band can fail to intersect the last section).
function updateScrollSpy() {
  const pos = window.scrollY + getNavbarHeight() + 1;
  let currentId = sections.length > 0 ? sections[0].id : null;
  for (const section of sections) {
    if (section.offsetTop <= pos) currentId = section.id;
  }
  // At the very bottom of the page, force the last section active
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    currentId = sections[sections.length - 1].id;
  }
  if (!currentId) return;
  navLinks.forEach((link) => {
    // Compare by URL fragment so subpage links like "index.html#about" also match
    const fragment = (link.getAttribute('href') || '').split('#').pop();
    link.classList.toggle('is-active', fragment === currentId);
  });
}

let spyTicking = false;
window.addEventListener(
  'scroll',
  () => {
    if (spyTicking) return;
    spyTicking = true;
    window.requestAnimationFrame(() => {
      updateScrollSpy();
      spyTicking = false;
    });
  },
  { passive: true },
);
window.addEventListener('resize', updateScrollSpy);
updateScrollSpy();

/* ──────────────────────────────────────────────
   4. Service card scroll-reveal (staggered)
────────────────────────────────────────────── */
const cards = document.querySelectorAll('.service-card');

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const index = Array.from(cards).indexOf(card);
      // Stagger each card by 100ms
      setTimeout(() => {
        card.classList.add('is-visible');
      }, index * 100);
      // Only animate once
      cardObserver.unobserve(card);
    });
  },
  { threshold: 0.05 },
);

cards.forEach((card) => cardObserver.observe(card));

/* ──────────────────────────────────────────────
   5. Course card scroll-reveal (staggered)
────────────────────────────────────────────── */
const courseCards = document.querySelectorAll('.course-card');

const courseCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const index = Array.from(courseCards).indexOf(card);
      setTimeout(() => {
        card.classList.add('is-visible');
      }, index * 100);
      courseCardObserver.unobserve(card);
    });
  },
  { threshold: 0.05 },
);

courseCards.forEach((card) => courseCardObserver.observe(card));

/* ──────────────────────────────────────────────
   6. Scroll hint — hide after first scroll
────────────────────────────────────────────── */
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  const hideHint = () => {
    scrollHint.classList.add('is-hidden');
    window.removeEventListener('scroll', hideHint, { passive: true });
  };
  window.addEventListener('scroll', hideHint, { passive: true });
}
