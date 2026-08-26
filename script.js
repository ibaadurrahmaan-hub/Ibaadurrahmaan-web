/* ====================================================
   IBAADURRAHMAAN — Interactive Script
   Version 8.1 · Clean, Rich Bottom Sheets & Bot Engine
   ==================================================== */

/* ===== 1. BOTTOM SHEET ENGINE (NEW - FIXED MOBILE MENU) ===== */
const sheetData = {
    layanan: {
        title: "Layanan Website",
        items: [
            { href: "layanan.html", icon: "fa-briefcase", color: "blue", title: "Layanan Kami", desc: "Overview semua jasa pembuatan website" },
            { href: "portfolio.html", icon: "fa-images", color: "purple", title: "Portfolio", desc: "Kumpulan karya-karya terbaik kami" },
            { href: "template.html", icon: "fa-palette", color: "green", title: "Template Website", desc: "Katalog desain premium siap pakai" },
            { href: "demo/", icon: "fa-globe", color: "cyan", title: "Live Demo", desc: "Coba website interaktif secara langsung" }
        ]
    },
    paket: {
        title: "Paket & Harga",
        items: [
            { href: "paket.html", icon: "fa-tag", color: "gold", title: "Paket & Harga", desc: "3 pilihan paket sesuai budget bisnis Anda" },
            { href: "order.html", icon: "fa-shopping-cart", color: "green", title: "Order Sekarang", desc: "Mulai project digital impian Anda hari ini", badge: "HOT" },
            { href: "penawaran.html", icon: "fa-file-contract", color: "purple", title: "Penawaran Personal", desc: "Custom proposal khusus untuk kebutuhan Anda" }
        ]
    },
    reseller: {
        title: "Program Reseller 2025",
        items: [
            { href: "reseller.html", icon: "fa-info-circle", color: "gold", title: "Info Reseller", desc: "Pelajari sistem benefit & tingkat tier komisi" },
            { href: "reseller.html#daftar", icon: "fa-user-plus", color: "green", title: "Daftar Reseller", desc: "Registrasi gratis 100%, tanpa modal awal!", badge: "FREE" },
            { href: "mou-reseller.html", icon: "fa-file-signature", color: "blue", title: "MoU Kerja Sama", desc: "Perjanjian & syarat ketentuan legalitas" },
            { href: "starter-kit.html", icon: "fa-gift", color: "purple", title: "Starter Kit", desc: "Akses bahan marketing materials gratis" }
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

    // Trigger Haptic Feedback
    triggerVibration(40);

    // Set judul sheet
    titleEl.innerText = data.title;

    // Buat HTML List Item
    let htmlContent = "";
    data.items.forEach(item => {
        const badgeHTML = item.badge ? `<span class="dd-badge">${item.badge}</span>` : '';
        htmlContent += `
            <a href="${item.href}" class="dropdown-link ${item.badge ? 'featured' : ''}" style="display: flex !important; width: 100%;">
                <div class="dd-icon icon-${item.color}"><i class="fas ${item.icon}"></i></div>
                <div class="dd-text">
                    <div class="dd-title">${item.title} ${badgeHTML}</div>
                    <div class="dd-desc">${item.desc}</div>
                </div>
            </a>
        `;
    });

    contentEl.innerHTML = htmlContent;

    // Buka Sheet & Overlay
    overlay.classList.add('active');
    sheet.classList.add('active');

    // Beri class active pada button mnav-item yang diklik
    document.querySelectorAll('.mnav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[onclick="openMobileSheet('${key}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function closeMobileSheet() {
    const overlay = document.getElementById('mobileSheetOverlay');
    const sheet = document.getElementById('mobileSheet');
    if (overlay) overlay.classList.remove('active');
    if (sheet) sheet.classList.remove('active');

    // Kembalikan status menu navigasi aktif ke beranda atau halaman saat ini
    highlightCurrentPage();
}


/* ===== 2. NAV SCROLL EFFECT ===== */
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


/* ===== 3. ACTIVE MENU HIGHLIGHT (CROSS-PAGE SUPPORT) ===== */
function highlightCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop().replace(".html", "") || "index";
    const allNavLinks = document.querySelectorAll('.nav-link, .mnav-item');

    allNavLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('data-page');
        const linkHref = link.getAttribute('href');

        if (linkPage === page || (page === "index" && linkHref === "index.html")) {
            link.classList.add('active');
        }
    });
}

function initActiveMenu() {
    highlightCurrentPage();
    
    // Khusus Single Page (Indikator Scroll Landing Page)
    const sections = document.querySelectorAll('section[id], main[id]');
    const scrollLinks = document.querySelectorAll('.nav-link[href^="#"], .mnav-item[href^="#"]');
    
    if (sections.length === 0 || scrollLinks.length === 0) return;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 180;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        if (current) {
            scrollLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }
    });
}


/* ===== 4. SMOOTH SCROLL ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#daftar')) return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                closeMobileSheet(); // Tutup bottom sheet jika link diklik
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}


/* ===== 5. FAQ ACCORDION ===== */
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


