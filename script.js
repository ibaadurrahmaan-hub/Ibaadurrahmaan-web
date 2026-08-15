/* ====================================================
   IBAADURRAHMAAN — Poster Web v7.0
   Interactive Script
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


/* ===== ACTIVE MENU HIGHLIGHT ===== */
function initActiveMenu() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const allNavLinks = document.querySelectorAll('.nav-link, .mnav-item');
    
    function updateActive() {
        let current = 'beranda';
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActive);
    updateActive();
}


/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
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
            faqItems.forEach(i => i.classList.remove('active'));
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
        } else if (currentScroll < lastScroll - 5) {
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
    document.querySelectorAll('.mnav-item, .btn-primary, .cta-button').forEach(el => {
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


/* ===== PARALLAX MOCKUPS (Desktop only) ===== */
function initMockupParallax() {
    if (!window.matchMedia('(min-width: 992px)').matches) return;
    
    const laptop = document.querySelector('.laptop');
    const phone = document.querySelector('.phone');
    const heroRight = document.querySelector('.hero-right');
    
    if (!heroRight || !laptop || !phone) return;
    
    heroRight.addEventListener('mousemove', (e) => {
        const rect = heroRight.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width/2) / rect.width;
        const y = (e.clientY - rect.top - rect.height/2) / rect.height;
        laptop.style.transform = `translate(${x*8}px, ${y*8}px)`;
        phone.style.transform = `translate(${x*-12}px, ${y*-12}px)`;
    });
    
    heroRight.addEventListener('mouseleave', () => {
        laptop.style.transform = '';
        phone.style.transform = '';
    });
}


/* ===== INIT ALL ===== */
document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initActiveMenu();
    initSmoothScroll();
    initFAQ();
    initMobileNavAutoHide();
    initHapticFeedback();
    initFadeAnimations();
    initMockupParallax();
    
    console.log('%c👋 Halo!', 
        'color: #D4A536; font-size: 24px; font-weight: bold;');
    console.log('%cIbaadurrahmaan Web Designer', 
        'color: #FFFFFF; font-size: 14px;');
    console.log('%cChat WA: 081401643188', 
        'color: #25D366; font-size: 12px;');
});

// ==========================================
// 📱 MOBILE SHEET CONTENT DATA
// ==========================================
const SHEET_CONTENT = {
    // ═══════ MENU BERANDA ═══════
    menu: {
        title: '<i class="fas fa-home" style="color:var(--gold)"></i> Tentang Website',
        items: [
            { url:'index.html',          icon:'fa-home',         iconCls:'icon-gold',   title:'Beranda',    desc:'Halaman utama' },
            { url:'index.html#about',    icon:'fa-info-circle',  iconCls:'icon-blue',   title:'About Us',   desc:'Cerita & visi brand' },
            { url:'index.html#services', icon:'fa-cogs',         iconCls:'icon-green',  title:'Layanan',    desc:'Jasa yang ditawarkan' },
            { url:'index.html#portfolio',icon:'fa-images',       iconCls:'icon-purple', title:'Portfolio',  desc:'Karya-karya terbaik' },
            { url:'index.html#faq',      icon:'fa-question-circle',iconCls:'icon-orange',title:'FAQ',       desc:'Pertanyaan umum' },
            { url:'index.html#kontak',   icon:'fa-envelope',     iconCls:'icon-cyan',   title:'Kontak',     desc:'Hubungi kami' }
        ]
    },
    
    // ═══════ MENU CLIENT ═══════
    client: {
        title: '<i class="fas fa-briefcase" style="color:var(--gold)"></i> Untuk Client',
        items: [
            { 
                url:'paket.html',       
                icon:'fa-box',           
                iconCls:'icon-gold',   
                title:'Paket & Harga',       
                desc:'3 pilihan sesuai kebutuhan' 
            },
            { 
                url:'template.html',    
                icon:'fa-palette',       
                iconCls:'icon-blue',   
                title:'Template Website',    
                desc:'Katalog design siap pakai' 
            },
            { 
                url:'testimoni.html',   
                icon:'fa-star',          
                iconCls:'icon-orange', 
                title:'Testimoni Client',    
                desc:'Success stories & rating' 
            },
            { 
                url:'penawaran.html',   
                icon:'fa-file-contract', 
                iconCls:'icon-purple', 
                title:'Penawaran Personal',  
                desc:'Custom offer spesial' 
            },
            { 
                url:'order.html',       
                icon:'fa-shopping-cart', 
                iconCls:'icon-green',  
                title:'Order Sekarang',      
                desc:'Mulai project kamu!',
                badge:'HOT',
                featured:true 
            },
            { 
                url:'cek-order.html',   
                icon:'fa-search',        
                iconCls:'icon-cyan',   
                title:'Cek Status Order',    
                desc:'Tracking dengan Order ID' 
            }
        ]
    },
    
    // ═══════ MENU RESELLER ═══════
    reseller: {
        title: '<i class="fas fa-handshake" style="color:var(--gold)"></i> Program Reseller',
        items: [
            { 
                url:'reseller.html',           
                icon:'fa-info-circle',    
                iconCls:'icon-gold',   
                title:'Kenapa Jadi Reseller?', 
                desc:'Benefit & tier komisi' 
            },
            { 
                url:'reseller-simulasi.html',  
                icon:'fa-calculator',     
                iconCls:'icon-gold',   
                title:'Simulasi Penghasilan',  
                desc:'Hitung potensi income kamu',
                badgeGold:'HOT',
                featuredGold:true
            },
            { 
                url:'reseller-daftar.html',    
                icon:'fa-user-plus',      
                iconCls:'icon-green',  
                title:'Daftar Reseller',       
                desc:'Gratis, tanpa modal!',
                badge:'FREE',
                featured:true 
            },
            { 
                url:'reseller-mou.html',       
                icon:'fa-file-signature', 
                iconCls:'icon-blue',   
                title:'MoU Kerja Sama',        
                desc:'Perjanjian & syarat' 
            },
            { 
                url:'reseller-kit.html',       
                icon:'fa-gift',           
                iconCls:'icon-purple', 
                title:'Starter Kit',           
                desc:'Marketing materials gratis' 
            }
        ]
    }
};


