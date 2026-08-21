/* ====================================================
   IBAADURRAHMAAN — Web Interactive Script v8.1
   Multi-Page Support + Fixed Nav Active + Safe Reload
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

/* ===== 🎯 AUTO-ACTIVE NAV v8.6 — Support Parent Group ===== */
function initActiveNav() {
    const path = window.location.pathname;
    let pageName = path.split('/').pop().replace('.html', '');
    
    if (!pageName || pageName === '' || pageName === 'Ibaadurrahmaan-web') {
        pageName = 'index';
    }
    
    console.log('📍 Current page:', pageName);
    
    const PAGE_GROUP_MAP = {
        // ═══ Group: LAYANAN ═══
        'tentang'           : 'layanan',
        'portfolio'         : 'layanan',
        'template'          : 'layanan',
        'demo'              : 'layanan',
        
        // ═══ Group: PAKET ═══
        'order'             : 'paket',
        'penawaran'         : 'paket',
        'invoice'           : 'paket',
        
        // ═══ Group: RESELLER ═══
        'mou-reseller'      : 'reseller',
        'starter-kit'       : 'reseller',
        'daftar-reseller'   : 'reseller',
        'dashboard-reseller': 'reseller',
    };
    
    const activeGroup = PAGE_GROUP_MAP[pageName] || pageName;
    
    if (activeGroup !== pageName) {
        console.log('🎯 Sub-page detected. Active parent:', activeGroup);
    }
    
    const navItems = document.querySelectorAll(
        '.mnav-item, .nav-link, a.mnav-item, button.mnav-item'
    );
    
    console.log('📋 Found nav items:', navItems.length);
    
    navItems.forEach(item => {
        item.classList.remove('active');
        
        const dataPage = item.getAttribute('data-page');
        if (dataPage && (dataPage === pageName || dataPage === activeGroup)) {
            item.classList.add('active');
            console.log('✅ Active:', dataPage, '→', item.tagName);
            return;
        }
        
        const href = item.getAttribute('href') || '';
        if (!href || href === '#' || href.startsWith('http')) return;
        
        const hrefPage = href.split('/').pop().replace('.html', '').split('#')[0];
        
        if (hrefPage === pageName || 
            hrefPage === activeGroup ||
            (pageName === 'index' && (href === 'index.html' || href === '/' || href === ''))) {
            item.classList.add('active');
            console.log('✅ Active via href:', href, '→', item.tagName);
        }
    });
}

/* ===== SMOOTH SCROLL ===== */
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
            
            const parentGroup = item.closest('.faq-group') || 
                               (item.closest('.faq-list') ? item.closest('.faq-list').parentElement : null);
            
            if (parentGroup) {
                parentGroup.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            } else {
                faqItems.forEach(i => i.classList.remove('active'));
            }
            
            if (!isActive) item.classList.add('active');
        });
    });
}


/* ===== AUTO-HIDE MOBILE NAV ===== */
function initMobileNavAutoHide() {
    const mobileNav = document.getElementById('mobileNav');
    if (!mobileNav) return;
    
    let lastScroll = 0;
    let scrollTimer = null;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll < 100) {
            mobileNav.classList.remove('hidden');
            lastScroll = currentScroll;
            return;
        }
        
        if (currentScroll > lastScroll + 5) {
            mobileNav.classList.add('hidden');
        } 
        else if (currentScroll < lastScroll - 5) {
            mobileNav.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            mobileNav.classList.remove('hidden');
        }, 1500);
    });
}


/* ===== HAPTIC FEEDBACK ===== */
function initHapticFeedback() {
    document.querySelectorAll('.mnav-item, .btn-primary, .cta-button, .paket-detail-cta, .cta-bottom-btn').forEach(el => {
        el.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(30);
        });
    });
}


/* ===== SCROLL FADE ANIMATIONS ===== */
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


