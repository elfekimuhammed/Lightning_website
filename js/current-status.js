(() => {
  const form = document.getElementById('app-feedback-form');
  const template = document.getElementById('ticket-template');
  const list = document.querySelector('[data-ticket-list]');
  const add = document.querySelector('[data-add-ticket]');
  const status = document.querySelector('.status-feedback__status');
  const endpoint = document.body.dataset.appFeedbackEndpoint;
  if (!form || !template || !list || !add || !endpoint) return;

  const experiences = {
    'index.html': 'UX-2026.10.01.06',
    'version-b.html': 'UX-2026.09.30.05',
    'version-c.html': 'UX-2026.09.30.03'
  };
  let sourcePage = 'index.html';
  try { sourcePage = sessionStorage.getItem('lightning-home') || sourcePage; } catch (_) {}
  const sessionKey = 'lightning-app-feedback-session';
  let sessionId = '';
  try { sessionId = sessionStorage.getItem(sessionKey) || ''; if (!sessionId) { sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`; sessionStorage.setItem(sessionKey, sessionId); } } catch (_) { sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`; }

  function addTicket() {
    const node = template.content.firstElementChild.cloneNode(true);
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    node.querySelectorAll('[name="type"]').forEach(input => { input.name = `type-${id}`; });
    node.querySelectorAll('[name="area"]').forEach(input => { input.name = `area-${id}`; });
    list.append(node);
    numberTickets();
  }
  function numberTickets() {
    [...list.children].forEach((ticket, index) => {
      ticket.querySelector('[data-ticket-number]').textContent = index + 1;
      ticket.querySelector('[data-remove-ticket]').hidden = list.children.length === 1;
    });
  }
  function readTickets() {
    return [...list.children].map(ticket => ({
      section: ticket.querySelector('[name="section"]').value,
      type: ticket.querySelector('input[name^="type-"]:checked')?.value || '',
      area: ticket.querySelector('input[name^="area-"]:checked')?.value || '',
      description: ticket.querySelector('[name="description"]').value.trim()
    }));
  }
  add.addEventListener('click', addTicket);
  list.addEventListener('click', event => { if (event.target.closest('[data-remove-ticket]')) { event.target.closest('.status-ticket').remove(); numberTickets(); } });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const submit = form.querySelector('[type="submit"]');
    const payload = new URLSearchParams({
      form_type: 'app_feedback',
      experience_version: experiences[sourcePage] || experiences['index.html'],
      source_page: sourcePage,
      app_build: new FormData(form).get('app_build'),
      reporter_name: new FormData(form).get('reporter_name')?.trim() || '',
      reporter_email: new FormData(form).get('reporter_email')?.trim() || '',
      page_url: location.href,
      session_id: sessionId,
      device: matchMedia('(max-width: 760px)').matches ? 'mobile' : 'desktop',
      tickets_json: JSON.stringify(readTickets())
    });
    submit.disabled = true; status.textContent = 'Sending your ticket…';
    try {
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', body: payload });
      form.reset(); list.replaceChildren(); addTicket(); status.textContent = 'Thank you — your feedback has been saved.';
    } catch (_) { status.textContent = 'We could not save that just now. Please try again.'; }
    finally { submit.disabled = false; }
  });
  addTicket();
})();
