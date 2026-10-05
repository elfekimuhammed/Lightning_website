// Beta testers wanted (guideline 3.18): the strip stays until the visitor closes it, then stays closed on this browser.
(() => {
  const bar = document.querySelector('[data-beta-bar]');
  if (!bar) return;
  const KEY = 'lightning-beta-bar-1';
  try { if (localStorage.getItem(KEY) === 'closed') { bar.hidden = true; return; } } catch (_) {}
  bar.querySelector('button')?.addEventListener('click', () => {
    bar.hidden = true;
    try { localStorage.setItem(KEY, 'closed'); } catch (_) {}
  });
})();
