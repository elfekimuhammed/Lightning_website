// Lightning testing panel: page-version switch and the UX test button, in one fold-out on the right edge.
// Load with `defer` BEFORE js/ux-test.js, so the UX button exists when that script wires it up.
(() => {
  const VERSIONS = [['A', 'index.html'], ['B', 'version-b.html'], ['C', 'version-c.html']];
  const page = location.pathname.split('/').pop() || 'index.html';
  const landing = VERSIONS.some(([, href]) => href === page);
  let home = landing ? page : 'index.html';
  try {
    if (landing) sessionStorage.setItem('lightning-home', page);
    else home = sessionStorage.getItem('lightning-home') || home;
  } catch (_) {}

  // Pages that aren't a version (How It Works) send "Home" back to the version the visitor came from.
  document.querySelectorAll('[data-home-link]').forEach(link => { link.href = home; });

  const dock = document.createElement('div');
  dock.className = 'dev-dock';
  const hasUx = Boolean(document.body.dataset.uxEndpoint);
  dock.innerHTML = `
    <button class="dev-dock__tab" type="button" aria-expanded="false" aria-controls="dev-dock-panel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>
      <span>Testing</span>
    </button>
    <div class="dev-dock__panel" id="dev-dock-panel" role="dialog" aria-label="Testing tools" hidden>
      <div class="dev-dock__head"><p class="dev-dock__title">Testing tools</p><button class="dev-dock__close" type="button" aria-label="Close testing tools">×</button></div>
      <p class="dev-dock__label">Page version</p>
      <nav class="dev-dock__versions" aria-label="Landing page version">${VERSIONS.map(([label, href]) =>
        `<a href="${href}"${href === home ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
      ${hasUx ? '<p class="dev-dock__label">Feedback</p><button class="dev-dock__ux" type="button" data-ux-open>Submit UX Test <span data-ux-count>0</span></button>' : ''}
    </div>`;
  document.body.append(dock);

  const tab = dock.querySelector('.dev-dock__tab');
  const panel = dock.querySelector('.dev-dock__panel');
  const setOpen = open => { panel.hidden = !open; tab.setAttribute('aria-expanded', String(open)); };
  tab.addEventListener('click', () => setOpen(panel.hidden));
  dock.querySelector('.dev-dock__close').addEventListener('click', () => { setOpen(false); tab.focus(); });
  dock.querySelector('[data-ux-open]')?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) { setOpen(false); tab.focus(); } });
  document.addEventListener('click', event => { if (!panel.hidden && !dock.contains(event.target)) setOpen(false); });
})();
