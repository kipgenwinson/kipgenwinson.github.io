(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Drifting leaves in the hero ---------- */
  function leafSVG(color) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="' + color + '">' +
      '<path d="M17 3c-5 0-9 3.5-11 8-1 2.5-1 5.5-1 8 2.5 0 5.5 0 8-1 4.5-2 8-6 8-11 0-1.5-.2-3-1-4-1 .8-2.5 1-4 1z"/>' +
      '<path d="M6 19c2-4 5-7 9-9" stroke="rgba(0,0,0,.15)" stroke-width="1" fill="none"/></svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  var leafBox = document.getElementById('leaves');
  if (leafBox && !reduceMotion) {
    var colors = ['#A6CF5A', '#7FB03E', '#FFB400', '#FF7A22', '#C9E08A'];
    var count = window.innerWidth < 640 ? 9 : 16;
    for (var i = 0; i < count; i++) {
      var el = document.createElement('span');
      el.className = 'leaf';
      var size = 16 + Math.random() * 22;
      el.style.backgroundImage = 'url("' + leafSVG(colors[i % colors.length]) + '")';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = (Math.random() * 100) + '%';
      el.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
      el.style.setProperty('--spin', (Math.random() * 540 - 180) + 'deg');
      el.style.animationDuration = (9 + Math.random() * 10) + 's';
      el.style.animationDelay = (-Math.random() * 16) + 's';
      leafBox.appendChild(el);
    }
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Lightbox for post images ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  var lbClose = document.getElementById('lightboxClose');
  if (lb && lbImg) {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t.matches('[data-lightbox]')) {
        lbImg.src = t.src;
        lb.classList.add('open');
      }
    });
    function closeLB() { lb.classList.remove('open'); lbImg.src = ''; }
    lbClose && lbClose.addEventListener('click', closeLB);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLB(); });
  }
})();
