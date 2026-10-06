// Motion (UX-2026.10.06.02): money figures count up to their real value, the calculator answer rolls
// to each new value, and sections rise in as they scroll into view. Styles in css/motion.css.
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
  const margin = {rootMargin: '0px 0px -12% 0px'};
  const once = (els, act) => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { observer.unobserve(entry.target); act(entry.target); }
    }), margin);
    els.forEach(el => observer.observe(el));
  };

  // ---- sections rise in: header first, then the one visual ----
  const parts = [...document.querySelectorAll('main .d-section > *:not([data-mo-skip])')].filter(later);
  parts.forEach(el => el.classList.add('mo-wait'));
  once(parts, el => el.classList.replace('mo-wait', 'mo-in'));

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
