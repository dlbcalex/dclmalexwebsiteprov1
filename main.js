/* ============================================================
   Deeper Life Bible Church — Alexandria, VA
   main.js — partial loading, nav, search, scroll reveal, small UX niceties
   ============================================================ */

async function loadPartial(url, placeholderId) {
  const el = document.getElementById(placeholderId);
  if (!el) return;
  try {
    const res = await fetch(url);
    el.outerHTML = await res.text();
  } catch (err) {
    console.error(`Failed to load ${url}`, err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadPartial('partials/header.html', 'header-placeholder'),
    loadPartial('partials/footer.html', 'footer-placeholder'),
  ]);

  /* ---------- Keep in-page links smooth-scrolling while already on the home page ---------- */
  const isHome = /\/(index\.html)?$/.test(window.location.pathname);
  if (isHome) {
    document.querySelectorAll('a[href^="index.html#"]').forEach((a) => {
      a.setAttribute('href', a.getAttribute('href').replace('index.html', ''));
    });
  }

  /* ---------- Mobile nav drawer ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  const openNav = () => {
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle?.addEventListener('click', openNav);
  mobileNavClose?.addEventListener('click', closeNav);
  mobileNav
    ?.querySelectorAll('a')
    .forEach((a) => a.addEventListener('click', closeNav));

  /* ---------- Site search ---------- */
  const SEARCH_INDEX = [
    { title: 'Home', url: 'index.html' },
    { title: 'Who We Are', url: 'index.html#about' },
    { title: 'Our Beliefs / Bible Doctrines', url: 'index.html#beliefs' },
    { title: 'Pastor Dr. William F. Kumuyi', url: 'pastor-kumuyi.html' },
    { title: 'Pastor Dr. James Amara', url: 'pastor-amara.html' },
    { title: 'Church Services', url: 'services.html' },
    { title: 'Event Calendar', url: 'events.html' },
    { title: 'Global Crusade with Kumuyi (GCK)', url: 'gck.html' },
    { title: 'Our Church Family / Gallery', url: 'index.html#gallery' },
    { title: 'Where We Are / Map', url: 'index.html#location' },
    { title: 'Daily Manna', url: 'https://www.dailymanna.app/signin' },
    { title: 'YouTube — DCLM Alexandria VA', url: 'https://www.youtube.com/@dclmalexva' },
    { title: 'Give / Donate', url: 'give.html' },
    { title: 'Contact & Newcomers', url: 'contact.html' },
  ];

  const setupSearch = (input, resultsEl) => {
    if (!input || !resultsEl) return;

    const renderResults = (query) => {
      const q = query.trim().toLowerCase();
      resultsEl.innerHTML = '';
      if (!q) {
        resultsEl.classList.remove('is-open');
        return;
      }
      const matches = SEARCH_INDEX.filter((item) =>
        item.title.toLowerCase().includes(q)
      ).slice(0, 6);
      if (!matches.length) {
        const empty = document.createElement('div');
        empty.className = 'search-empty';
        empty.textContent = 'No matches found.';
        resultsEl.appendChild(empty);
      } else {
        matches.forEach((item) => {
          const a = document.createElement('a');
          a.href = item.url;
          a.textContent = item.title;
          resultsEl.appendChild(a);
        });
      }
      resultsEl.classList.add('is-open');
    };

    input.addEventListener('input', () => renderResults(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = resultsEl.querySelector('a');
        if (first) window.location.href = first.getAttribute('href');
      } else if (e.key === 'Escape') {
        input.value = '';
        resultsEl.innerHTML = '';
        resultsEl.classList.remove('is-open');
        input.blur();
      }
    });
  };

  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  setupSearch(searchInput, searchResults);

  searchToggle?.addEventListener('click', () => {
    const isOpen = searchPanel.classList.toggle('is-open');
    searchToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) searchInput?.focus();
  });
  document.addEventListener('click', (e) => {
    if (
      searchPanel?.classList.contains('is-open') &&
      !e.target.closest('.nav-search')
    ) {
      searchPanel.classList.remove('is-open');
      searchToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const mobileSearchResults = document.getElementById('mobileSearchResults');
  setupSearch(mobileSearchInput, mobileSearchResults);

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 12) {
      header.style.boxShadow = '0 12px 30px -20px rgba(0,0,0,0.6)';
    } else {
      header.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Welcome modal ---------- */
  const welcomeModal = document.getElementById('welcomeModal');
  if (welcomeModal) {
    const WELCOME_SEEN_KEY = 'dlbc-welcome-seen';
    const welcomeModalClose = document.getElementById('welcomeModalClose');
    const welcomeModalDismiss = document.getElementById('welcomeModalDismiss');
    const welcomeModalCta = document.getElementById('welcomeModalCta');

    const closeWelcomeModal = () => {
      welcomeModal.classList.remove('is-open');
      welcomeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (!localStorage.getItem(WELCOME_SEEN_KEY)) {
      setTimeout(() => {
        welcomeModal.classList.add('is-open');
        welcomeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        localStorage.setItem(WELCOME_SEEN_KEY, 'true');
      }, 4000);
    }

    welcomeModalClose?.addEventListener('click', closeWelcomeModal);
    welcomeModalDismiss?.addEventListener('click', closeWelcomeModal);
    welcomeModalCta?.addEventListener('click', closeWelcomeModal);
    welcomeModal.addEventListener('click', (e) => {
      if (e.target === welcomeModal) closeWelcomeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && welcomeModal.classList.contains('is-open')) {
        closeWelcomeModal();
      }
    });
  }

  /* ---------- Hero slideshow ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroPrev = document.querySelector('.hero .carousel-prev');
  const heroNext = document.querySelector('.hero .carousel-next');
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    const showHeroSlide = (next) => {
      heroSlides[heroIndex].classList.remove('is-active');
      heroIndex = (next + heroSlides.length) % heroSlides.length;
      heroSlides[heroIndex].classList.add('is-active');
    };
    let heroTimer = setInterval(() => showHeroSlide(heroIndex + 1), 7000);
    const resetHeroTimer = () => {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => showHeroSlide(heroIndex + 1), 7000);
    };
    heroPrev?.addEventListener('click', () => {
      showHeroSlide(heroIndex - 1);
      resetHeroTimer();
    });
    heroNext?.addEventListener('click', () => {
      showHeroSlide(heroIndex + 1);
      resetHeroTimer();
    });
  }

  /* ---------- Mission photo carousel ---------- */
  const missionSlides = document.querySelectorAll('.mission-figure .carousel-slide');
  const missionPrev = document.querySelector('.mission-figure .carousel-prev');
  const missionNext = document.querySelector('.mission-figure .carousel-next');
  if (missionSlides.length > 1) {
    let missionIndex = 0;
    const showMissionSlide = (next) => {
      missionSlides[missionIndex].classList.remove('is-active');
      missionIndex = (next + missionSlides.length) % missionSlides.length;
      missionSlides[missionIndex].classList.add('is-active');
    };
    let missionTimer = setInterval(() => showMissionSlide(missionIndex + 1), 5000);
    const resetMissionTimer = () => {
      clearInterval(missionTimer);
      missionTimer = setInterval(() => showMissionSlide(missionIndex + 1), 5000);
    };
    missionPrev?.addEventListener('click', () => {
      showMissionSlide(missionIndex - 1);
      resetMissionTimer();
    });
    missionNext?.addEventListener('click', () => {
      showMissionSlide(missionIndex + 1);
      resetMissionTimer();
    });
  }

});