/* ===== PARALLAX MOCKUPS ===== */
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
    if (!placeholder) return;
    
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '') || 'index';
    const isHomepage = (pageName === 'index' || pageName === '' || pageName === 'Ibaadurrahmaan-web');
    
    if (isHomepage) return;
    
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
    
    placeholder.outerHTML = navbarHTML;
    
    console.log('🎯 Auto-navbar injected for page:', pageName);
    
    setupBackButton();
    initNavScroll();
}


/* ============================================
   ⬅️ SMART BACK BUTTON
   ============================================ */
function setupBackButton() {
    const backBtn = document.getElementById('navBackBtn');
    if (!backBtn) return;
    
    backBtn.addEventListener('click', (e) => {
        if (window.history.length > 1 && 
            document.referrer && 
            document.referrer.includes(window.location.host)) {
            e.preventDefault();
            window.history.back();
            console.log('⬅️ History back');
        } else {
            console.log('🏠 Go to homepage');
        }
    });
}

/* ===== INIT ALL saat DOM ready ===== */
document.addEventListener('DOMContentLoaded', () => {
    initAutoNavbar();
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
    console.log('%c🚀 v8.1 - Safe Reload Ready', 'color: #D4A536; font-size: 11px; font-style: italic;');
}); 


/* ============================================
   📱 MOBILE SHEET CONTENT DATA
   ⭐ FIX: Pakai window.SHEET_CONTENT biar aman dari duplikasi
   ============================================ */

