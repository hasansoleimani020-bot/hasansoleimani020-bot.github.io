// Nabeel Ali personal site — language toggle (Arabic default / English)
let currentLang = 'ar';

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
  window.location.href = 'mailto:nabeelali3586@outlook.com?subject=' + subject + '&body=' + body;
}

document.getElementById('year').textContent = new Date().getFullYear();

// Initial language: ?lang=en URL param wins, then saved choice, else Arabic
(function initLang() {
  const param = new URLSearchParams(window.location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem('site-lang'); } catch (e) {}
  applyLang(param === 'en' || param === 'ar' ? param : (saved || 'ar'));
})();
