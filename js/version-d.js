// Lightning Version D: calculator, product tour, screenshot lightbox and email signup.
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
    img.src = zoom.dataset.zoom;
    img.alt = zoom.querySelector('img')?.alt || '';
    lightbox.querySelector('p').textContent = zoom.dataset.caption || '';
    lightbox.showModal();
  });
  if (lightbox) {
    lightbox.querySelector('[data-close]').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  }

  // ---- email signup (same receiver as Versions A, B and C) ----
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