// ==========================================
// 🖥️ DESKTOP NAVBAR DROPDOWN
// ==========================================
function toggleDropdown(e, id){
    e.preventDefault();
    e.stopPropagation();
    
    const item = e.currentTarget.closest('.nav-item');
    const isOpen = item.classList.contains('open');
    
    // Close all others
    document.querySelectorAll('.nav-item.open').forEach(i => {
        if(i !== item) i.classList.remove('open');
    });
    
    // Toggle current
    item.classList.toggle('open');
}

// Close on outside click
document.addEventListener('click', e => {
    if(!e.target.closest('.nav-has-dropdown')){
        document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
    }
});

// Close with ESC
document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
        document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
        closeMobileSheet();
    }
});


// ==========================================
// 📱 MOBILE BOTTOM SHEET
// ==========================================
function openMobileSheet(type){
    const data = SHEET_CONTENT[type];
    if(!data) return;
    
    document.getElementById('sheetTitle').innerHTML = data.title;
    
    const content = document.getElementById('sheetContent');
    content.innerHTML = data.items.map(item => {
        // Tentukan class
        let extraCls = '';
        if(item.featured) extraCls = 'featured';
        if(item.featuredGold) extraCls = 'featured-gold';
        
        // Tentukan badge
        let badge = '';
        if(item.badge) badge = `<span class="dd-badge">${item.badge}</span>`;
        if(item.badgeGold) badge = `<span class="dd-badge dd-badge-gold">${item.badgeGold}</span>`;
        
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
    
    document.getElementById('mobileSheetOverlay').classList.add('show');
    document.getElementById('mobileSheet').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeMobileSheet(){
    document.getElementById('mobileSheetOverlay').classList.remove('show');
    document.getElementById('mobileSheet').classList.remove('show');
    document.body.style.overflow = '';
}


// ==========================================
// 🎯 SCROLL EFFECT
// ==========================================
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar-main');
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});


// ==========================================
// 🎯 AUTO-DETECT CURRENT PAGE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Highlight nav item
    document.querySelectorAll('.nav-link, .mnav-item, .sheet-link').forEach(link => {
        if(link.href && link.href.includes(currentPage)){
            link.classList.add('active');
        }
    });
});