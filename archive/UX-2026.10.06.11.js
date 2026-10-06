// Motion (UX-2026.10.06.07): money figures count up to their real value, the calculator answer rolls
// to each new value, sections rise in as they scroll into view and lists arrive item by item. Styles in css/motion.css.
// Every figure ends on the exact text the page was written with. The counts always play (they change
// numbers, not places); css/motion.css turns the big movement off when the visitor asks for less motion.
(() => {
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
    setTimeout(() => el.classList.remove('mo-in'), 1600); // every arrival is over by then
  });

  // ---- money figures count up from zero as they come into view, also in a newly chosen tab ----
  const figs = [...document.querySelectorAll('main .kpi .fig, main .lead-fig')].filter(el => {
    if (el.closest('[data-mo-skip]')) return false;
    const node = el.firstChild;
    return node && node.nodeType === Node.TEXT_NODE && parse(node.textContent) && (later(el) || !el.offsetParent);
  });
  once(figs, el => {
    const node = el.firstChild;
    roll(text => { node.textContent = text; }, 0, node.textContent, 900);
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
      stop = roll(write, from.value, next, 450, quiet);
    });
    watch.observe(capital, {childList: true, characterData: true, subtree: true});
  }
})();
