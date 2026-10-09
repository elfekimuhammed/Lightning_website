// snapshot: js/motion.js
// Motion (UX-2026.10.06.20): money figures count up to their real value, the calculator answer rolls
// to each new value, sections rise in as they scroll into view and lists arrive item by item. Styles in css/motion.css.
// Every figure ends on the exact text the page was written with. The counts always play (they change
// numbers, not places); css/motion.css turns the big movement off when the visitor asks for less motion.
(() => {
  // Search and AI crawlers read the page as written: no counting from zero, nothing hidden, no library.
  if (/bot|crawl|spider|slurp|inspectiontool|bingpreview|facebookexternalhit/i.test(navigator.userAgent)) return;
  if (!('IntersectionObserver' in window)) return;
  const format = new Intl.NumberFormat('en-EG', {maximumFractionDigits: 0});
  const ease = t => 1 - Math.pow(1 - t, 3);
  const parse = text => {
    const m = /^([+−-]?)([\d,]+)$/.exec(text.trim());
    return m && {sign: m[1], value: Number(m[2].replace(/,/g, ''))};
  };
  // Count from `from` to the number in `final` through write(), then write `final` exactly.
  const roll = (write, from, final, ms, done = () => {}) => {
    const target = parse(final);
    let start = 0, frame = 0;
    const step = now => {
      start ||= now;
      const t = Math.min(1, (now - start) / ms);
      if (t < 1) {
        write(target.sign + format.format(Math.round(from + (target.value - from) * ease(t))));
        frame = requestAnimationFrame(step);
      } else { write(final); done(); }
    };
    write(target.sign + format.format(from));
    frame = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(frame); done(); };
  };
  // Only what is fully below the screen when the page loads moves, so nothing already seen flickers.
  const later = el => el.getBoundingClientRect().top > innerHeight;
  // In view once its top is above the bottom eighth of the screen, or once it is wholly on screen
  // (the last parts of a page may never scroll higher than that).
  const steps = {threshold: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1]};
  const once = (els, act) => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (entry.intersectionRatio > .99 || entry.boundingClientRect.top < innerHeight * .88) { observer.unobserve(entry.target); act(entry.target); }
    }), steps);
    els.forEach(el => observer.observe(el));
  };

  // ---- sections rise in, header first; lists in them (tiles, lines, steps, cards) arrive item by item ----
  const LISTS = '.d-tiles, .rows, .c-steps, .l-ahead, .f-list, .hw-time, .status-checklist ul, .status-checklist ol';
  const isList = el => el.matches(LISTS) || [...el.children].filter(c => c.classList.contains('card')).length > 1;
  const parts = [...document.querySelectorAll('main > section > *:not([data-mo-skip])')].filter(later);
  parts.forEach(part => {
    part.classList.add('mo-wait');
    [part, ...part.querySelectorAll('*')].filter(isList).forEach(list => {
      list.classList.add('mo-list');
      [...list.children].forEach((item, i) => item.style.setProperty('--mo-i', Math.min(i, 8)));
    });
  });
  once(parts, el => {
    el.classList.replace('mo-wait', 'mo-in');
    setTimeout(() => el.classList.remove('mo-in'), 2800); // every arrival is over by then
  });

  // ---- money figures count up from zero as they come into view, also in a newly chosen tab ----
  const figs = [...document.querySelectorAll('main .kpi .fig, main .lead-fig')].filter(el => {
    if (el.closest('[data-mo-skip]')) return false;
    const node = el.firstChild;
    return node && node.nodeType === Node.TEXT_NODE && parse(node.textContent) && (later(el) || !el.offsetParent);
  });
  once(figs, el => {
    const node = el.firstChild;
    roll(text => { node.textContent = text; }, 0, node.textContent, 1400);
  });

  // ---- calculator (B08): the answer rolls from its last value to the new one ----
  const capital = document.querySelector('[data-d-out="capital"]');
  if (capital) {
    const live = capital.closest('[aria-live]');
    let shown = capital.textContent, stop = () => {};
    const write = text => { capital.textContent = text; shown = text; watch.takeRecords(); };
    const quiet = () => live && live.removeAttribute('aria-busy');
    const watch = new MutationObserver(() => {
      const next = capital.textContent, from = parse(shown), to = parse(next);
      stop(); stop = () => {};
      if (!from || !to || from.value === to.value) { shown = next; return; }
      live && live.setAttribute('aria-busy', 'true'); // screen readers hear only the final figure
      stop = roll(write, from.value, next, 600, quiet);
    });
    watch.observe(capital, {childList: true, characterData: true, subtree: true});
  }
})();

