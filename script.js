// Nabeel Ali personal site — language toggle (Arabic default / English)
// + dynamic interactions: typing hero, scroll reveal, nav tracking, 3D tilt, counters
let currentLang = 'ar';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Enable reveal animations (content stays visible if JS never runs)
document.body.classList.add('js-anim');

function applyLang(lang) {
  currentLang = lang;
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('ltr', lang === 'en');
  document.querySelectorAll('[data-ar]').forEach(el => {
    el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en;
  });
  document.querySelectorAll('[data-ph-ar]').forEach(el => {
    el.placeholder = lang === 'ar' ? el.dataset.phAr : el.dataset.phEn;
  });
  document.getElementById('langBtn').textContent = lang === 'ar' ? 'English' : 'العربية';
  document.title = lang === 'ar'
    ? 'نبيل علي | Nabeel Ali — الموقع الشخصي'
    : 'Nabeel Ali | نبيل علي — Personal Website';
  try { localStorage.setItem('site-lang', lang); } catch (e) {}
  startTyping();
}

function toggleLang() {
  applyLang(currentLang === 'ar' ? 'en' : 'ar');
}

function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

// Close mobile nav when a link is tapped
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// Contact form: opens the visitor's email app addressed to Nabeel
function sendMail(event) {
  event.preventDefault();
  const name = document.getElementById('senderName').value.trim();
  const msg = document.getElementById('senderMsg').value.trim();
  const subject = encodeURIComponent(currentLang === 'ar' ? 'رسالة من موقعك الشخصي — ' + name : 'Message from your website — ' + name);
  const body = encodeURIComponent(msg + '\n\n— ' + name);
  window.location.href = 'mailto:alajnbyq@gmail.com?subject=' + subject + '&body=' + body;
}

document.getElementById('year').textContent = new Date().getFullYear();

// Hero typing effect — cycles the three tagline roles
const TYPED_ROLES = {
  ar: ['مطور برمجيات', 'مطور بوتات تيليجرام', 'أتمتة الأنظمة والذكاء الاصطناعي'],
  en: ['Software Developer', 'Telegram Bot Developer', 'Systems Automation & AI']
};
let typeTimer = null;
function startTyping() {
  const el = document.getElementById('typed');
  if (!el) return;
  if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
  const roles = TYPED_ROLES[currentLang] || TYPED_ROLES.ar;
  if (reduceMotion) { el.textContent = roles.join(' | '); return; }
  let role = 0, pos = 0, deleting = false;
  (function tick() {
    const word = roles[role];
    el.textContent = word.slice(0, pos);
    let delay = deleting ? 32 : 70;
    if (!deleting && pos === word.length) { delay = 1900; deleting = true; }
    else if (deleting && pos === 0) { deleting = false; role = (role + 1) % roles.length; delay = 350; }
    else { pos += deleting ? -1 : 1; }
    typeTimer = setTimeout(tick, delay);
  })();
}

// Scroll-reveal sections and cards
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
})();

// Nav active state while scrolling
(function initNavSpy() {
  const links = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    links[a.getAttribute('href').slice(1)] = a;
  });
  const sections = Object.keys(links)
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        Object.values(links).forEach(a => a.classList.remove('active'));
        const link = links[entry.target.id];
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
})();

// 3D tilt on cards (mouse/trackpad only)
(function initTilt() {
  if (!window.matchMedia('(pointer: fine)').matches || reduceMotion) return;
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(700px) rotateX(' + (-y * 9).toFixed(2) + 'deg) rotateY(' + (x * 9).toFixed(2) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// Animated follower/subscriber counters
(function initCounters() {
  const grid = document.getElementById('socialGrid');
  if (!grid) return;
  const counters = grid.querySelectorAll('.count');
  if (!counters.length) return;
  function animate() {
    counters.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      if (reduceMotion) { el.textContent = target.toLocaleString('en-US'); return; }
      const start = performance.now(), duration = 1300;
      (function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }
  if (!('IntersectionObserver' in window)) { animate(); return; }
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { animate(); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(grid);
})();

// Back-to-top button
(function initToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
})();

// Initial language: ?lang=en URL param wins, then saved choice, else Arabic
(function initLang() {
  const param = new URLSearchParams(window.location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem('site-lang'); } catch (e) {}
  applyLang(param === 'en' || param === 'ar' ? param : (saved || 'ar'));
})();
