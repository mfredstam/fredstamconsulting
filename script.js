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
const siteNav      = document.getElementById('site-nav');

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
  siteNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburgerBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      hamburgerBtn.focus();
    }
  });
}


/* ──────────────────────────────────────────────
   3. Scroll-spy (active nav link highlight)
────────────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

// Read navbar height from CSS custom property
function getNavbarHeight() {
  return parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--navbar-height') || '64',
    10
  );
}

// Track which section is "current" so upward scroll works
let activeSectionId = null;

const spyObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSectionId = entry.target.id;
      }
    });
    const visibleEntry = entries.find(e => e.isIntersecting);
    const id = visibleEntry ? visibleEntry.target.id : activeSectionId;
    if (!id) return;
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  },
  {
    rootMargin: `-${getNavbarHeight()}px 0px -50% 0px`,
    threshold: 0,
  }
);

sections.forEach(section => spyObserver.observe(section));


/* ──────────────────────────────────────────────
   4. Service card scroll-reveal (staggered)
────────────────────────────────────────────── */
const cards = document.querySelectorAll('.service-card');

const cardObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card  = entry.target;
      const index = Array.from(cards).indexOf(card);
      // Stagger each card by 100ms
      setTimeout(() => {
        card.classList.add('is-visible');
      }, index * 100);
      // Only animate once
      cardObserver.unobserve(card);
    });
  },
  { threshold: 0.05 }
);

cards.forEach(card => cardObserver.observe(card));


/* ──────────────────────────────────────────────
   5. Scroll hint — hide after first scroll
────────────────────────────────────────────── */
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  const hideHint = () => {
    scrollHint.classList.add('is-hidden');
    window.removeEventListener('scroll', hideHint, { passive: true });
  };
  window.addEventListener('scroll', hideHint, { passive: true });
}