// snapshot: js/wow.js
// The wow moment (home UX-2026.10.06.05, test.html): the six places pour into one figure.
// Each money tile, as it scrolls up to the sticky "In your accounts" card, shrinks into it and its amount
// is added; scrolling back takes it out again. GSAP + ScrollTrigger, hosted here in js/vendor/ and fetched
// only once the page has loaded. <body data-wow-always> (the home page, owner's choice 2026-10-06, and
// test.html) plays it even with reduce motion on; any other page skips it then and downloads nothing.
// Without it, the card shows the total and the tiles stay still.
(() => {
  const stage = document.querySelector('.t-stage');
  // Search and AI crawlers read the page as written: no counting from zero, nothing hidden, no library.
  if (/bot|crawl|spider|slurp|inspectiontool|bingpreview|facebookexternalhit/i.test(navigator.userAgent)) return;
  if (!stage || (matchMedia('(prefers-reduced-motion: reduce)').matches && !('wowAlways' in document.body.dataset))) return;
  const load = src => new Promise((ok, fail) => {
    const script = Object.assign(document.createElement('script'), {src, onload: ok, onerror: fail});
    document.head.append(script);
  });
  const start = () => load('js/vendor/gsap.min.js?v=3.15.0')
    .then(() => load('js/vendor/ScrollTrigger.min.js?v=3.15.0')).then(play, () => {});
  if (document.readyState === 'complete') start(); else addEventListener('load', start, {once: true});

  function play() {
  const {gsap, ScrollTrigger} = window;
  gsap.registerPlugin(ScrollTrigger);
  stage.classList.add('is-live');
  const counter = stage.querySelector('.t-count');
  const sumEl = counter.querySelector('[data-t-sum]'), line = counter.querySelector('[data-t-line]');
  const bar = document.querySelector('.d-bar');
  const format = new Intl.NumberFormat('en-EG', {maximumFractionDigits: 0});
  const tiles = [...stage.querySelectorAll('.kpi')].map(el => ({
    el, p: 0,
    name: el.querySelector('.lbl').textContent,
    value: Number(el.querySelector('.fig').firstChild.textContent.replace(/[^0-9]/g, '')),
  }));
  const top = () => (bar ? bar.offsetHeight : 0) + 10;
  const land = () => top() + counter.offsetHeight; // the counter's lower edge once it sticks
  const setTop = () => stage.style.setProperty('--t-top', `${top()}px`);
  setTop();
  ScrollTrigger.addEventListener('refreshInit', setTop);

  let landed = -1;
  const paint = () => {
    sumEl.textContent = format.format(Math.round(tiles.reduce((sum, t) => sum + t.value * t.p, 0)));
    const done = tiles.filter(t => t.p >= 1);
    if (done.length === landed) return;
    const last = done[done.length - 1];
    line.textContent = !last ? 'The six places, in EGP'
      : done.length === tiles.length ? 'All six places, counted as one'
      : `+${format.format(last.value)} · ${last.name}`;
    if (done.length > landed && landed >= 0) gsap.fromTo(counter, {scale: 1.03}, {scale: 1, duration: .4, ease: 'back.out(3)'});
    landed = done.length;
  };

  // Paced so the eye can follow: each tile takes 420px of scroll to fly in, the figure trails the scroll
  // by about a second, and tiles side by side go one after another, left to right, 160px of scroll apart.
  const DISTANCE = 420, APART = 160;
  const row = el => tiles.filter(t => t.el.offsetTop === el.offsetTop);
  const lead = el => APART * row(el).filter(t => t.el.offsetLeft > el.offsetLeft).length; // left goes first
  tiles.forEach(t => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: t.el, scrub: 1.2, invalidateOnRefresh: true,
        start: () => `top ${land() + lead(t.el) + DISTANCE}px`, end: () => `top ${land() + lead(t.el)}px`,
      },
      onUpdate() { t.p = this.progress(); paint(); },
    });
    tl.to(t.el, {
      x: () => counter.offsetLeft + counter.offsetWidth / 2 - (t.el.offsetLeft + t.el.offsetWidth / 2),
      y: () => -(lead(t.el) + 50), scale: .3, ease: 'power1.in', transformOrigin: '50% 0',
    }, 0).to(t.el, {opacity: 0, ease: 'power3.in'}, 0);
  });
  paint();
  }
})();