window.SHEET_CONTENT = window.SHEET_CONTENT || {
    
    // ═══════════════════════════════
    // 🏢 LAYANAN (dengan Tentang & Demo Dropdown)
    // ═══════════════════════════════
    layanan: {
        title: '<i class="fas fa-briefcase" style="color:var(--gold)"></i> Layanan Kami',
        items: [
            { 
                url:     'tentang.html',         
                icon:    'fa-info-circle',       
                iconCls: 'icon-gold',            
                title:   'Tentang Kami',         
                desc:    'Cerita, visi & misi kami',
                featured: true 
            },
            { 
                url:     'layanan.html',  
                icon:    'fa-briefcase', 
                iconCls: 'icon-blue',   
                title:   'Layanan Kami',    
                desc:    'Overview semua jasa' 
            },
            { 
                url:     'portfolio.html',
                icon:    'fa-images',    
                iconCls: 'icon-purple', 
                title:   'Portfolio',       
                desc:    'Karya-karya terbaik' 
            },
            { 
                url:     'template.html', 
                icon:    'fa-palette',   
                iconCls: 'icon-green',  
                title:   'Template Website',
                desc:    'Katalog design siap pakai' 
            },
            { 
                icon:    'fa-globe',     
                iconCls: 'icon-cyan',   
                title:   'Live Demo',       
                desc:    'Coba 6+ website interaktif',
                subMenu: 'demoList',
                badge:   '6+'
            }
        ]
    },
    
    // ═══════════════════════════════
    // 💰 PAKET & ORDER
    // ═══════════════════════════════
    paket: {
        title: '<i class="fas fa-tag" style="color:var(--gold)"></i> Paket & Order',
        items: [
            { 
                url:     'paket.html',     
                icon:    'fa-tag',           
                iconCls: 'icon-gold',   
                title:   'Paket & Harga',    
                desc:    '3 pilihan sesuai kebutuhan' 
            },
            { 
                url:     'order.html',     
                icon:    'fa-shopping-cart', 
                iconCls: 'icon-green',  
                title:   'Order Sekarang',   
                desc:    'Mulai project kamu!', 
                badge:   'HOT', 
                featured: true 
            },
            { 
                url:     'penawaran.html', 
                icon:    'fa-file-contract', 
                iconCls: 'icon-purple', 
                title:   'Penawaran Personal',
                desc:    'Custom offer spesial' 
            }
        ]
    },
    
    // ═══════════════════════════════
    // 🤝 RESELLER (4 items lengkap)
    // ═══════════════════════════════
    reseller: {
        title: '<i class="fas fa-handshake" style="color:var(--gold)"></i> Program Reseller',
        items: [
            { 
                url:     'reseller.html',        
                icon:    'fa-info-circle',    
                iconCls: 'icon-gold',   
                title:   'Info Reseller',    
                desc:    'Benefit, tier komisi & keuntungan' 
            },
            { 
                url:     'daftar-reseller.html',    
                icon:    'fa-user-plus',      
                iconCls: 'icon-green',  
                title:   'Daftar Sekarang',      
                desc:    'Gabung dan mulai earning!',
                badge:   'HOT',
                featured: true 
            },
            { 
                url:     'starter-kit.html',     
                icon:    'fa-gift',           
                iconCls: 'icon-purple',  
                title:   'Starter Kit',      
                desc:    'Marketing materials gratis',
                badge:   'FREE'
            },
            { 
                url:     'mou-reseller.html',    
                icon:    'fa-file-signature', 
                iconCls: 'icon-blue',   
                title:   'MoU Kerja Sama',   
                desc:    'Perjanjian & syarat resmi' 
            }
        ]
    },
    
    // ═══════════════════════════════
    // 🌐 DEMO LIST (Sub-Menu dari Layanan)
    // ═══════════════════════════════
    demoList: {
        title:  '<i class="fas fa-globe" style="color:var(--gold)"></i> Live Demo Templates',
        parent: 'layanan',
        items: [
            { 
                url:     'demo/busana-muslim/index.html', 
                icon:    'fa-mosque',
                iconCls: 'icon-gold', 
                title:   'Toko Busana Muslim', 
                desc:    'E-commerce fashion syar\'i',
                badge:   'NEW',
                featured: true
            },
            { 
                url:     'demo/travel-umrah/index.html', 
                icon:    'fa-kaaba',
                iconCls: 'icon-green',  
                title:   'Travel Umrah', 
                desc:    'Website travel & paket umrah' 
            },
            { 
                url:     'demo/wifi-provider/index.html', 
                icon:    'fa-wifi',
                iconCls: 'icon-cyan',   
                title:   'WiFi Provider', 
                desc:    'Company profile + registrasi online',
                badge:   'HOT'
            },
            { 
                url:     'demo/restaurant-1/index.html', 
                icon:    'fa-utensils',
                iconCls: 'icon-orange', 
                title:   'Restaurant Modern', 
                desc:    'Landing page F&B elegan' 
            },
            { 
                url:     'demo/corporate-1/index.html', 
                icon:    'fa-briefcase',
                iconCls: 'icon-blue',   
                title:   'Corporate Premium', 
                desc:    'Company profile professional' 
            },
            { 
                url:     'demo/fashion-1/index.html', 
                icon:    'fa-shopping-bag',
                iconCls: 'icon-pink',   
                title:   'Fashion Store', 
                desc:    'E-commerce boutique elegant' 
            }
        ]
    }
    
};

// ============================================
// 🎯 TOGGLE DROPDOWN (Safe Event / Element Check)
// ============================================
function toggleDropdown(e) {
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    }
    if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
    }

    let triggerEl = null;

    if (e instanceof HTMLElement) {
        triggerEl = e;
    } else if (e && e.currentTarget instanceof HTMLElement) {
        triggerEl = e.currentTarget;
    } else if (e && e.target instanceof HTMLElement) {
        triggerEl = e.target;
    } else if (typeof e === 'string') {
        triggerEl = document.getElementById(e);
    }

    if (!triggerEl) return;

    const select = triggerEl.closest('.custom-select') || 
                   triggerEl.closest('.custom-dropdown') || 
                   triggerEl;

    if (select) {
        const isOpen = select.classList.contains('open');
        
        document.querySelectorAll('.custom-select.open, .custom-dropdown.open').forEach(s => {
            if (s !== select) s.classList.remove('open');
        });

        select.classList.toggle('open', !isOpen);
    }
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
   📱 MOBILE BOTTOM SHEET (Sub-Menu Support)
   ============================================ */
let sheetHistory = [];

