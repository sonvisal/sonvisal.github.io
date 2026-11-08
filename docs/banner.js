/* Animated text banner. Fills the #hero-banner placeholder rendered by the React bundle
   with the skills row, portrait and the business-to-technology workflow as real text. */
(function () {
  var ICON = {
    container: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10 11V9.5a2 2 0 0 1 4 0V11"/>',
    db: '<ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    pay: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/>',
    search: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5"/><path d="M14 3l5 5h-5zM8 9h4M8 13h3"/><circle cx="16.5" cy="16.5" r="3"/><path d="M18.7 18.7L21 21"/>',
    rules: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    people: '<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M6 20a6 6 0 0 1 12 0M1.5 18a4 4 0 0 1 5-3.5M22.5 18a4 4 0 0 0-5-3.5"/>',
    code: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 9l-3 3 3 3M14 9l3 3-3 3"/>',
    shieldok: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8.5 11l2 2 3.5-4M8.5 17h7"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
    filecheck: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 15l2 2 4-4"/>',
    upload: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 18 18"/><path d="M12 12v9M9 15l3-3 3 3"/>'
  };

  var SKILLS = [
    ['container', 'Docker', 'Containerization & Orchestration'],
    ['shield', 'API Security Middleware', 'Authentication · Authorization · Threat Protection'],
    ['db', 'Database', 'PostgreSQL · MongoDB · Oracle'],
    ['pay', 'System Integration Payment', 'APIs · Banking · Financial Services'],
    ['terminal', 'Linux', 'Server · Administration · Scripting']
  ];

  var STEPS = [
    ['search', '#3b82f6', 'Gather business requirements', 'Lead'],
    ['rules', '#14b8a6', 'Define business rules', 'Lead'],
    ['people', '#8b5cf6', 'Define API business needs', 'Lead with stakeholders'],
    ['code', '#f97316', 'Design API integration', 'Review business needs'],
    ['shieldok', '#0ea5a4', 'Develop API policies and integrations', 'Validate requirements'],
    ['clipboard', '#6366f1', 'Conduct UAT', 'Coordinate business testing'],
    ['alert', '#ef4444', 'Investigate production incidents', 'Explain business impact and expected behavior'],
    ['filecheck', '#22c55e', 'Approve business requirements', 'Coordinate approval'],
    ['upload', '#0ea5e9', 'Deploy technical changes', 'Coordinate business readiness']
  ];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</svg>';
  }
  // Wrap each word so it can rise out of a clipped line
  function words(text, base) {
    return text.split(' ').map(function (w, i) {
      return '<span class="hb-w"><span style="--i:' + (base + i) + '">' + esc(w) + '</span></span>';
    }).join(' ');
  }

  function skillHTML(s, i) {
    return '<li class="hb-skill" style="--k:' + i + '">' +
      '<span class="hb-ring">' + svg(s[0]) + '</span>' +
      '<strong>' + words(s[1], i * 2) + '</strong>' +
      '<span class="hb-sub">' + esc(s[2]) + '</span></li>';
  }

  function build(host) {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var left = SKILLS.slice(0, 3).map(skillHTML).join('');
    var right = SKILLS.slice(3).map(function (s, i) { return skillHTML(s, i + 3); }).join('');
    var steps = STEPS.map(function (s, i) {
      return '<li class="hb-step" style="--k:' + i + ';--c:' + s[1] + '">' +
        '<span class="hb-n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
        '<span class="hb-ico">' + svg(s[0]) + '</span>' +
        '<strong>' + esc(s[2]) + '</strong>' +
        '<span class="hb-note">' + esc(s[3]) + '</span></li>';
    }).join('');

    host.className = 'hb' + (reduce ? ' hb-static' : '');
    host.setAttribute('role', 'region');
    host.setAttribute('aria-label', 'Skills and business-to-technology workflow');
    host.innerHTML =
      '<div class="hb-bg" aria-hidden="true"></div>' +
      '<div class="hb-inner">' +
        '<div class="hb-top">' +
          '<ul class="hb-skills hb-l">' + left + '</ul>' +
          '<div class="hb-photo"><img src="./img/portrait.webp" width="272" height="388" alt="Portrait of Visal Son" decoding="async" fetchpriority="high"></div>' +
          '<ul class="hb-skills hb-r">' + right + '</ul>' +
        '</div>' +
        '<p class="hb-eyebrow"><span class="hb-type" data-text="Business → Technology workflow"></span><span class="hb-caret" aria-hidden="true"></span></p>' +
        '<ol class="hb-steps">' + steps + '</ol>' +
        '<div class="hb-track" aria-hidden="true"><span class="hb-fill"></span></div>' +
        '<p class="hb-caption" aria-live="off"></p>' +
      '</div>';

    var typeEl = host.querySelector('.hb-type');
    var list = host.querySelector('.hb-steps');
    var items = Array.prototype.slice.call(list.children);
    var fill = host.querySelector('.hb-fill');
    var caption = host.querySelector('.hb-caption');

    function setActive(i, scroll) {
      items.forEach(function (li, j) {
        li.classList.toggle('on', j === i);
        li.classList.toggle('done', j < i);
      });
      fill.style.transform = 'scaleX(' + (i + 1) / items.length + ')';
      caption.classList.remove('show');
      void caption.offsetWidth;
      caption.innerHTML = '<b>Step ' + (i + 1) + '/' + items.length + '</b> ' + esc(STEPS[i][2]) + ' — <em>' + esc(STEPS[i][3]) + '</em>';
      caption.classList.add('show');
      // keep the active step in view on narrow screens without moving the page
      if (scroll && list.scrollWidth > list.clientWidth) {
        var li = items[i];
        list.scrollTo({ left: li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2, behavior: 'smooth' });
      }
    }

    if (reduce) {
      typeEl.textContent = typeEl.dataset.text;
      setActive(0, false);
      return;
    }

    // Typewriter eyebrow
    var text = typeEl.dataset.text, n = 0;
    setTimeout(function tick() {
      typeEl.textContent = text.slice(0, ++n);
      if (n < text.length) setTimeout(tick, 45);
    }, 900);

    requestAnimationFrame(function () { requestAnimationFrame(function () { host.classList.add('go'); }); });

    // Cycle through the workflow; pause on hover/touch and while off screen
    var active = 0, paused = false, visible = true, timer;
    function next() {
      if (!paused && visible && !document.hidden) { active = (active + 1) % items.length; setActive(active, true); }
      timer = setTimeout(next, 2200);
    }
    setTimeout(function () { setActive(0, false); timer = setTimeout(next, 2200); }, 1900);

    items.forEach(function (li, i) {
      li.addEventListener('mouseenter', function () { paused = true; active = i; setActive(i, false); });
      li.addEventListener('click', function () { active = i; setActive(i, false); });
    });
    list.addEventListener('mouseleave', function () { paused = false; });
    list.addEventListener('touchstart', function () { paused = true; clearTimeout(list._t); }, { passive: true });
    list.addEventListener('touchend', function () { list._t = setTimeout(function () { paused = false; }, 4000); }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(host);
    }
  }

  function start() {
    var host = document.getElementById('hero-banner');
    if (host) return build(host);
    var mo = new MutationObserver(function () {
      var h = document.getElementById('hero-banner');
      if (h) { mo.disconnect(); build(h); }
    });
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
