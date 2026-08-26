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
   WHATSAPP BOT BASIC
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const waBotToggle = document.getElementById("waBotToggle");
  const waBotWindow = document.getElementById("waBotWindow");
  const waBotClose = document.getElementById("waBotClose");
  const waBotChat = document.getElementById("waBotChat");
  const waBotMenu = document.getElementById("waBotMenu");
  const waContactAdmin = document.getElementById("waContactAdmin");


  /* ========================================
     NOMOR WHATSAPP ADMIN
     
     Format:
     628xxxxxxxxxx

     Jangan gunakan:
     +62
     08
     spasi
     tanda -
  ======================================== */

  const adminNumber = "6281401643188";


  /* ========================================
     BUKA / TUTUP BOT
  ======================================== */

  waBotToggle.addEventListener("click", function () {

    waBotWindow.classList.toggle("active");

    if (waBotWindow.classList.contains("active")) {
      scrollChatToBottom();
    }

  });


  waBotClose.addEventListener("click", function () {

    waBotWindow.classList.remove("active");

  });


  /* ========================================
     DATA RESPONS BOT
  ======================================== */

  const botResponses = {

    website: {
      title: "🌐 Paket Website",

      text:
        "Kami menyediakan website profesional untuk berbagai kebutuhan seperti UMKM, sekolah, lembaga pendidikan, yayasan, klinik, organisasi, personal brand, dan bisnis."
    },


    price: {
      title: "💰 Harga Website",

      text:
        "Paket website tersedia mulai dari harga yang disesuaikan dengan kebutuhan dan fitur website Anda. Silakan konsultasikan kebutuhan Anda agar kami dapat memberikan rekomendasi paket yang tepat."
    },


    domain: {
      title: "🔗 Domain & Hosting",

      text:
        "Kami menyediakan layanan Domain .COM dan Premium Hosting untuk membantu website Anda memiliki alamat profesional serta performa yang cepat dan stabil."
    },


    maintenance: {
      title: "🔧 Maintenance Website",

      text:
        "Layanan maintenance meliputi update konten, perbaikan bug, pengecekan fungsi, dan monitoring website sesuai paket maintenance yang dipilih."
    },


    consultation: {
      title: "💬 Konsultasi",

      text:
        "Silakan konsultasikan kebutuhan website Anda. Kami akan membantu menentukan konsep, fitur, paket, domain, hosting, dan layanan tambahan yang sesuai."
    }

  };


  /* ========================================
     KLIK MENU
  ======================================== */

  const menuButtons =
    document.querySelectorAll(".wa-menu-btn");


  menuButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const menuType =
        this.getAttribute("data-menu");

      const response =
        botResponses[menuType];

      if (!response) return;


      /* User message */

      const userText =
        this.textContent.trim();

      addMessage(
        userText,
        "user"
      );


      /* Delay respons bot */

      setTimeout(function () {

        addMessage(
          `<strong>${response.title}</strong><br><br>${response.text}`,
          "bot"
        );


        /* Tombol WhatsApp */

        addWhatsAppButton(
          response.title
        );

      }, 500);

    });

  });


  /* ========================================
     TAMBAHKAN PESAN
  ======================================== */

  function addMessage(text, sender) {

    const message =
      document.createElement("div");

    message.className =
      "wa-message " + sender;


    message.innerHTML = `

      <div class="wa-message-content">
        ${text}
      </div>

      <div class="wa-message-time">
        Sekarang
      </div>

    `;


    waBotChat.appendChild(message);

    scrollChatToBottom();

  }


  /* ========================================
     TOMBOL KIRIM WHATSAPP
  ======================================== */

  function addWhatsAppButton(topic) {

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "wa-message bot";


    const encodedMessage =
      encodeURIComponent(
        `Halo Ibaadurrahmaan Web, saya ingin berkonsultasi mengenai ${topic}.`
      );


    wrapper.innerHTML = `

      <div class="wa-message-content">

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


    waBotChat.appendChild(wrapper);

    scrollChatToBottom();

  }


  /* ========================================
     HUBUNGI ADMIN
  ======================================== */

  waContactAdmin.addEventListener(
    "click",
    function () {

      const message =
        encodeURIComponent(
          "Halo Ibaadurrahmaan Web, saya ingin berkonsultasi mengenai layanan website."
        );


      window.open(
        `https://wa.me/${adminNumber}?text=${message}`,
        "_blank"
      );

    }
  );


  /* ========================================
     SCROLL CHAT
  ======================================== */

  function scrollChatToBottom() {

    setTimeout(function () {

      waBotChat.scrollTop =
        waBotChat.scrollHeight;

    }, 50);

  }

});