function openMobileSheet(type, fromSubMenu = false) {
    const data = window.SHEET_CONTENT[type];
    if (!data) return;
    
    if (!fromSubMenu) {
        sheetHistory = [];
    }
    sheetHistory.push(type);
    
    document.querySelectorAll('.mnav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const parentType = data.parent || type;
    const activeBtn = document.querySelector(`.mnav-item[data-page="${parentType}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    const sheetTitle = document.getElementById('sheetTitle');
    const sheetContent = document.getElementById('sheetContent');
    const overlay = document.getElementById('mobileSheetOverlay');
    const sheet = document.getElementById('mobileSheet');
    
    if (!sheetTitle || !sheetContent || !overlay || !sheet) return;
    
    if (data.parent) {
        sheetTitle.innerHTML = `
            <button class="sheet-back-btn" onclick="backToSheet('${data.parent}')" aria-label="Kembali">
                <i class="fas fa-arrow-left"></i>
            </button>
            ${data.title}
        `;
    } else {
        sheetTitle.innerHTML = data.title;
    }
    
    const currentPath = window.location.pathname.split('/').slice(-2).join('/').toLowerCase();
    
    sheetContent.innerHTML = data.items.map(item => {
        let extraCls = '';
        if (item.featured) extraCls = 'featured';
        if (item.featuredGold) extraCls = 'featured-gold';
        
        const itemPath = (item.url || '').split('/').slice(-2).join('/').toLowerCase();
        const isCurrentPage = item.url && (itemPath === currentPath);
        if (isCurrentPage) extraCls += ' current-page';
        
        let badge = '';
        if (item.badge) badge = `<span class="dd-badge">${item.badge}</span>`;
        if (item.badgeGold) badge = `<span class="dd-badge dd-badge-gold">${item.badgeGold}</span>`;
        
        const currentIndicator = isCurrentPage 
            ? '<i class="fas fa-check-circle" style="color:#25d366;margin-left:6px;font-size:0.9rem;"></i>' 
            : '';
        
        if (item.subMenu) {
            return `
                <button type="button" class="sheet-link ${extraCls}" onclick="openMobileSheet('${item.subMenu}', true)">
                    <div class="sheet-link-icon dd-icon ${item.iconCls}">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <div class="sheet-link-text">
                        <div class="sheet-link-title">${item.title} ${badge}</div>
                        <div class="sheet-link-desc">${item.desc}</div>
                    </div>
                    <i class="fas fa-chevron-right sheet-link-arrow"></i>
                </button>
            `;
        }
        
        return `
            <a href="${item.url}" class="sheet-link ${extraCls}">
                <div class="sheet-link-icon dd-icon ${item.iconCls}">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="sheet-link-text">
                    <div class="sheet-link-title">${item.title} ${badge} ${currentIndicator}</div>
                    <div class="sheet-link-desc">${item.desc}</div>
                </div>
                <i class="fas fa-chevron-right sheet-link-arrow"></i>
            </a>
        `;
    }).join('');
    
    overlay.classList.add('show');
    sheet.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    if (fromSubMenu) {
        sheetContent.style.animation = 'slideInFromRight 0.3s ease';
    } else {
        sheetContent.style.animation = 'slideInFromBottom 0.3s ease';
    }
}

/* ⬅️ Back to parent sheet */
function backToSheet(parentType) {
    sheetHistory.pop();
    
    const sheetContent = document.getElementById('sheetContent');
    if (sheetContent) sheetContent.style.animation = 'slideInFromLeft 0.3s ease';
    
    setTimeout(() => {
        openMobileSheet(parentType, false);
    }, 50);
}

function closeMobileSheet() {
    const overlay = document.getElementById('mobileSheetOverlay');
    const sheet = document.getElementById('mobileSheet');
    
    if (overlay) overlay.classList.remove('show');
    if (sheet) sheet.classList.remove('show');
    document.body.style.overflow = '';
    
    sheetHistory = [];
    
    if (typeof initActiveNav === 'function') {
        initActiveNav();
    }
}