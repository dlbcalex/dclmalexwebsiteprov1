/* ============================================================
   Deeper Life Bible Church — Alexandria, VA
   main.js — mobile nav, scroll reveal, small UX niceties
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
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

  /* ---------- Hero slideshow ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    setInterval(() => {
      heroSlides[heroIndex].classList.remove('is-active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('is-active');
    }, 6000);
  }

  /* ---------- Events calendar ---------- */
  const EVENTS = [
    { start: '2026-07-06', end: '2026-07-12', title: 'Regional Youth Fest', location: 'Kinston, NC', tag: 'Regional' },
    { start: '2026-07-09', end: '2026-07-12', title: 'Annual Regional Convention', location: 'Kinston, NC', tag: 'Regional' },
    { start: '2026-09-04', end: '2026-09-06', title: "Regional Women's Conference", location: 'Kinston, NC', tag: 'Regional' },
    { start: '2026-10-01', end: '2026-10-04', title: "Regional Men's Conference", location: 'Kinston, NC', tag: 'Regional' },
    { start: '2026-10-18', end: '2026-10-18', title: 'Good Neighbor Sunday', location: 'Special event, on location', tag: 'Alexandria' },
    { start: '2026-10-22', end: '2026-10-25', title: "Regional Seniors' Retreat", location: 'Kinston, NC', tag: 'Regional' },
    { start: '2026-11-26', end: '2026-11-26', title: 'Special Thanksgiving Service', location: 'On location', tag: 'Alexandria' },
    { start: '2026-12-24', end: '2026-12-29', title: 'December Retreat', location: 'On location', tag: 'Alexandria' },
    { start: '2026-12-31', end: '2026-12-31', title: "New Year's Eve Service", location: 'Deeper Life Washington, D.C.', tag: 'Alexandria' },
  ];

  const calGrid = document.getElementById('calGrid');
  const calMonthLabel = document.getElementById('calMonthLabel');
  const calEventsList = document.getElementById('calEventsList');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');

  if (calGrid && calMonthLabel && calEventsList && calPrev && calNext) {
    const MONTH_NAMES = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    let viewYear = 2026;
    let viewMonth = 7; // August (0-indexed), calendar opens here

    const MIN_INDEX = 2026 * 12 + 0; // Jan 2026
    const MAX_INDEX = 2026 * 12 + 11; // Dec 2026

    const parseDate = (s) => {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    const eventsInMonth = (y, m) => {
      const monthStart = new Date(y, m, 1);
      const monthEnd = new Date(y, m + 1, 0);
      return EVENTS.filter(
        (ev) => parseDate(ev.start) <= monthEnd && parseDate(ev.end) >= monthStart
      );
    };

    const formatRange = (ev) => {
      const s = parseDate(ev.start);
      const e = parseDate(ev.end);
      const sMonth = MONTH_NAMES[s.getMonth()].slice(0, 3);
      if (ev.start === ev.end) return `${sMonth} ${s.getDate()}`;
      if (s.getMonth() === e.getMonth()) return `${sMonth} ${s.getDate()}–${e.getDate()}`;
      const eMonth = MONTH_NAMES[e.getMonth()].slice(0, 3);
      return `${sMonth} ${s.getDate()} – ${eMonth} ${e.getDate()}`;
    };

    const renderCalendar = () => {
      calMonthLabel.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
      calGrid.innerHTML = '';

      WEEKDAYS.forEach((label) => {
        const el = document.createElement('div');
        el.className = 'cal-weekday';
        el.textContent = label;
        calGrid.appendChild(el);
      });

      const firstDay = new Date(viewYear, viewMonth, 1).getDay();
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const monthEvents = eventsInMonth(viewYear, viewMonth);

      for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day is-empty';
        calGrid.appendChild(el);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(viewYear, viewMonth, day);
        const dayEvents = monthEvents.filter(
          (ev) => parseDate(ev.start) <= cellDate && parseDate(ev.end) >= cellDate
        );

        const el = document.createElement('div');
        el.textContent = day;
        el.className = 'cal-day' + (dayEvents.length ? ' has-event' : '');

        if (dayEvents.length) {
          el.setAttribute('role', 'button');
          el.setAttribute('tabindex', '0');
          el.setAttribute(
            'aria-label',
            `${MONTH_NAMES[viewMonth]} ${day}: ${dayEvents.map((e) => e.title).join(', ')}`
          );
          const jumpToEvent = () => {
            const target = calEventsList.querySelector(
              `[data-event="${dayEvents[0].title}"]`
            );
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              target.classList.add('is-highlighted');
              setTimeout(() => target.classList.remove('is-highlighted'), 1200);
            }
          };
          el.addEventListener('click', jumpToEvent);
          el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              jumpToEvent();
            }
          });
        }

        calGrid.appendChild(el);
      }

      calEventsList.innerHTML = '';
      if (!monthEvents.length) {
        const empty = document.createElement('p');
        empty.className = 'calendar-empty';
        empty.textContent = 'No events scheduled this month.';
        calEventsList.appendChild(empty);
      } else {
        monthEvents.forEach((ev) => {
          const row = document.createElement('div');
          row.className = 'event-row';
          row.setAttribute('data-event', ev.title);
          row.innerHTML = `
            <span class="event-date">${formatRange(ev)}</span>
            <div class="event-main">
              <h4>${ev.title}</h4>
              <span>${ev.location}</span>
            </div>
            <span class="event-tag">${ev.tag}</span>
          `;
          calEventsList.appendChild(row);
        });
      }

      calPrev.disabled = viewYear * 12 + viewMonth <= MIN_INDEX;
      calNext.disabled = viewYear * 12 + viewMonth >= MAX_INDEX;
    };

    calPrev.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      renderCalendar();
    });

    calNext.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      renderCalendar();
    });

    renderCalendar();
  }
});
