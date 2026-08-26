/* ====================================================
   IBAADURRAHMAAN — Interactive Script
   Version 8.3 · Inject Subpage Header + Nav + Bot
   ==================================================== */

/* ===== 1. INJECT SUBPAGE HEADER (Back + Logo + Brand Box) ===== */
function injectSubpageHeader() {
  // Jangan inject di beranda / index
  const path = (window.location.pathname || '').toLowerCase();
  const file = path.split('/').pop() || 'index.html';
  const isHome =
    file === '' ||
    file === 'index.html' ||
    file === 'index' ||
    path.endsWith('/');

  if (isHome) return;

  // Sudah ada? jangan double inject
  if (document.querySelector('.subpage-header-wrapper')) return;

  const headerHTML = `
    <div class="subpage-header-wrapper" id="subpageHeader">
      <div class="subpage-header-box">
        <a href="javascript:void(0)" class="btn-back-header" id="btnBackHeader" aria-label="Kembali">
          <i class="fas fa-arrow-left"></i>
        </a>
        <a href="index.html" class="subpage-brand-center" aria-label="Beranda Ibaadurrahmaan">
          <img src="main-logo.png" alt="Logo Ibaadurrahmaan" class="subpage-logo" onerror="this.style.display='none'">
          <div class="subpage-brand-text">
            <span class="subpage-title">Ibaadurrahmaan</span>
            <span class="subpage-sub">WEB DESIGNER</span>
          </div>
        </a>
      </div>
    </div>
  `;

  // Sisipkan di paling atas body (sebelum konten)
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  // Tombol back
  const btnBack = document.getElementById('btnBackHeader');
  if (btnBack) {
    btnBack.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }
}


/* ===== 2. BOTTOM SHEET DATA + ENGINE ===== */
const sheetData = {
  layanan: {
    title: 'Layanan Website',
    items: [
      { href: 'layanan.html', icon: 'fa-briefcase', color: 'blue', title: 'Layanan Kami', desc: 'Overview semua jasa pembuatan website' },
      { href: 'portfolio.html', icon: 'fa-images', color: 'purple', title: 'Portfolio', desc: 'Kumpulan karya-karya terbaik kami' },
      { href: 'template.html', icon: 'fa-palette', color: 'green', title: 'Template Website', desc: 'Katalog desain premium siap pakai' },
      { href: 'demo/', icon: 'fa-globe', color: 'cyan', title: 'Live Demo', desc: 'Coba website interaktif secara langsung' }
    ]
  },
  paket: {
    title: 'Paket & Harga',
    items: [
      { href: 'paket.html', icon: 'fa-tag', color: 'gold', title: 'Paket & Harga', desc: '3 pilihan paket sesuai budget bisnis Anda' },
      { href: 'order.html', icon: 'fa-shopping-cart', color: 'green', title: 'Order Sekarang', desc: 'Mulai project digital impian Anda hari ini', badge: 'HOT' },
      { href: 'penawaran.html', icon: 'fa-file-contract', color: 'purple', title: 'Penawaran Personal', desc: 'Custom proposal khusus untuk kebutuhan Anda' }
    ]
  },
  reseller: {
    title: 'Program Reseller 2025',
    items: [
      { href: 'reseller.html', icon: 'fa-info-circle', color: 'gold', title: 'Info Reseller', desc: 'Pelajari sistem benefit & tingkat tier komisi' },
      { href: 'reseller.html#daftar', icon: 'fa-user-plus', color: 'green', title: 'Daftar Reseller', desc: 'Registrasi gratis 100%, tanpa modal awal!', badge: 'FREE' },
      { href: 'mou-reseller.html', icon: 'fa-file-signature', color: 'blue', title: 'MoU Kerja Sama', desc: 'Perjanjian & syarat ketentuan legalitas' },
      { href: 'starter-kit.html', icon: 'fa-gift', color: 'purple', title: 'Starter Kit', desc: 'Akses bahan marketing materials gratis' }
    ]
  }
};

