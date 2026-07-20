// ============================================================
// WEI 2026 — VetEuropea — Interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuIconOpen.classList.toggle('hidden');
      menuIconClose.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(isHidden));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      });
    });
  }

  /* ---------- Nav background on scroll + active link ---------- */
  const nav = document.getElementById('site-nav');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scroll-progress');
  const mobileStickyCta = document.getElementById('mobile-sticky-cta');
  const hero = document.getElementById('hero');

  function onScroll() {
    const scrollY = window.scrollY;

    if (nav) nav.classList.toggle('nav-solid', scrollY > 40);

    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }

    if (mobileStickyCta && hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      mobileStickyCta.classList.toggle('show', heroBottom < 0);
    }

    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Countdown timer ---------- */
  const countdownTarget = new Date('2026-09-25T00:00:00+02:00').getTime();
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function updateCountdown() {
    const now = Date.now();
    const diff = countdownTarget - now;

    if (diff <= 0) {
      [daysEl, hoursEl, minsEl, secsEl].forEach(el => { if (el) el.textContent = '00'; });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Early-bird pricing urgency message ---------- */
  const earlybirdEl = document.getElementById('earlybird-countdown');
  if (earlybirdEl) {
    const earlybirdEnd = new Date('2026-08-01T23:59:59+02:00').getTime();
    const v1End = new Date('2026-09-16T23:59:59+02:00').getTime();
    const now = Date.now();

    if (now < earlybirdEnd) {
      const daysLeft = Math.max(1, Math.ceil((earlybirdEnd - now) / (1000 * 60 * 60 * 24)));
      earlybirdEl.textContent = `⏳ Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} pour profiter du tarif à 160 € (avant le 1er août 2026)`;
    } else if (now < v1End) {
      earlybirdEl.textContent = `Tarif à 170 € — sauf V1 (1ère année) : encore à 160 € jusqu'au 16 septembre 2026`;
    } else {
      earlybirdEl.textContent = '';
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Copy IBAN ---------- */
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(value);
        showToast('Copié : ' + value);
      } catch (e) {
        showToast('Impossible de copier automatiquement — copie-le manuellement');
      }
    });
  });

  /* ---------- Smooth anchor scroll offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Current year in footer ---------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
