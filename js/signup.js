// The signup band's email form, for pages whose main script doesn't already handle it (guideline 3.20).
(() => {
  const signup = document.getElementById('email-signup');
  if (!signup || signup.dataset.bound) return;
  signup.dataset.bound = '1';
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
})();
