/* ============================================================
   Deeper Life Bible Church, Alexandria, VA
   main.js: partial loading, nav, search, scroll reveal, small UX niceties
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

  /* ---------- Discourage image saving (privacy) ---------- */
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

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
    { title: 'Who We Are / About Us', url: 'about.html' },
    { title: 'Our Beliefs / What We Believe', url: 'about.html#beliefs' },
    { title: 'General Superintendent - Pastor Dr. William F. Kumuyi', url: 'pastor-kumuyi.html' },
    { title: 'Regional Overseer - Pastor Dr. Michael A. Dada', url: 'pastor-dada.html' },
    { title: 'Location Pastor - Pastor Dr. James Amara', url: 'pastor-amara.html' },
    { title: 'Our Leaders', url: 'index.html#leaders' },
    { title: 'Church Services', url: 'services.html' },
    { title: 'Event Calendar', url: 'events.html' },
    { title: 'Stay Connected / WhatsApp Groups', url: 'connect.html' },
    { title: 'Global Crusade with Kumuyi (GCK)', url: 'gck.html' },
    { title: 'Picture Gallery', url: 'gallery.html' },
    { title: 'Devotionals: Daily Manna', url: 'https://dailymanna.app' },
    { title: 'Devotionals: Higher Everyday', url: 'https://dailymanna.app/category/higher-everyday/' },
    { title: 'Contact Us', url: 'index.html#location' },
    { title: 'Our Location / Map', url: 'index.html#location' },
    { title: 'Daily Manna', url: 'https://www.dailymanna.app/signin' },
    { title: 'YouTube: DCLM Alexandria VA', url: 'https://www.youtube.com/@dclmalexva' },
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
    // Homepage: header is transparent over the hero until you scroll
    header?.classList.toggle('is-scrolled', window.scrollY > 40);
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
            const el = entry.target;
            el.classList.add('is-visible');
            io.unobserve(el);
            // Once revealed, drop the stagger delay so hover effects respond instantly
            const wait = (parseInt(el.dataset.revealDelay || '0', 10) || 0) + 1100;
            setTimeout(() => {
              el.style.transitionDelay = '';
            }, wait);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el, i) => {
      // data-reveal-delay="ms" sets an explicit stagger; otherwise auto-stagger
      const delay = el.dataset.revealDelay;
      el.style.transitionDelay =
        delay !== undefined ? `${delay}ms` : `${Math.min(i % 4, 3) * 80}ms`;
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
  const WELCOME_SEEN_KEY = 'dlbc-welcome-seen';
  const queueWelcomeModal = () => {
    if (!welcomeModal || localStorage.getItem(WELCOME_SEEN_KEY)) return;
    setTimeout(() => {
      welcomeModal.classList.add('is-open');
      welcomeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    }, 1200);
  };
  if (welcomeModal) {
    const welcomeModalClose = document.getElementById('welcomeModalClose');
    const welcomeModalDismiss = document.getElementById('welcomeModalDismiss');
    const welcomeModalCta = document.getElementById('welcomeModalCta');

    const closeWelcomeModal = () => {
      welcomeModal.classList.remove('is-open');
      welcomeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

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

  queueWelcomeModal();

  /* ---------- Resources > Devotionals side menu ---------- */
  document.querySelectorAll('.subdropdown-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wrap = btn.closest('.has-subdropdown');
      const open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Gallery: photo list shared by the featured viewer + lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const galleryPhotos = galleryItems.map((item) => ({
    src: item.dataset.src,
    alt: item.dataset.alt || '',
  }));

  /* ---------- Gallery lightbox (with previous / next) ---------- */
  const galleryLightbox = document.getElementById('galleryLightbox');
  let openLightboxAt = null;
  if (galleryLightbox && galleryPhotos.length) {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let lbIndex = 0;

    const showLightbox = (i) => {
      lbIndex = (i + galleryPhotos.length) % galleryPhotos.length;
      const photo = galleryPhotos[lbIndex];
      lightboxImage.classList.remove('is-shown');
      void lightboxImage.offsetWidth;
      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt;
      lightboxImage.classList.add('is-shown');
      if (lightboxCaption) {
        lightboxCaption.textContent = `${photo.alt}  ·  ${lbIndex + 1} / ${galleryPhotos.length}`;
      }
    };
    openLightboxAt = (i) => {
      showLightbox(i);
      galleryLightbox.classList.add('is-open');
      galleryLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      galleryLightbox.classList.remove('is-open');
      galleryLightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, i) =>
      item.addEventListener('click', () => openLightboxAt(i))
    );
    lightboxPrev?.addEventListener('click', () => showLightbox(lbIndex - 1));
    lightboxNext?.addEventListener('click', () => showLightbox(lbIndex + 1));
    lightboxClose?.addEventListener('click', closeLightbox);
    galleryLightbox.addEventListener('click', (e) => {
      if (e.target === galleryLightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!galleryLightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
      else if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
    });
    // Swipe left/right on touch screens
    let touchX = null;
    galleryLightbox.addEventListener('touchstart', (e) => {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    galleryLightbox.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 45) showLightbox(lbIndex + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------- Gallery featured viewer (Picture Gallery page) ---------- */
  const stageImage = document.getElementById('stageImage');
  if (stageImage && galleryPhotos.length) {
    const stageCaption = document.getElementById('stageCaption');
    const stageCount = document.getElementById('stageCount');
    const stageThumbs = document.getElementById('stageThumbs');
    const stagePlay = document.getElementById('stagePlay');
    const stageExpand = document.getElementById('stageExpand');
    let stIndex = 0;
    let stTimer = null;
    let playing = true;

    const thumbBtns = galleryPhotos.map((photo, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'stage-thumb';
      b.setAttribute('aria-label', `Show photo ${i + 1}`);
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = '';
      img.loading = 'lazy';
      b.appendChild(img);
      b.addEventListener('click', () => {
        showStage(i);
        restartStage();
      });
      stageThumbs?.appendChild(b);
      return b;
    });

    const showStage = (i) => {
      stIndex = (i + galleryPhotos.length) % galleryPhotos.length;
      const photo = galleryPhotos[stIndex];
      stageImage.classList.add('is-fading');
      setTimeout(() => {
        stageImage.src = photo.src;
        stageImage.alt = photo.alt;
        stageImage.classList.remove('is-fading');
      }, 260);
      if (stageCaption) stageCaption.textContent = photo.alt;
      if (stageCount) stageCount.textContent = `${stIndex + 1} / ${galleryPhotos.length}`;
      thumbBtns.forEach((b, j) => b.classList.toggle('is-active', j === stIndex));
      // Keep the active thumbnail centred without scrolling the page itself
      const tb = thumbBtns[stIndex];
      if (tb && stageThumbs) {
        stageThumbs.scrollTo({
          left: tb.offsetLeft - stageThumbs.clientWidth / 2 + tb.clientWidth / 2,
          behavior: 'smooth',
        });
      }
    };
    const restartStage = () => {
      clearInterval(stTimer);
      if (playing) stTimer = setInterval(() => showStage(stIndex + 1), 5000);
    };

    document.querySelector('.stage-prev')?.addEventListener('click', () => {
      showStage(stIndex - 1);
      restartStage();
    });
    document.querySelector('.stage-next')?.addEventListener('click', () => {
      showStage(stIndex + 1);
      restartStage();
    });
    stagePlay?.addEventListener('click', () => {
      playing = !playing;
      stagePlay.textContent = playing ? 'Pause' : 'Play';
      stagePlay.setAttribute('aria-pressed', String(playing));
      restartStage();
    });
    stageExpand?.addEventListener('click', () => openLightboxAt?.(stIndex));

    thumbBtns[0]?.classList.add('is-active');
    if (stageCount) stageCount.textContent = `1 / ${galleryPhotos.length}`;
    restartStage();
  }

  /* ---------- Hero background rotator: photo -> video -> photo, cross-fading ---------- */
  const heroLayers = document.querySelectorAll('.hero-rotator .hero-bg-layer');
  if (heroLayers.length > 1) {
    let layerIndex = 0;
    let layerTimer = null;

    const activate = (i) => {
      const prev = heroLayers[layerIndex];
      layerIndex = i % heroLayers.length;
      const layer = heroLayers[layerIndex];
      clearTimeout(layerTimer);

      if (layer.tagName === 'VIDEO') {
        layer.currentTime = 0;
        const playing = layer.play();
        // Move on when the clip ends (or after 30s as a safety net)
        const next = () => activate(layerIndex + 1);
        layer.onended = next;
        layerTimer = setTimeout(next, 30000);
        if (playing && playing.catch) {
          // If the browser blocks autoplay, skip the video
          playing.catch(() => activate(layerIndex + 1));
        }
      } else {
        layerTimer = setTimeout(
          () => activate(layerIndex + 1),
          parseInt(layer.dataset.hold || '7000', 10)
        );
      }

      layer.classList.add('is-active');
      if (prev !== layer) {
        prev.classList.remove('is-active');
        if (prev.tagName === 'VIDEO') {
          prev.onended = null;
          setTimeout(() => prev.pause(), 1600);
        }
      }
    };

    layerTimer = setTimeout(
      () => activate(1),
      parseInt(heroLayers[0].dataset.hold || '7000', 10)
    );
  }

  /* ---------- Upcoming events: hide cards whose end date has passed ---------- */
  const eventCards = document.querySelectorAll('.event-card[data-end]');
  if (eventCards.length) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let shown = 0;
    eventCards.forEach((card) => {
      const [y, m, d] = card.dataset.end.split('-').map(Number);
      if (new Date(y, m - 1, d) < today) card.remove();
      else shown++;
    });
    if (!shown) document.querySelector('.event-cards-empty')?.removeAttribute('hidden');
  }

  /* ---------- Hero slideshow ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroPrev = document.querySelector('.hero-arrow-prev');
  const heroNext = document.querySelector('.hero-arrow-next');
  const heroContent = document.querySelector('.hero-text-inner');
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    let heroStep = 0;
    let isAnimating = false;

    const GATHER_MS = 420; // wind-up: the current slide holds and gathers energy
    const RELEASE_MS = 1500; // outgoing slide's energetic exit
    const ARRIVE_MS = 1700; // incoming slide's slow, soft-landing entrance

    // A few distinct move "personalities" so consecutive transitions don't
    // all feel identical, cycled in order, not random, so it stays coherent.
    const VARIANTS = [
      { enterScale: 1.06, exitScale: 0.95, drift: 0 },
      { enterScale: 1.1, exitScale: 0.92, drift: 0 },
      { enterScale: 1.03, exitScale: 0.97, drift: 3 },
    ];

    const place = (x, y, s) => `translate(${x}%, ${y}%) scale(${s})`;

    heroSlides.forEach((slide, i) => {
      slide.style.transform = place(i === 0 ? 0 : 100, 0, 1);
    });

    // Text gets a small, occasional drift so the hero doesn't feel static;
    // deliberately not on every transition.
    const shiftHeroText = () => {
      if (!heroContent || Math.random() > 0.5) return;
      const dir = Math.random() > 0.5 ? 1 : -1;
      heroContent.style.transition =
        'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
      heroContent.style.transform = `translate(${dir * 5}px, -3px)`;
      setTimeout(() => {
        heroContent.style.transform = 'translate(0, 0)';
      }, 550);
    };

    const showHeroSlide = (targetIndex, direction) => {
      if (isAnimating) return;
      isAnimating = true;

      const outgoing = heroSlides[heroIndex];
      heroIndex = (targetIndex + heroSlides.length) % heroSlides.length;
      const incoming = heroSlides[heroIndex];
      const variant = VARIANTS[heroStep % VARIANTS.length];
      heroStep++;

      // Position incoming off-screen instantly, no transition.
      incoming.style.transition = 'none';
      incoming.style.transform = place(direction * 100, 0, variant.enterScale);
      incoming.classList.add('is-active');
      // Force reflow so the transition-less position above is committed
      // before re-enabling the transition, or the browser will animate it.
      void incoming.offsetWidth;

      // Phase 1, gather energy: the outgoing slide takes a subtle inward
      // breath and dims slightly, as if winding up before it launches.
      outgoing.style.transition = `transform ${GATHER_MS}ms cubic-bezier(0.45, 0, 0.55, 1), filter ${GATHER_MS}ms ease`;
      outgoing.style.transform = place(0, 0, 0.985);
      outgoing.style.filter = 'saturate(1.08) contrast(1.1) brightness(0.92)';

      shiftHeroText();

      setTimeout(() => {
        // Phase 2, release: outgoing accelerates away quickly, while
        // incoming eases in slowly and settles with a soft landing.
        outgoing.style.transition = `transform ${RELEASE_MS}ms cubic-bezier(0.7, 0, 0.84, 0), filter ${RELEASE_MS}ms ease`;
        outgoing.style.transform = place(
          -direction * (100 + variant.drift),
          variant.drift ? -variant.drift : 0,
          variant.exitScale
        );
        outgoing.style.filter = 'saturate(1.08) contrast(1.1) brightness(1)';

        incoming.style.transition = `transform ${ARRIVE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        incoming.style.transform = place(0, 0, 1);

        incoming.addEventListener(
          'transitionend',
          () => {
            outgoing.classList.remove('is-active');
            outgoing.style.transition = 'none';
            outgoing.style.transform = place(100, 0, 1);
            outgoing.style.filter = '';
            void outgoing.offsetWidth;
            outgoing.style.transition = '';
            isAnimating = false;
          },
          { once: true }
        );
      }, GATHER_MS);
    };
    let heroTimer = setInterval(() => showHeroSlide(heroIndex + 1, 1), 7000);
    const resetHeroTimer = () => {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => showHeroSlide(heroIndex + 1, 1), 7000);
    };
    heroPrev?.addEventListener('click', () => {
      showHeroSlide(heroIndex - 1, -1);
      resetHeroTimer();
    });
    heroNext?.addEventListener('click', () => {
      showHeroSlide(heroIndex + 1, 1);
      resetHeroTimer();
    });
  }

  /* ---------- Animated stat count-up (GCK page) ---------- */
  const countEls = document.querySelectorAll('[data-count-to]');
  if ('IntersectionObserver' in window && countEls.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.countTo);
      const decimals = parseInt(el.dataset.countDecimals || '0', 10);
      const suffix = el.dataset.countSuffix || '';
      const format = (n) =>
        n.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) + suffix;

      // Lock in the final width up front so the changing digit count
      // doesn't reflow/jitter the surrounding layout mid-animation.
      el.textContent = format(target);
      el.style.minWidth = `${el.offsetWidth}px`;

      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        el.textContent = format(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    countEls.forEach((el) => countObserver.observe(el));
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
