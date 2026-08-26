/* ====================================================
   IBAADURRAHMAAN â€” Poster Web v7.0
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
    
    console.log('%cðŸ‘‹ Halo!', 
        'color: #D4A536; font-size: 24px; font-weight: bold;');
    console.log('%cIbaadurrahmaan Web Designer', 
        'color: #FFFFFF; font-size: 14px;');
    console.log('%cChat WA: 081401643188', 
        'color: #25D366; font-size: 12px;');
});

/* =========================================
   WHATSAPP BOT BASIC (OPTIMIZED & FIXED)
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const waBotToggle = document.getElementById("waBotToggle");
  const waBotWindow = document.getElementById("waBotWindow");
  const waBotClose = document.getElementById("waBotClose");
  const waBotChat = document.getElementById("waBotChat");
  const waBotMenu = document.getElementById("waBotMenu");
  const waContactAdmin = document.getElementById("waContactAdmin");
  const waBotBadge = document.querySelector(".wa-bot-badge");

  /* ========================================
     NOMOR WHATSAPP ADMIN
  ======================================== */
  const adminNumber = "6281401643188";

  /* ========================================
     BUKA / TUTUP BOT
  ======================================== */
  if (waBotToggle && waBotWindow) {
    waBotToggle.addEventListener("click", function () {
      waBotWindow.classList.toggle("active");

      // Hilangkan badge notifikasi angka "1" saat pertama dibuka
      if (waBotBadge) {
        waBotBadge.style.display = "none";
      }

      if (waBotWindow.classList.contains("active")) {
        scrollChatToBottom();
      }
    });
  }

  if (waBotClose && waBotWindow) {
    waBotClose.addEventListener("click", function () {
      waBotWindow.classList.remove("active");
    });
  }

  /* ========================================
     DATA RESPONS BOT (DIPERBAIKI EMOJI)
  ======================================== */
  const botResponses = {
    website: {
      title: "🌐 Paket Website",
      text: "Kami menyediakan website profesional untuk berbagai kebutuhan seperti UMKM, sekolah, lembaga pendidikan, yayasan, klinik, organisasi, personal brand, dan bisnis."
    },
    price: {
      title: "💰 Harga Website",
      text: "Paket website kami sangat terjangkau, disesuaikan dengan kebutuhan & fitur. Mulai dari Paket Hemat (Rp 1,5jt), Reguler (Rp 2,5jt), hingga Premium (Rp 5jt)."
    },
    domain: {
      title: "🔗 Domain & Hosting",
      text: "Semua paket sudah termasuk GRATIS Domain (.COM / .ID) dan Premium Hosting cepat & stabil selama 1 tahun pertama. Anda terima beres!"
    },
    maintenance: {
      title: "🔧 Maintenance Website",
      text: "Layanan maintenance meliputi update konten, perbaikan bug, pengecekan fungsi, dan monitoring keamanan website agar selalu lancar diakses."
    },
    consultation: {
      title: "💬 Konsultasi Gratis",
      text: "Silakan konsultasikan kebutuhan website Anda secara langsung. Kami siap membantu menentukan konsep, fitur, dan paket yang paling pas untuk bisnis Anda."
    }
  };

  /* ========================================
     KLIK MENU BOT
  ======================================== */
  const menuButtons = document.querySelectorAll(".wa-menu-btn");

  menuButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const menuType = this.getAttribute("data-menu");
      const response = botResponses[menuType];

      if (!response) return;

      // 1. Pesan User
      const userText = this.textContent.trim();
      addMessage(userText, "user");

      // 2. Sembunyikan menu pilihan sejenak
      if (waBotMenu) waBotMenu.style.display = "none";

      // 3. Animasi Indikator Mengetik
      showTypingIndicator();

      // 4. Delay Respons Bot (600ms agar alami)
      setTimeout(function () {
        removeTypingIndicator();

        // Tambah pesan balasan bot
        addMessage(`<strong>${response.title}</strong><br><br>${response.text}`, "bot");

        // Tambahkan Tombol Direct WhatsApp
        addWhatsAppButton(response.title);

        // Pindahkan menu pilihan ke paling bawah & tampilkan lagi
        if (waBotMenu) {
          waBotChat.appendChild(waBotMenu);
          waBotMenu.style.display = "flex";
        }

        scrollChatToBottom();
      }, 600);
    });
  });

  /* ========================================
     FUNGSI TAMBAH PESAN
  ======================================== */
  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = "wa-message " + sender;

    const currentTime = getFormattedTime();
    const checkDouble = sender === "user" ? '<i class="fas fa-check-double" style="color:#53bdeb; margin-left:3px;"></i>' : '';

    message.innerHTML = `
      <div class="wa-message-content">
        ${text}
      </div>
      <div class="wa-message-time">
        ${currentTime} ${checkDouble}
      </div>
    `;

    // Selalu sisipkan sebelum menu jika menu ada
    if (waBotMenu && waBotMenu.parentNode === waBotChat) {
      waBotChat.insertBefore(message, waBotMenu);
    } else {
      waBotChat.appendChild(message);
    }

    scrollChatToBottom();
  }

  /* ========================================
     TOMBOL DIRECT WHATSAPP DI BUBBLE CHAT
  ======================================== */
  function addWhatsAppButton(topic) {
    const wrapper = document.createElement("div");
    wrapper.className = "wa-message bot";

    const cleanTopic = topic.replace(/[^\w\s]/gi, '').trim(); // Hapus emoji dari teks topik
    const encodedMessage = encodeURIComponent(
      `Halo Ibaadurrahmaan Web, saya ingin berkonsultasi mengenai ${cleanTopic}.`
    );

    wrapper.innerHTML = `
      <div class="wa-message-content" style="background: transparent; box-shadow: none; padding: 0;">
        <a
          href="https://wa.me/${adminNumber}?text=${encodedMessage}"
          target="_blank"
          rel="noopener noreferrer"
          class="wa-direct-button"
        >
          <i class="fab fa-whatsapp"></i>
          Lanjutkan ke WhatsApp
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

  /* ========================================
     TOMBO HUBUNGI ADMIN (FOOTER)
  ======================================== */
  if (waContactAdmin) {
    waContactAdmin.addEventListener("click", function () {
      const message = encodeURIComponent(
        "Halo Ibaadurrahmaan Web, saya ingin berkonsultasi mengenai layanan website."
      );
      window.open(`https://wa.me/${adminNumber}?text=${message}`, "_blank");
    });
  }

  /* ========================================
     HELPER FUNCTIONS (Time, Typing, Scroll)
  ======================================== */
  function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

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
    const el = document.getElementById("waTypingIndicator");
    if (el) el.remove();
  }

  function scrollChatToBottom() {
    setTimeout(function () {
      waBotChat.scrollTop = waBotChat.scrollHeight;
    }, 50);
  }

});