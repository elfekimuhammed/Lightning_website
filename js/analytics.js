// Lightning analytics (GoatCounter): page views, which give unique visitors, and one event per download.
// App downloads are named from the link itself, e.g. "download-app-v0.5.0-beta.1-windows", so a new build
// is counted as soon as its link is on a page. GoatCounter ignores localhost, so local previews are not counted.
(() => {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = 'https://mohamedelfeki.goatcounter.com/count';
  document.head.append(script);

  const platform = url => ['windows', 'mac', 'linux'].find(p => url.toLowerCase().includes(p)) || 'other';
  const eventFor = url => {
    const app = url.match(/Lightning-downloads\/.*?(v\d+\.\d+\.\d+(?:-[a-z]+\.\d+)?)/i);
    if (app && /\.(zip|exe|msi|dmg|appimage)(\?|#|$)/i.test(url)) return `download-app-${app[1]}-${platform(url)}`;
    const sample = url.match(/assets\/samples\/([^/?#]+)\.zip/);
    if (sample) return `download-sample-${sample[1]}`;
    return null;
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    const name = link && eventFor(link.href);
    if (!name || !window.goatcounter || !window.goatcounter.count) return;
    window.goatcounter.count({path: name, title: link.textContent.trim() || name, event: true});
  });
})();
