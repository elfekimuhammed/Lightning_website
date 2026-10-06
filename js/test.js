// Test page (test.html, UX-2026.10.06.03): the six places pour into one figure.
// Each money tile, as it scrolls up to the sticky "In your accounts" card, shrinks into it and its amount
// is added; scrolling back takes it out again. GSAP + ScrollTrigger, hosted here in js/vendor/.
// It plays even with reduce motion on, so the owner can judge it; decide that rule before it goes live.
(() => {
  const {gsap, ScrollTrigger} = window;
  const stage = document.querySelector('.t-stage');
  if (!gsap || !ScrollTrigger || !stage) return;
  gsap.registerPlugin(ScrollTrigger);
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

  // tiles side by side pour in left to right, one after another
  const shift = el => 80 * tiles.filter(t => t.el.offsetTop === el.offsetTop && t.el.offsetLeft < el.offsetLeft).length;
  tiles.forEach(t => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: t.el, scrub: .5, invalidateOnRefresh: true,
        start: () => `top ${land() + 220 - shift(t.el)}px`, end: () => `top ${land() - shift(t.el)}px`,
      },
      onUpdate() { t.p = this.progress(); paint(); },
    });
    tl.to(t.el, {
      x: () => counter.offsetLeft + counter.offsetWidth / 2 - (t.el.offsetLeft + t.el.offsetWidth / 2),
      y: -50, scale: .3, ease: 'power1.in', transformOrigin: '50% 0',
    }, 0).to(t.el, {opacity: 0, ease: 'power3.in'}, 0);
  });
  paint();
})();