// snapshot: js/landing.js
// Lightning landing pages A and B: calculator, product tour, screenshot lightbox and email signup.
(() => {
  const format = new Intl.NumberFormat('en-EG', {maximumFractionDigits: 0});

  // ---- calculator (B08): starts at 2,000 EGP, all figures update together ----
  const amount = document.getElementById('d-amount');
  if (amount) {
    const amountButtons = [...document.querySelectorAll('[data-d-amount]')];
    const rateButtons = [...document.querySelectorAll('[data-d-rate]')];
    const out = name => [...document.querySelectorAll(`[data-d-out="${name}"]`)];
    let rate = 20;
    const set = (name, text) => out(name).forEach(el => { el.textContent = text; });
    const update = () => {
      const digits = amount.value.replace(/[^0-9]/g, '').slice(0, 9);
      amountButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.dAmount === digits)));
      rateButtons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.dRate) === rate)));
      set('rate', `${rate}%`);
      if (!digits) {
        amount.value = '';
        ['capital', 'monthly', 'year', 'ten'].forEach(name => set(name, '—'));
        return;
      }
      const monthly = Number(digits);
      const r = rate / 100, m = r / 12;
      amount.value = format.format(monthly);
      set('monthly', format.format(monthly));
      set('capital', format.format(monthly * 12 / r));
      set('year', format.format(monthly * 12));
      set('ten', format.format(Math.round(monthly * (Math.pow(1 + m, 120) - 1) / m)));
    };
    amount.addEventListener('input', update);
    amountButtons.forEach(b => b.addEventListener('click', () => { amount.value = b.dataset.dAmount; update(); }));
    rateButtons.forEach(b => b.addEventListener('click', () => { rate = Number(b.dataset.dRate); update(); }));
    update();
  }

  // ---- product tour: one pill bar, arrow keys move between tabs ----
  const tabs = [...document.querySelectorAll('.d-tabs [role="tab"]')];
  const select = tab => tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const next = tabs[(i + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next); next.focus();
    });
  });

  // ---- lightbox ----
  const lightbox = document.getElementById('lightbox');
  document.addEventListener('click', event => {
    const zoom = event.target.closest('[data-zoom]');
    if (!zoom) return;
    if (!lightbox || typeof lightbox.showModal !== 'function') { window.open(zoom.dataset.zoom, '_blank'); return; }
    const img = lightbox.querySelector('img');
    img.removeAttribute('src');
    img.src = zoom.dataset.zoom;
    img.alt = zoom.querySelector('img')?.alt || '';
    lightbox.querySelector('p').textContent = zoom.dataset.caption || '';
    lightbox.showModal();
  });
  if (lightbox) {
    lightbox.querySelector('[data-close]').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  }

  // ---- email signup (same receiver as every page) ----
  const signup = document.getElementById('email-signup');
  if (signup) {
    const status = document.getElementById('signup-status');
    signup.addEventListener('submit', async event => {
      event.preventDefault();
      if (!signup.reportValidity()) return;
      const button = signup.querySelector('button[type="submit"]');
      button.disabled = true; status.classList.remove('is-error'); status.textContent = 'Sending…';
      try {
        signup.querySelector('[name="page_url"]').value = window.location.href;
        await fetch(signup.dataset.endpoint, {method: 'POST', mode: 'no-cors', body: new URLSearchParams(new FormData(signup))});
        signup.reset(); status.textContent = 'You’re on the list. We’ll be in touch.';
      } catch (_) {
        status.classList.add('is-error'); status.textContent = 'We could not save your email. Please try again.';
      } finally { button.disabled = false; }
    });
  }
})();
