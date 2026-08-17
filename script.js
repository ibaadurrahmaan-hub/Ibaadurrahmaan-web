/* ====================================================
   IBAADURRAHMAAN — Web Interactive Script v8.0
   Multi-Page Support + Fixed Nav Active
   ==================================================== */


/* ===== NAV SCROLL EFFECT ===== */
function initNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}


/* ===== 🎯 AUTO-ACTIVE NAV berdasarkan URL current ===== */
function initActiveNav() {
    // Ambil nama file dari URL
    const path = window.location.pathname;
    let pageName = path.split('/').pop().replace('.html', '');
    
    // Handle root URL (misal: / atau /Ibaadurrahmaan-web/)
    if (!pageName || pageName === '' || pageName === 'Ibaadurrahmaan-web') {
        pageName = 'index';
    }
    
    console.log('📍 Current page:', pageName);
    
    // Semua nav item (mobile + desktop)
    const navItems = document.querySelectorAll('.mnav-item, .nav-link');
    
    navItems.forEach(item => {
        // ═══ KUNCI: Reset SEMUA active dulu ═══
        item.classList.remove('active');
        
        // Cek data-page attribute (primary check)
        const dataPage = item.getAttribute('data-page');
        if (dataPage && dataPage === pageName) {
            item.classList.add('active');
            return;
        }
        
        // Fallback: cek href untuk match
        const href = item.getAttribute('href') || '';
        const hrefPage = href.split('/').pop().replace('.html', '').replace('#', '');
        
        if (hrefPage === pageName || 
            (pageName === 'index' && (href === 'index.html' || href === '/' || href === ''))) {
            item.classList.add('active');
        }
    });
}


/* ===== SMOOTH SCROLL (untuk anchor #section di halaman yang sama) ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}


/* ===== FAQ ACCORDION ===== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-q');
        if (!question) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items dalam group yang sama
            const parentGroup = item.closest('.faq-group') || item.closest('.faq-list').parentElement;
            if (parentGroup) {
                parentGroup.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            } else {
                faqItems.forEach(i => i.classList.remove('active'));
            }
            
            if (!isActive) item.classList.add('active');
        });
    });
}


/* ===== AUTO-HIDE MOBILE NAV saat scroll down ===== */
function initMobileNavAutoHide() {
    const mobileNav = document.getElementById('mobileNav');
    if (!mobileNav) return;
    
    let lastScroll = 0;
    let scrollTimer = null;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Selalu show kalau di atas
        if (currentScroll < 100) {
            mobileNav.classList.remove('hidden');
            lastScroll = currentScroll;
            return;
        }
        
        // Scroll down → hide
        if (currentScroll > lastScroll + 5) {
            mobileNav.classList.add('hidden');
        } 
        // Scroll up → show
        else if (currentScroll < lastScroll - 5) {
            mobileNav.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
        
        // Auto show setelah 1.5 detik tidak scroll
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            mobileNav.classList.remove('hidden');
        }, 1500);
    });
}


/* ===== HAPTIC FEEDBACK (Vibrate saat klik) ===== */
function initHapticFeedback() {
    document.querySelectorAll('.mnav-item, .btn-primary, .cta-button, .paket-detail-cta, .cta-bottom-btn').forEach(el => {
        el.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(30);
        });
    });
}


/* ===== SCROLL FADE ANIMATIONS (Intersection Observer) ===== */
function initFadeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' 
    });
    
    document.querySelectorAll('.fade-in, .fade-left, .fade-right').forEach(el => {
        observer.observe(el);
    });
}


/* ===== PARALLAX MOCKUPS (Desktop only, khusus halaman index) ===== */
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


/* ===== INIT ALL saat DOM ready ===== */
document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initActiveNav();          // ⭐ Fix nav active (multi-page)
    initSmoothScroll();
    initFAQ();
    initMobileNavAutoHide();
    initHapticFeedback();
    initFadeAnimations();
    initMockupParallax();
    
    // Console greeting
    console.log('%c👋 Halo!', 
        'color: #D4A536; font-size: 24px; font-weight: bold;');
    console.log('%cIbaadurrahmaan Web Designer', 
        'color: #FFFFFF; font-size: 14px;');
    console.log('%cChat WA: 081401643188', 
        'color: #25D366; font-size: 12px;');
    console.log('%c🚀 v8.0 - Multi-Page Ready', 
        'color: #D4A536; font-size: 11px; font-style: italic;');
});


/* ============================================
   📱 MOBILE SHEET CONTENT DATA (Optional - kalau pakai dropdown mobile)
   ============================================ */