/* ===== 6. AUTO-HIDE MOBILE NAV ===== */
function initMobileNavAutoHide() {
    const mobileNav = document.getElementById('mobileNav');
    const sheet = document.getElementById('mobileSheet');
    if (!mobileNav) return;
    
    let lastScroll = 0;
    let scrollTimer = null;
    
    window.addEventListener('scroll', () => {
        // Jangan auto-hide navbar jika panel bottom-sheet mobile sedang terbuka
        if (sheet && sheet.classList.contains('active')) return;

        const currentScroll = window.scrollY;
        
        if (currentScroll < 100) {
            mobileNav.classList.remove('hidden');
            lastScroll = currentScroll;
            return;
        }
        
        if (currentScroll > lastScroll + 8) {
            mobileNav.classList.add('hidden');
        } else if (currentScroll < lastScroll - 8) {
            mobileNav.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            mobileNav.classList.remove('hidden');
        }, 1200);
    });
}


/* ===== 7. HAPTIC VIBRATION FEEDBACK ===== */
function triggerVibration(duration) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

function initHapticFeedback() {
    document.querySelectorAll('.mnav-item, .btn-primary, .btn-secondary, .cta-button, .dropdown-link, .wa-menu-btn').forEach(el => {
        el.addEventListener('click', () => {
            triggerVibration(35);
        });
    });
}


/* ===== 8. SCROLL FADE ANIMATIONS ===== */
function initFadeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' 
    });
    
    document.querySelectorAll('.fade-in, .fade-left, .fade-right').forEach(el => {
        observer.observe(el);
    });
}


/* ===== 9. PARALLAX MOCKUPS (Desktop Mouse-Move) ===== */
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


/* ====================================================
   10. WHATSAPP BOT BASIC (OPTIMIZED ENGINE)
   ==================================================== */