function openMobileSheet(key) {
  const data = sheetData[key];
  if (!data) return;

  const overlay = document.getElementById('mobileSheetOverlay');
  const sheet = document.getElementById('mobileSheet');
  const titleEl = document.getElementById('sheetTitle');
  const contentEl = document.getElementById('sheetContent');
  if (!overlay || !sheet || !titleEl || !contentEl) return;

  triggerVibration(40);
  titleEl.textContent = data.title;

  contentEl.innerHTML = data.items.map((item) => {
    const badge = item.badge ? `<span class="dd-badge">${item.badge}</span>` : '';
    const featured = item.badge ? 'featured' : '';
    return `
      <a href="${item.href}" class="dropdown-link ${featured}">
        <div class="dd-icon icon-${item.color}"><i class="fas ${item.icon}"></i></div>
        <div class="dd-text">
          <div class="dd-title">${item.title} ${badge}</div>
          <div class="dd-desc">${item.desc}</div>
        </div>
      </a>
    `;
  }).join('');

  overlay.classList.add('active');
  sheet.classList.add('active');

  document.querySelectorAll('.mnav-item').forEach((el) => el.classList.remove('active'));
  const activeBtn = document.querySelector(`.mnav-item[data-page="${key}"], .mnav-item[onclick*="'${key}'"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

function closeMobileSheet() {
  const overlay = document.getElementById('mobileSheetOverlay');
  const sheet = document.getElementById('mobileSheet');
  if (overlay) overlay.classList.remove('active');
  if (sheet) sheet.classList.remove('active');
  highlightCurrentPage();
}

// Expose ke HTML onclick
window.openMobileSheet = openMobileSheet;
window.closeMobileSheet = closeMobileSheet;


/* ===== 3. DESKTOP DROPDOWN TOGGLE ===== */
function toggleDropdown(e, id) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const parent = e && e.currentTarget ? e.currentTarget.closest('.nav-has-dropdown') : null;
  document.querySelectorAll('.nav-has-dropdown').forEach((el) => {
    if (el !== parent) el.classList.remove('open');
  });
  if (parent) parent.classList.toggle('open');
}
window.toggleDropdown = toggleDropdown;

document.addEventListener('click', () => {
  document.querySelectorAll('.nav-has-dropdown').forEach((el) => el.classList.remove('open'));
});


/* ===== 4. NAV SCROLL EFFECT ===== */
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}


/* ===== 5. ACTIVE MENU HIGHLIGHT ===== */
function highlightCurrentPage() {
  const path = window.location.pathname || '';
  let page = path.split('/').pop().replace('.html', '') || 'index';
  if (page === '' || page === 'index.html') page = 'index';

  // Mapping halaman turunan ke parent nav
  const map = {
    portfolio: 'layanan',
    template: 'layanan',
    demo: 'layanan',
    order: 'paket',
    penawaran: 'paket',
    'mou-reseller': 'reseller',
    'starter-kit': 'reseller'
  };
  const navKey = map[page] || page;

  document.querySelectorAll('.nav-link, .mnav-item').forEach((link) => {
    link.classList.remove('active');
    const dp = link.getAttribute('data-page');
    const href = (link.getAttribute('href') || '').replace('.html', '');
    if (dp === navKey || dp === page || href === page || (page === 'index' && (href === 'index' || href === 'index.html' || href === ''))) {
      link.classList.add('active');
    }
  });
}

function initActiveMenu() {
  highlightCurrentPage();
}


/* ===== 6. SMOOTH SCROLL ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      closeMobileSheet();
      const top = target.offsetTop - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ===== 7. FAQ ===== */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
      if (!open) item.classList.add('active');
    });
  });
}


/* ===== 8. AUTO-HIDE MOBILE NAV ===== */
function initMobileNavAutoHide() {
  const mobileNav = document.getElementById('mobileNav');
  const sheet = document.getElementById('mobileSheet');
  if (!mobileNav) return;

  let lastScroll = 0;
  let timer = null;

  window.addEventListener('scroll', () => {
    if (sheet && sheet.classList.contains('active')) return;
    const y = window.scrollY;
    if (y < 80) {
      mobileNav.classList.remove('hidden');
      lastScroll = y;
      return;
    }
    if (y > lastScroll + 8) mobileNav.classList.add('hidden');
    else if (y < lastScroll - 8) mobileNav.classList.remove('hidden');
    lastScroll = y;
    clearTimeout(timer);
    timer = setTimeout(() => mobileNav.classList.remove('hidden'), 1200);
  }, { passive: true });
}


/* ===== 9. HAPTIC ===== */
function triggerVibration(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function initHapticFeedback() {
  document.querySelectorAll('.mnav-item, .btn-primary, .btn-secondary, .cta-button, .dropdown-link, .wa-menu-btn, .btn-back-header').forEach((el) => {
    el.addEventListener('click', () => triggerVibration(30));
  });
}


/* ===== 10. FADE ANIMATIONS ===== */
function initFadeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in, .fade-left, .fade-right').forEach((el) => observer.observe(el));
}


/* ===== 11. MOCKUP PARALLAX ===== */
function initMockupParallax() {
  if (!window.matchMedia('(min-width: 992px)').matches) return;
  const laptop = document.querySelector('.laptop');
  const phone = document.querySelector('.phone');
  const heroRight = document.querySelector('.hero-right');
  if (!heroRight || !laptop || !phone) return;

  heroRight.addEventListener('mousemove', (e) => {
    const rect = heroRight.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    laptop.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    phone.style.transform = `translate(${x * -12}px, ${y * -12}px)`;
  });
  heroRight.addEventListener('mouseleave', () => {
    laptop.style.transform = '';
    phone.style.transform = '';
  });
}


/* ===== 12. WHATSAPP BOT ===== */
function initWhatsAppBot() {
  const waBotToggle = document.getElementById('waBotToggle');
  const waBotWindow = document.getElementById('waBotWindow');
  const waBotClose = document.getElementById('waBotClose');
  const waBotChat = document.getElementById('waBotChat');
  const waBotMenu = document.getElementById('waBotMenu');
  const waContactAdmin = document.getElementById('waContactAdmin');
  const waBotBadge = document.querySelector('.wa-bot-badge');
  const adminNumber = '6281401643188';
  if (!waBotToggle || !waBotWindow || !waBotChat) return;

  waBotToggle.addEventListener('click', () => {
    waBotWindow.classList.toggle('active');
    if (waBotBadge) waBotBadge.style.display = 'none';
    if (waBotWindow.classList.contains('active')) scrollChatToBottom();
  });

  if (waBotClose) {
    waBotClose.addEventListener('click', () => waBotWindow.classList.remove('active'));
  }

  const botResponses = {
    website: {
      title: '🌐 Paket Website',
      text: 'Kami menyediakan website profesional untuk UMKM, sekolah, yayasan, klinik, organisasi, personal brand, dan bisnis.'
    },
    price: {
      title: '💰 Harga Website',
      text: 'Paket hemat mulai Rp 1,5jt, Reguler Rp 2,5jt, hingga Premium custom. Sesuai fitur & kebutuhan Anda.'
    },
    domain: {
      title: '🔗 Domain & Hosting',
      text: 'Semua paket termasuk GRATIS domain (.com/.id) dan hosting premium 1 tahun pertama.'
    },
    maintenance: {
      title: '🔧 Maintenance',
      text: 'Update konten, perbaikan bug, monitoring keamanan, dan backup berkala agar website selalu stabil.'
    },
    consultation: {
      title: '💬 Konsultasi Gratis',
      text: 'Ceritakan kebutuhan Anda. Kami bantu tentukan konsep, fitur, dan paket yang paling pas.'
    }
  };

  document.querySelectorAll('.wa-menu-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const type = this.getAttribute('data-menu');
      const response = botResponses[type];
      if (!response) return;

      addMessage(this.textContent.trim(), 'user');
      if (waBotMenu) waBotMenu.style.display = 'none';
      showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator();
        addMessage(`<strong>${response.title}</strong><br><br>${response.text}`, 'bot');
        addWhatsAppButton(response.title);
        if (waBotMenu) {
          waBotChat.appendChild(waBotMenu);
          waBotMenu.style.display = 'flex';
        }
        scrollChatToBottom();
      }, 650);
    });
  });

  function addMessage(text, sender) {
    const message = document.createElement('div');
    message.className = `wa-message ${sender}`;
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const ticks = sender === 'user' ? '<i class="fas fa-check-double" style="color:#53bdeb;margin-left:4px;"></i>' : '';
    message.innerHTML = `
      <div class="wa-message-content">${text}</div>
      <div class="wa-message-time">${t} ${ticks}</div>
    `;
    if (waBotMenu && waBotMenu.parentNode === waBotChat) waBotChat.insertBefore(message, waBotMenu);
    else waBotChat.appendChild(message);
    scrollChatToBottom();
  }

  function addWhatsAppButton(topic) {
    const wrapper = document.createElement('div');
    wrapper.className = 'wa-message bot';
    const clean = topic.replace(/[^\w\s]/gi, '').trim();
    const msg = encodeURIComponent(`Halo Ibaadurrahmaan Web, saya ingin konsultasi mengenai ${clean}.`);
    wrapper.innerHTML = `
      <div class="wa-message-content" style="background:transparent;box-shadow:none;padding:0;">
        <a href="https://wa.me/${adminNumber}?text=${msg}" target="_blank" rel="noopener" class="wa-direct-button">
          <i class="fab fa-whatsapp"></i> Lanjutkan ke WhatsApp
        </a>
      </div>
    `;
    if (waBotMenu && waBotMenu.parentNode === waBotChat) waBotChat.insertBefore(wrapper, waBotMenu);
    else waBotChat.appendChild(wrapper);
    scrollChatToBottom();
  }

  if (waContactAdmin) {
    waContactAdmin.addEventListener('click', () => {
      const msg = encodeURIComponent('Halo Ibaadurrahmaan Web, saya ingin berkonsultasi mengenai jasa pembuatan website.');
      window.open(`https://wa.me/${adminNumber}?text=${msg}`, '_blank');
    });
  }

  function showTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'wa-message bot';
    el.id = 'waTypingIndicator';
    el.innerHTML = `<div class="wa-message-content"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
    if (waBotMenu && waBotMenu.parentNode === waBotChat) waBotChat.insertBefore(el, waBotMenu);
    else waBotChat.appendChild(el);
    scrollChatToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('waTypingIndicator');
    if (el) el.remove();
  }

  function scrollChatToBottom() {
    setTimeout(() => { waBotChat.scrollTop = waBotChat.scrollHeight; }, 40);
  }
}


/* ===== 13. INJECT CSS (Header box + typing + WA button) ===== */
function injectSupportCSS() {
  if (document.getElementById('ibaad-support-css')) return;
  const css = `
    /* Subpage Header Box (inject) */
    .subpage-header-wrapper{
      position: sticky;
      top: 0;
      z-index: 90;
      padding: 14px 16px 8px;
      max-width: 920px;
      margin: 0 auto;
    }
    .subpage-header-box{
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 64px;
      padding: 10px 56px;
      background: rgba(5,11,24,0.82);
      border: 1px solid rgba(212,165,54,0.18);
      border-radius: 100px;
      backdrop-filter: blur(18px) saturate(160%);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    }
    .btn-back-header{
      position: absolute;
      left: 12px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #B8C2D1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      transition: all .25s ease;
    }
    .btn-back-header:hover{
      background: linear-gradient(180deg,#FBE38E 0%,#D4A536 50%,#8B6914 100%);
      color: #050B18;
      border-color: #D4A536;
    }
    .subpage-brand-center{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
    }
    .subpage-logo{
      height: 34px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(212,165,54,0.35));
    }
    .subpage-brand-text{
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1.1;
    }
    .subpage-title{
      font-family: 'Montserrat', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.3px;
      background: linear-gradient(180deg,#FBE38E 0%,#D4A536 50%,#8B6914 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .subpage-sub{
      font-size: 0.58rem;
      font-weight: 600;
      letter-spacing: 2px;
      color: #B8C2D1;
      text-transform: uppercase;
      margin-top: 3px;
    }
    @media (max-width: 480px){
      .subpage-header-wrapper{ padding: 12px 12px 6px; }
      .subpage-header-box{ min-height: 58px; padding: 8px 48px; }
      .btn-back-header{ width: 34px; height: 34px; left: 10px; }
      .subpage-logo{ height: 28px; }
      .subpage-title{ font-size: 1rem; }
      .subpage-sub{ font-size: 0.52rem; letter-spacing: 1.6px; }
    }

    /* Mobile nav active pill (kurang bulat) */
    .mnav-item{
      border: none !important;
      outline: none !important;
      -webkit-appearance: none !important;
      -webkit-tap-highlight-color: transparent !important;
      border-radius: 14px !important;
      background: transparent;
    }
    .mnav-item.active{
      background: linear-gradient(180deg,#FBE38E 0%,#D4A536 50%,#8B6914 100%) !important;
      color: #050B18 !important;
      border-radius: 14px !important;
      box-shadow: 0 6px 18px rgba(212,165,54,0.4) !important;
    }
    .mnav-item.active i,
    .mnav-item.active span{
      color: #050B18 !important;
      opacity: 1 !important;
    }

    /* WA floating: icon only */
    .wa-bot-toggle{
      background: transparent !important;
      box-shadow: none !important;
      color: #25D366 !important;
      font-size: 3.4rem !important;
      width: auto !important;
      height: auto !important;
      filter: drop-shadow(0 8px 18px rgba(37,211,102,0.55));
    }
    .wa-bot-toggle:hover{ transform: scale(1.08); }

    /* Typing + direct WA btn */
    .typing-dots{display:inline-flex;align-items:center;gap:4px;height:16px;}
    .typing-dots span{width:6px;height:6px;background:#555;border-radius:50%;opacity:.4;animation:bounceDot 1.4s infinite both;}
    .typing-dots span:nth-child(2){animation-delay:.2s;}
    .typing-dots span:nth-child(3){animation-delay:.4s;}
    @keyframes bounceDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1.1);opacity:1}}
    .wa-direct-button{
      display:inline-flex;align-items:center;gap:8px;
      background:#25D366;color:#fff;padding:10px 14px;border-radius:10px;
      font-size:12px;font-weight:700;text-decoration:none;
      box-shadow:0 4px 12px rgba(37,211,102,.3);
    }
  `;
  const style = document.createElement('style');
  style.id = 'ibaad-support-css';
  style.textContent = css;
  document.head.appendChild(style);
}


/* ===== INIT ALL ===== */
document.addEventListener('DOMContentLoaded', () => {
  injectSupportCSS();
  injectSubpageHeader();
  initNavScroll();
  initActiveMenu();
  initSmoothScroll();
  initFAQ();
  initMobileNavAutoHide();
  initHapticFeedback();
  initFadeAnimations();
  initMockupParallax();
  initWhatsAppBot();

  console.log('%cIbaadurrahmaan Web Designer v8.3', 'color:#D4A536;font-weight:bold;');
});