const SHEET_CONTENT = {
    menu: {
        title: '<i class="fas fa-home" style="color:var(--gold)"></i> Menu Utama',
        items: [
            { url:'index.html',    icon:'fa-home',            iconCls:'icon-gold',   title:'Beranda',  desc:'Halaman utama' },
            { url:'layanan.html',  icon:'fa-briefcase',       iconCls:'icon-blue',   title:'Layanan',  desc:'Jasa yang ditawarkan' },
            { url:'paket.html',    icon:'fa-tag',             iconCls:'icon-green',  title:'Paket',    desc:'Pilih paket sesuai kebutuhan' },
            { url:'reseller.html', icon:'fa-handshake',       iconCls:'icon-orange', title:'Reseller', desc:'Program komisi menarik', badge:'HOT' },
            { url:'faq.html',      icon:'fa-question-circle', iconCls:'icon-purple', title:'FAQ',      desc:'Pertanyaan umum' }
        ]
    },
    
    client: {
        title: '<i class="fas fa-briefcase" style="color:var(--gold)"></i> Untuk Client',
        items: [
            { url:'paket.html',     icon:'fa-box',           iconCls:'icon-gold',   title:'Paket & Harga',    desc:'3 pilihan sesuai kebutuhan' },
            { url:'order.html',     icon:'fa-shopping-cart', iconCls:'icon-green',  title:'Order Sekarang',   desc:'Mulai project kamu!', badge:'HOT', featured:true },
            { url:'cek-order.html', icon:'fa-search',        iconCls:'icon-cyan',   title:'Cek Status Order', desc:'Tracking dengan Order ID' }
        ]
    },
    
    reseller: {
        title: '<i class="fas fa-handshake" style="color:var(--gold)"></i> Program Reseller',
        items: [
            { url:'reseller.html',          icon:'fa-info-circle',    iconCls:'icon-gold',   title:'Kenapa Jadi Reseller?', desc:'Benefit & tier komisi' },
            { url:'reseller-simulasi.html', icon:'fa-calculator',     iconCls:'icon-gold',   title:'Simulasi Penghasilan',  desc:'Hitung potensi income', badgeGold:'HOT', featuredGold:true },
            { url:'reseller-daftar.html',   icon:'fa-user-plus',      iconCls:'icon-green',  title:'Daftar Reseller',       desc:'Gratis, tanpa modal!', badge:'FREE', featured:true }
        ]
    }
};


/* ============================================
   🖥️ DESKTOP NAVBAR DROPDOWN (kalau ada)
   ============================================ */
function toggleDropdown(e, id) {
    e.preventDefault();
    e.stopPropagation();
    
    const item = e.currentTarget.closest('.nav-item');
    if (!item) return;
    
    const isOpen = item.classList.contains('open');
    
    // Close all others
    document.querySelectorAll('.nav-item.open').forEach(i => {
        if (i !== item) i.classList.remove('open');
    });
    
    // Toggle current
    item.classList.toggle('open');
}

// Close dropdown on outside click
document.addEventListener('click', e => {
    if (!e.target.closest('.nav-has-dropdown')) {
        document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
    }
});

// Close with ESC key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
        if (typeof closeMobileSheet === 'function') closeMobileSheet();
    }
});


/* ============================================
   📱 MOBILE BOTTOM SHEET (kalau pakai)
   ============================================ */
function openMobileSheet(type) {
    const data = SHEET_CONTENT[type];
    if (!data) return;
    
    const sheetTitle = document.getElementById('sheetTitle');
    const sheetContent = document.getElementById('sheetContent');
    const overlay = document.getElementById('mobileSheetOverlay');
    const sheet = document.getElementById('mobileSheet');
    
    if (!sheetTitle || !sheetContent || !overlay || !sheet) return;
    
    sheetTitle.innerHTML = data.title;
    
    sheetContent.innerHTML = data.items.map(item => {
        let extraCls = '';
        if (item.featured) extraCls = 'featured';
        if (item.featuredGold) extraCls = 'featured-gold';
        
        let badge = '';
        if (item.badge) badge = `<span class="dd-badge">${item.badge}</span>`;
        if (item.badgeGold) badge = `<span class="dd-badge dd-badge-gold">${item.badgeGold}</span>`;
        
        return `
            <a href="${item.url}" class="sheet-link ${extraCls}">
                <div class="sheet-link-icon dd-icon ${item.iconCls}">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="sheet-link-text">
                    <div class="sheet-link-title">${item.title} ${badge}</div>
                    <div class="sheet-link-desc">${item.desc}</div>
                </div>
                <i class="fas fa-chevron-right sheet-link-arrow"></i>
            </a>
        `;
    }).join('');
    
    overlay.classList.add('show');
    sheet.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeMobileSheet() {
    const overlay = document.getElementById('mobileSheetOverlay');
    const sheet = document.getElementById('mobileSheet');
    
    if (overlay) overlay.classList.remove('show');
    if (sheet) sheet.classList.remove('show');
    document.body.style.overflow = '';
}