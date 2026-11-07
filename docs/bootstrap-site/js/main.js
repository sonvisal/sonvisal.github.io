(function () {
  // Contact details are assembled here so they are not plain text in the HTML.
  var user = 'sonvisal10', domain = 'gmail.com', phone = '+855 93 742 926';
  var email = user + String.fromCharCode(64) + domain;
  document.querySelectorAll('.js-mail').forEach(function (a) {
    a.href = 'mailto:' + email;
    var t = a.classList.contains('js-text') ? a : a.querySelector('.js-text');
    if (t) t.textContent = email;
  });
  document.querySelectorAll('.js-tel').forEach(function (a) {
    a.href = 'tel:' + phone.replace(/\s+/g, '');
    var t = a.querySelector('.js-text');
    if (t) t.textContent = phone;
  });

  // Experience timeline: reveal each role as it scrolls into view, and fill the line with scroll progress.
  var timeline = document.querySelector('.timeline');
  if (timeline && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var items = timeline.querySelectorAll(':scope > li');
    items.forEach(function (li) {
      li.querySelectorAll('.tick li').forEach(function (b, i) { b.style.setProperty('--i', i); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (li) { io.observe(li); });

    var ticking = false;
    function updateProgress() {
      var r = timeline.getBoundingClientRect();
      var p = (window.innerHeight * 0.6 - r.top) / r.height;
      timeline.style.setProperty('--progress', Math.max(0, Math.min(1, p)).toFixed(3));
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // Number the volunteer bullets so they can be staggered.
  document.querySelectorAll('#volunteer .tick li').forEach(function (b, i) { b.style.setProperty('--i', i); });

  // Number each skill tag so its pop-in can be staggered within its card.
  document.querySelectorAll('#systems .tile').forEach(function (tile) {
    tile.querySelectorAll('.chip').forEach(function (c, i) { c.style.setProperty('--i', i); });
  });

  // Generic reveal for any element marked data-reveal (used by the Profile and Skills sections).
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { rio.observe(el); });
  }

  // The hero diagram animates forever; pause it while it is off screen to save CPU and battery.
  var diagram = document.querySelector('.diagram');
  if (diagram && diagram.pauseAnimations && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) diagram.unpauseAnimations(); else diagram.pauseAnimations();
      });
    }).observe(diagram);
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Navbar gets a background once the page scrolls, and stays solid while the mobile menu is open.
  var nav = document.getElementById('nav');
  var menu = document.getElementById('menu');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu (replaces Bootstrap's collapse plugin; the CSS .collapse / .show classes still do the hiding).
  var toggler = nav.querySelector('.navbar-toggler');
  function setMenu(open) {
    menu.classList.toggle('show', open);
    nav.classList.toggle('show-menu', open);
    toggler.setAttribute('aria-expanded', String(open));
  }
  toggler.addEventListener('click', function () { setMenu(!menu.classList.contains('show')); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 768) setMenu(false); });
})();
