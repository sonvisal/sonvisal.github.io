/* Scroll-triggered section animations for the React-rendered page.
   Waits for the app to render, then tags elements with classes styled in motion.css. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  root.classList.add('mo');

  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function countUp(el) {
    var m = /^(\d+)(.*)$/.exec(el.textContent.trim());
    if (!m) return;
    var end = +m[1], suffix = m[2], t0 = null, dur = 1200;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * e) + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = '0' + suffix;
    requestAnimationFrame(step);
  }

  function init(main) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        io.unobserve(el);
        if (el.dataset.moCount) countUp(el.querySelector('.text-3xl') || el);
        // drop the stagger delay after reveal so hover effects respond instantly
        setTimeout(function () { el.style.removeProperty('--d'); }, 1600);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    function reveal(els, extra, step) {
      var byParent = new Map();
      els.forEach(function (el) {
        if (el.classList.contains('mo-r')) return;
        var p = el.parentNode, i = byParent.get(p) || 0;
        byParent.set(p, i + 1);
        el.classList.add('mo-r');
        if (extra) extra.split(' ').forEach(function (c) { el.classList.add(c); });
        el.style.setProperty('--d', Math.min(i * (step || 0.08), 0.6) + 's');
        io.observe(el);
      });
    }

    // Section headings (eyebrow + title + drawing rule)
    $$('section h2', main).forEach(function (h) {
      var head = h.parentNode;
      var line = head.querySelector('.h-px');
      if (line) line.classList.add('mo-line');
      reveal([head], 'mo-head');
    });

    // Stats band: pop + count up
    var stats = $$('section[aria-label="Career stats"] .grid > div', main);
    reveal(stats, 'mo-pop', 0.12);
    stats.forEach(function (s) { s.dataset.moCount = '1'; });

    // About paragraphs
    reveal($$('#about .md\\:col-span-2 > p', main));

    // Experience timeline
    $$('#log .w-px', main).forEach(function (r) { r.classList.add('mo-rail'); io.observe(r); });
    $$('#log ol > li', main).forEach(function (li) {
      var dot = li.querySelector(':scope > span.rounded-full');
      if (dot) dot.classList.add('mo-dot');
    });
    reveal($$('#log ol > li', main), 'mo-left', 0.05);

    // Education entries
    reveal($$('#education ol > li', main), 'mo-left');

    // Skill groups, then each pill pops in
    reveal($$('#systems .grid > div', main), 'mo-card', 0.1);
    reveal($$('#systems span.rounded-full', main), 'mo-pop', 0.04);

    // Remaining cards (about side panels, certificates, volunteer, contact)
    reveal($$('#about .rounded-2xl, #education .rounded-2xl, #volunteer .rounded-2xl, #contact .rounded-2xl', main)
      .filter(function (el) { return !el.classList.contains('border-dashed'); }), 'mo-card', 0.1);
    reveal($$('#contact .border-dashed', main));

    // Scroll progress bar
    var bar = document.createElement('div');
    bar.className = 'mo-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - innerHeight;
        bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 0);
        ticking = false;
      });
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  function ready() {
    var main = document.querySelector('#root main');
    return main && main.querySelector('#contact') ? main : null;
  }

  function start() {
    var main = ready();
    if (main) return init(main);
    var target = document.getElementById('root') || document.body;
    var mo = new MutationObserver(function () {
      var m = ready();
      if (m) { mo.disconnect(); init(m); }
    });
    mo.observe(target, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
