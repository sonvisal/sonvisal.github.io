(function () {
  var KEY = 'theme';
  var THEMES = [
    ['forest', 'Forest', '#2d5a27', '#f8f9fa'],
    ['ocean', 'Ocean', '#1d4ed8', '#f6f9fd'],
    ['violet', 'Violet', '#6d28d9', '#faf8fd'],
    ['sunset', 'Sunset', '#c2410c', '#fdf9f5'],
    ['dark', 'Dark', '#4ab156', '#0f1419']
  ];
  var root = document.documentElement;
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function valid(t) { return THEMES.some(function (x) { return x[0] === t; }); }
  function apply(t) {
    if (t === 'forest') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
    var th = THEMES.filter(function (x) { return x[0] === t; })[0];
    var m = document.querySelector('meta[name=theme-color]'); if (m && th) m.setAttribute('content', th[3]);
    var cs = document.querySelector('meta[name=color-scheme]'); if (cs) cs.setAttribute('content', t === 'dark' ? 'dark' : 'light');
    document.querySelectorAll('.tp-sw').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.t === t)); });
  }
  var initial = saved();
  if (!valid(initial)) initial = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'forest';
  apply(initial);

  function build() {
    var w = document.createElement('div'); w.className = 'tp';
    var btn = document.createElement('button'); btn.className = 'tp-btn'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Change color theme'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/></svg>';
    var menu = document.createElement('div'); menu.className = 'tp-menu'; menu.setAttribute('role', 'group'); menu.setAttribute('aria-label', 'Color theme');
    THEMES.forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tp-sw'; b.dataset.t = t[0];
      b.title = t[1]; b.setAttribute('aria-label', t[1] + ' theme');
      b.style.background = 'linear-gradient(135deg,' + t[2] + ' 50%,' + t[3] + ' 50%)';
      b.style.boxShadow = 'inset 0 0 0 1px rgba(128,128,128,.5)';
      b.addEventListener('click', function () { try { localStorage.setItem(KEY, t[0]); } catch (e) {} apply(t[0]); });
      menu.appendChild(b);
    });
    function toggle(o) { w.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o)); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(!w.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!w.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
    w.appendChild(menu); w.appendChild(btn); document.body.appendChild(w);
    apply(initial);
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
