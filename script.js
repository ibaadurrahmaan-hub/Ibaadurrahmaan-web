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


/* ===== 🎯 AUTO-ACTIVE NAV berdasarkan URL current (FIXED) ===== */
function initActiveNav() {
    // Ambil nama file dari URL
    const path = window.location.pathname;
    let pageName = path.split('/').pop().replace('.html', '');
    
    // Handle root URL
    if (!pageName || pageName === '' || pageName === 'Ibaadurrahmaan-web') {
        pageName = 'index';
    }
    
    console.log('📍 Current page:', pageName);
    
    // ═══ Ambil SEMUA nav item (a & button, mobile & desktop) ═══
    const navItems = document.querySelectorAll(
        '.mnav-item, ' +          // Mobile nav items
        '.nav-link, ' +            // Desktop nav links  
        'a.mnav-item, ' +          // Explicit link
        'button.mnav-item'         // ⭐ Explicit button (biar pasti kena)
    );
    
    console.log('🎯 Found nav items:', navItems.length);
    
    navItems.forEach(item => {
        // ═══ STEP 1: Reset SEMUA active dulu ═══
        item.classList.remove('active');
        
        // ═══ STEP 2: Cek data-page (PRIMARY & UTAMA) ═══
        const dataPage = item.getAttribute('data-page');
        if (dataPage && dataPage === pageName) {
            item.classList.add('active');
            console.log('✅ Active:', dataPage, '→', item.tagName);
            return;  // Sudah match, skip cek href
        }
        
        // ═══ STEP 3: Fallback — cek href (untuk <a> yang tidak punya data-page) ═══
        const href = item.getAttribute('href') || '';
        if (!href || href === '#' || href.startsWith('http')) return;
        
        const hrefPage = href.split('/').pop().replace('.html', '').split('#')[0];
        
        if (hrefPage === pageName || 
            (pageName === 'index' && (href === 'index.html' || href === '/' || href === ''))) {
            item.classList.add('active');
            console.log('✅ Active via href:', href, '→', item.tagName);
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

/* ============================================
   🎯 AUTO-INJECT NAVBAR (Sub-Page)
   ============================================ */
function initAutoNavbar() {
    const placeholder = document.getElementById('auto-navbar');
    if (!placeholder) return;  // Skip kalau tidak ada placeholder (misal di index.html)
    
    // Deteksi apakah ini halaman index atau sub
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '') || 'index';
    const isHomepage = (pageName === 'index' || pageName === '' || pageName === 'Ibaadurrahmaan-web');
    
    // Kalau di homepage, skip (biar tetap pakai navbar bawaan)
    if (isHomepage) return;
    
    // ═══ Template Navbar Sub-Page ═══
    const navbarHTML = `
        <nav class="navbar" id="navbar">
            <div class="nav-inner nav-inner-sub">
                
                <!-- ⬅️ Tombol Back -->
                <a href="index.html" class="nav-back-btn" id="navBackBtn" aria-label="Kembali">
                    <i class="fas fa-arrow-left"></i>
                    <span>Kembali</span>
                </a>
                
                <!-- 🏆 Brand (Logo + Text) -->
                <a href="index.html" class="nav-brand-full">
                    <img src="main-logo.png" alt="Ibaadurrahmaan Logo" class="nav-brand-logo">
                    <div class="nav-brand-text-wrap">
                        <span class="brand-name-nav">IBAADURRAHMAAN</span>
                        <span class="brand-sub-nav">WEB DESIGNER</span>
                    </div>
                </a>
                
                <!-- Spacer kanan -->
                <div class="nav-spacer"></div>
                
            </div>
        </nav>
    `;
    
    // Inject ke placeholder
    placeholder.outerHTML = navbarHTML;
    
    console.log('🎯 Auto-navbar injected for page:', pageName);
    
    // Setup smart back button setelah inject
    setupBackButton();
    
    // Re-init nav scroll (biar navbar baru dapat efek scrolled)
    initNavScroll();
}


/* ============================================
   ⬅️ SMART BACK BUTTON
   ============================================ */
function setupBackButton() {
    const backBtn = document.getElementById('navBackBtn');
    if (!backBtn) return;
    
    backBtn.addEventListener('click', (e) => {
        // Kalau user datang dari halaman lain di website ini, back ke sana
        if (window.history.length > 1 && 
            document.referrer && 
            document.referrer.includes(window.location.host)) {
            e.preventDefault();
            window.history.back();
            console.log('⬅️ History back');
        } else {
            // Kalau langsung buka (dari Google/link luar), ke index.html
            console.log('🏠 Go to homepage');
        }
    });
}

/* ===== INIT ALL saat DOM ready ===== */

document.addEventListener('DOMContentLoaded', () => {
    initAutoNavbar();         // ⭐ TAMBAH INI PALING ATAS (biar navbar ready dulu)
    initNavScroll();
    initActiveNav();
    initSmoothScroll();
    initFAQ();
    initMobileNavAutoHide();
    initHapticFeedback();
    initFadeAnimations();
    initMockupParallax();
    
    console.log('%c👋 Halo!', 'color: #D4A536; font-size: 24px; font-weight: bold;');
    console.log('%cIbaadurrahmaan Web Designer', 'color: #FFFFFF; font-size: 14px;');
    console.log('%cChat WA: 081401643188', 'color: #25D366; font-size: 12px;');
    console.log('%c🚀 v8.5 - Auto Navbar Ready', 'color: #D4A536; font-size: 11px; font-style: italic;');
}); 

/* ============================================
   📱 MOBILE SHEET CONTENT DATA (Optional - kalau pakai dropdown mobile)
   ============================================ */

const SHEET_CONTENT = {
    layanan: {
        title: '<i class="fas fa-briefcase" style="color:var(--gold)"></i> Layanan Kami',
        items: [
            { url:'layanan.html',  icon:'fa-briefcase', iconCls:'icon-blue',   title:'Layanan Kami',    desc:'Overview semua jasa' },
            { url:'portfolio.html',icon:'fa-images',    iconCls:'icon-purple', title:'Portfolio',       desc:'Karya-karya terbaik' },
            { url:'template.html', icon:'fa-palette',   iconCls:'icon-green',  title:'Template Website',desc:'Katalog design siap pakai' },
            { url:'demo/',         icon:'fa-globe',     iconCls:'icon-cyan',   title:'Live Demo',       desc:'Coba website interaktif' }
        ]
    },
    
    paket: {
        title: '<i class="fas fa-tag" style="color:var(--gold)"></i> Paket & Order',
        items: [
            { url:'paket.html',     icon:'fa-tag',           iconCls:'icon-gold',   title:'Paket & Harga',    desc:'3 pilihan sesuai kebutuhan' },
            { url:'order.html',     icon:'fa-shopping-cart', iconCls:'icon-green',  title:'Order Sekarang',   desc:'Mulai project kamu!', badge:'HOT', featured:true },
            { url:'penawaran.html', icon:'fa-file-contract', iconCls:'icon-purple', title:'Penawaran Personal',desc:'Custom offer spesial' }
        ]
    },
    
    reseller: {
        title: '<i class="fas fa-handshake" style="color:var(--gold)"></i> Program Reseller',
        items: [
            { url:'reseller.html',        icon:'fa-info-circle',    iconCls:'icon-gold',   title:'Info Reseller',    desc:'Benefit & tier komisi' },
            { url:'reseller.html#daftar', icon:'fa-user-plus',      iconCls:'icon-green',  title:'Daftar Reseller',  desc:'Gratis, tanpa modal!', badge:'FREE', featured:true },
            { url:'mou-reseller.html',    icon:'fa-file-signature', iconCls:'icon-blue',   title:'MoU Kerja Sama',   desc:'Perjanjian & syarat' },
            { url:'starter-kit.html',     icon:'fa-gift',           iconCls:'icon-purple', title:'Starter Kit',      desc:'Marketing materials gratis' }
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
    
    // ⭐ FIX: Reset semua active, lalu set ke tombol yang di-klik
    document.querySelectorAll('.mnav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Cari tombol berdasarkan data-page dan set active
    const activeBtn = document.querySelector(`.mnav-item[data-page="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        console.log('🎯 Sheet opened, active set to:', type);
    } else {
        console.warn('❌ Tombol tidak ditemukan untuk:', type);
    }
    
    // Render sheet
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
    
    // ⭐ Restore active state ke URL saat ini
    if (typeof initActiveNav === 'function') {
        initActiveNav();
    }
}