function initWhatsAppBot() {
    const waBotToggle = document.getElementById("waBotToggle");
    const waBotWindow = document.getElementById("waBotWindow");
    const waBotClose = document.getElementById("waBotClose");
    const waBotChat = document.getElementById("waBotChat");
    const waBotMenu = document.getElementById("waBotMenu");
    const waContactAdmin = document.getElementById("waContactAdmin");
    const waBotBadge = document.querySelector(".wa-bot-badge");
    const adminNumber = "6281401643188";

    if (!waBotToggle || !waBotWindow) return;

    // Buka / Tutup Bot Window
    waBotToggle.addEventListener("click", () => {
        waBotWindow.classList.toggle("active");
        if (waBotBadge) {
            waBotBadge.style.display = "none";
        }
        if (waBotWindow.classList.contains("active")) {
            scrollChatToBottom();
        }
    });

    if (waBotClose) {
        waBotClose.addEventListener("click", () => {
            waBotWindow.classList.remove("active");
        });
    }

    // Database Respons Bot
    const botResponses = {
        website: {
            title: "🌐 Paket Website",
            text: "Kami menyediakan berbagai macam website profesional berkualitas tinggi untuk kebutuhan UMKM, Instansi, Yayasan, Portofolio, Toko Online, hingga Landing Page promosi."
        },
        price: {
            title: "💰 Harga Website",
            text: "Paket pembuatan website kami sangat fleksibel & kompetitif. Mulai dari Paket Hemat (Rp 1,5jt), Paket Reguler (Rp 2,5jt), hingga Paket Premium Custom (Rp 5jt+)."
        },
        domain: {
            title: "🔗 Domain & Hosting",
            text: "Semua paket website yang kami buat sudah termasuk GRATIS domain .com/.id premium serta bandwidth hosting berkecepatan tinggi selama 1 tahun pertama."
        },
        maintenance: {
            title: "🔧 Maintenance",
            text: "Kami siap mengelola website Anda agar tetap aman dan up-to-date. Layanan meliputi backup berkala, monitoring malware, update sistem, dan perbaikan eror."
        },
        consultation: {
            title: "💬 Konsultasi",
            text: "Konsultasikan project website impian Anda gratis sekarang! Kami akan menganalisis kebutuhan Anda dan memberikan rekomendasi strategi digital terbaik."
        }
    };

    // Handler Klik Menu Bot
    const menuButtons = document.querySelectorAll(".wa-menu-btn");
    menuButtons.forEach(button => {
        button.addEventListener("click", function() {
            const menuType = this.getAttribute("data-menu");
            const response = botResponses[menuType];
            if (!response) return;

            // 1. Tambah Pesan Pengguna ke Chat Bubble
            addMessage(this.textContent.trim(), "user");

            // 2. Sembunyikan menu opsi untuk simulasi proses mengetik
            if (waBotMenu) waBotMenu.style.display = "none";

            // 3. Tampilkan Indikator Mengetik
            showTypingIndicator();

            // 4. Delay Respons Alami
            setTimeout(() => {
                removeTypingIndicator();

                // 5. Tambah Pesan Balasan Bot
                addMessage(`<strong>${response.title}</strong><br><br>${response.text}`, "bot");

                // 6. Sisipkan Tombol Hubungi Langsung di Bubble Chat
                addWhatsAppButton(response.title);

                // 7. Tampilkan kembali Menu Pilihan di bagian bawah chat
                if (waBotMenu) {
                    waBotChat.appendChild(waBotMenu);
                    waBotMenu.style.display = "flex";
                }
                scrollChatToBottom();
            }, 700);
        });
    });

    // Fungsi Pengiriman Pesan Ke Chat Area
    function addMessage(text, sender) {
        const message = document.createElement("div");
        message.className = `wa-message ${sender}`;
        
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const ticks = sender === "user" ? '<i class="fas fa-check-double" style="color:#53bdeb; margin-left:4px;"></i>' : '';

        message.innerHTML = `
            <div class="wa-message-content">${text}</div>
            <div class="wa-message-time">${timeStr} ${ticks}</div>
        `;

        if (waBotMenu && waBotMenu.parentNode === waBotChat) {
            waBotChat.insertBefore(message, waBotMenu);
        } else {
            waBotChat.appendChild(message);
        }
        scrollChatToBottom();
    }

    // Tombol WhatsApp Direct di bubble chat bot
    function addWhatsAppButton(topic) {
        const wrapper = document.createElement("div");
        wrapper.className = "wa-message bot";
        
        const cleanTopic = topic.replace(/[^\w\s]/gi, '').trim();
        const msg = encodeURIComponent(`Halo Ibaadurrahmaan Web, saya ingin konsultasi mengenai ${cleanTopic}.`);
        
        wrapper.innerHTML = `
            <div class="wa-message-content" style="background: transparent; box-shadow: none; padding: 0;">
                <a href="https://wa.me/${adminNumber}?text=${msg}" target="_blank" rel="noopener" class="wa-direct-button">
                    <i class="fab fa-whatsapp"></i> Lanjutkan ke WhatsApp
                </a>
            </div>
        `;

        if (waBotMenu && waBotMenu.parentNode === waBotChat) {
            waBotChat.insertBefore(wrapper, waBotMenu);
        } else {
            waBotChat.appendChild(wrapper);
        }
        scrollChatToBottom();
    }

    // Handler Tombol Footer Hubungi Admin
    if (waContactAdmin) {
        waContactAdmin.addEventListener("click", () => {
            const msg = encodeURIComponent("Halo Ibaadurrahmaan Web, saya ingin berkonsultasi mengenai jasa pembuatan website.");
            window.open(`https://wa.me/${adminNumber}?text=${msg}`, "_blank");
        });
    }

    // Helpers Bot
    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "wa-message bot";
        typingDiv.id = "waTypingIndicator";
        typingDiv.innerHTML = `
            <div class="wa-message-content">
                <span class="typing-dots"><span></span><span></span><span></span></span>
            </div>
        `;
        if (waBotMenu && waBotMenu.parentNode === waBotChat) {
            waBotChat.insertBefore(typingDiv, waBotMenu);
        } else {
            waBotChat.appendChild(typingDiv);
        }
        scrollChatToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById("waTypingIndicator");
        if (indicator) indicator.remove();
    }

    function scrollChatToBottom() {
        setTimeout(() => {
            waBotChat.scrollTop = waBotChat.scrollHeight;
        }, 50);
    }
}


/* ===== INJECT TYPING INDICATOR STYLING (SAFE-GUARD) ===== */
function injectIndicatorCSS() {
    const css = `
        .typing-dots { display: inline-flex; align-items: center; gap: 4px; height: 16px; }
        .typing-dots span { width: 6px; height: 6px; background: #555; border-radius: 50%; opacity: 0.4; animation: bounceDot 1.4s infinite both; }
        .typing-dots span:nth-child(2) { animation-delay: .2s; }
        .typing-dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes bounceDot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1.1); opacity: 1; } }
        .wa-direct-button {
            display: inline-flex; align-items: center; gap: 8px;
            background: #25D366; color: #fff; padding: 10px 14px;
            border-radius: 10px; font-size: 12px; font-weight: 700;
            text-decoration: none; box-shadow: 0 4px 12px rgba(37,211,102,0.3);
            transition: all 0.2s ease; margin-top: 4px;
        }
        .wa-direct-button:hover { background: #1ebe5d; transform: translateY(-1px); }
    `;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}


/* ===== INITIALIZE ALL MODULES ===== */
document.addEventListener('DOMContentLoaded', () => {
    injectIndicatorCSS();
    initNavScroll();
    initActiveMenu();
    initSmoothScroll();
    initFAQ();
    initMobileNavAutoHide();
    initHapticFeedback();
    initFadeAnimations();
    initMockupParallax();
    initWhatsAppBot();
    
    console.log('%c👋 Assalamu\'alaikum!', 'color: #D4A536; font-size: 20px; font-weight: bold;');
    console.log('%cIbaadurrahmaan Web Designer (V8.1)', 'color: #FFFFFF; font-size: 13px;');
});