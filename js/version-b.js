// Lightning Version B: the small-change calculator, with a visible, adjustable return rate.
(() => {
  const amount = document.getElementById('b-amount');
  if (!amount) return;
  const format = new Intl.NumberFormat('en-EG', {maximumFractionDigits: 0});
  const egp = value => `${format.format(value)} EGP`;
  const amountButtons = [...document.querySelectorAll('[data-b-amount]')];
  const rateButtons = [...document.querySelectorAll('[data-b-rate]')];
  const out = {
    monthly: document.querySelectorAll('[data-out="monthly"]'),
    rate: document.querySelectorAll('[data-out="rate"]'),
    capital: document.getElementById('b-capital'),
    capitalText: document.querySelectorAll('[data-out="capital"]'),
    year: document.getElementById('b-year'),
    ten: document.getElementById('b-ten'),
  };
  let rate = 20;

  function update() {
    const digits = amount.value.replace(/[^0-9]/g, '').slice(0, 9);
    amountButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.bAmount === digits)));
    rateButtons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.bRate) === rate)));
    out.rate.forEach(el => { el.textContent = `${rate}%`; });
    if (!digits) {
      amount.value = '';
      [out.capital, out.year, out.ten].forEach(el => { el.textContent = '—'; });
      out.monthly.forEach(el => { el.textContent = '—'; });
      out.capitalText.forEach(el => { el.textContent = '—'; });
      return;
    }
    const monthly = Number(digits);
    const r = rate / 100;
    const capital = monthly * 12 / r;
    const m = r / 12;
    const tenYears = monthly * (Math.pow(1 + m, 120) - 1) / m;
    amount.value = format.format(monthly);
    out.monthly.forEach(el => { el.textContent = egp(monthly); });
    out.capital.textContent = format.format(capital);
    out.capitalText.forEach(el => { el.textContent = egp(capital); });
    out.year.textContent = egp(monthly * 12);
    out.ten.textContent = egp(Math.round(tenYears));
  }

  amount.addEventListener('input', update);
  amountButtons.forEach(b => b.addEventListener('click', () => { amount.value = b.dataset.bAmount; update(); amount.focus(); }));
  rateButtons.forEach(b => b.addEventListener('click', () => { rate = Number(b.dataset.bRate); update(); }));
  update();

  // Remember that the visitor came from Version B, so How It Works links back here.
  try { sessionStorage.setItem('lightning-home', 'version-b.html'); } catch (_) {}
})();
