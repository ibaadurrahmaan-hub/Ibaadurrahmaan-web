/* ==============================================
   PORTAL WARGA - DEMO SCRIPT (FINAL)
   ============================================== */

// ⭐ Ganti nomor WA CS di sini
const CS_WA = '6285267891619' ;

// ============ DATA DUMMY ============
const dataPasar = [
  { id: 1, emoji: '🥬', name: 'Sayur Bayam 1 Ikat', vendor: 'Toko Bu Tini', price: 5000 },
  { id: 2, emoji: '🍅', name: 'Tomat Merah 500gr', vendor: 'Kios Pak Amin', price: 8000 },
  { id: 3, emoji: '🥚', name: 'Telur Ayam 1 Kg', vendor: 'Peternakan Barokah', price: 28000 },
  { id: 4, emoji: '🍗', name: 'Ayam Potong 1 Ekor', vendor: 'Ayam Segar Bu Sri', price: 45000 },
  { id: 5, emoji: '🐟', name: 'Ikan Lele Segar 1 Kg', vendor: 'Pak Kadir Fresh', price: 22000 },
  { id: 6, emoji: '🍚', name: 'Beras Premium 5 Kg', vendor: 'Sembako Berkah', price: 65000 },
  { id: 7, emoji: '🧅', name: 'Bawang Merah 250gr', vendor: 'Kios Pak Amin', price: 12000 },
  { id: 8, emoji: '🌶️', name: 'Cabai Rawit 100gr', vendor: 'Toko Bu Tini', price: 15000 },
];

const dataProperty = [
  { 
    id: 1, emoji: '🏠', type: 'Kontrakan', status: 'Tersedia',
    title: 'Rumah 2 Kamar Dekat Pasar', loc: 'Ds. Sukamaju', price: 'Rp 1,2 Jt/bulan',
    features: ['2 Kamar', '1 KM', 'Carport']
  },
  { 
    id: 2, emoji: '🏡', type: 'Dijual', status: 'Nego',
    title: 'Rumah Minimalis SHM', loc: 'Ds. Cinta Damai', price: 'Rp 350 Jt',
    features: ['3 Kamar', '2 KM', 'LT 90m²']
  },
  { 
    id: 3, emoji: '🛏️', type: 'Kos Putri', status: 'Sisa 2',
    title: 'Kos Nyaman Dekat Kampus', loc: 'Ds. Mulyasari', price: 'Rp 600 Rb/bulan',
    features: ['AC', 'WiFi', 'K.Dalam']
  },
  { 
    id: 4, emoji: '🌾', type: 'Tanah Dijual', status: 'Cash',
    title: 'Tanah Datar Cocok Usaha', loc: 'Jl. Raya Kec.', price: 'Rp 500 Jt',
    features: ['200 m²', 'SHM', 'Strategis']
  },
];

const dataPendidikan = [
  { 
    id: 1, emoji: '📚', type: 'Bimbel',
    name: 'Bimbel Cerdas Bersama',
    desc: 'Bimbingan belajar SD-SMA. Metode privat & kelompok, tutor berpengalaman.'
  },
  { 
    id: 2, emoji: '🕌', type: 'TPQ / Madrasah',
    name: 'TPQ Al-Hidayah',
    desc: 'Belajar mengaji, tahfidz Al-Qur\'an, dan pendidikan akhlak untuk anak-anak.'
  },
  { 
    id: 3, emoji: '💻', type: 'Kursus Skill',
    name: 'Kursus Komputer Cepat',
    desc: 'Kursus Office, desain grafis, dan digital marketing. Sertifikat resmi.'
  },
  { 
    id: 4, emoji: '🎨', type: 'Sanggar Seni',
    name: 'Sanggar Kreasi Anak',
    desc: 'Kelas melukis, menari, dan musik untuk anak usia dini hingga remaja.'
  },
];

const dataWifi = [
  { 
    name: 'Basic', speed: '10', price: '150.000',
    features: ['Unlimited Kuota', 'Sharing Stabil', 'Support Chat WA'],
    popular: false
  },
  { 
    name: 'Standar', speed: '20', price: '200.000',
    features: ['Unlimited Kuota', 'Cocok 3-5 Device', 'Gratis Instalasi', 'Router Include'],
    popular: true
  },
  { 
    name: 'Premium', speed: '50', price: '300.000',
    features: ['Unlimited Kuota', 'Dedicated Line', 'Gratis Instalasi', 'Support Prioritas'],
    popular: false
  },
];


// ============ RENDER GRID ============
function renderPasar() {
  const grid = document.getElementById('pasarGrid');
  grid.innerHTML = dataPasar.map(p => `
    <div class="product-card">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-vendor">${p.vendor}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
        <button class="btn-add" onclick="addToCart(${p.id})">
          <i class="fas fa-plus"></i> Tambah
        </button>
      </div>
    </div>
  `).join('');
}

function renderProperty() {
  const grid = document.getElementById('propertyGrid');
  grid.innerHTML = dataProperty.map(p => `
    <div class="property-card">
      <div class="property-img">
        ${p.emoji}
        <span class="property-status">${p.status}</span>
      </div>
      <div class="property-info">
        <div class="property-type">${p.type}</div>
        <div class="property-title">${p.title}</div>
        <div class="property-loc"><i class="fas fa-map-marker-alt"></i> ${p.loc}</div>
        <div class="property-price">${p.price}</div>
        <div class="property-features">
          ${p.features.map(f => `<span><i class="fas fa-check-circle"></i>${f}</span>`).join('')}
        </div>
        <a href="https://wa.me/${CS_WA}?text=${encodeURIComponent(`Halo CS, saya tertarik dengan ${p.type}: "${p.title}" (${p.loc}) - ${p.price}. Mohon info lebih lanjut.`)}" 
           target="_blank" class="btn-property">
          <i class="fab fa-whatsapp"></i> Tanya CS
        </a>
      </div>
    </div>
  `).join('');
}

function renderEdu() {
  const grid = document.getElementById('eduGrid');
  grid.innerHTML = dataPendidikan.map(e => `
    <div class="edu-card">
      <div class="edu-icon">${e.emoji}</div>
      <div class="edu-info">
        <div class="edu-type">${e.type}</div>
        <div class="edu-name">${e.name}</div>
        <div class="edu-desc">${e.desc}</div>
        <a href="https://wa.me/${CS_WA}?text=${encodeURIComponent(`Halo CS, saya ingin daftar / info lebih lanjut mengenai ${e.type}: "${e.name}".`)}" 
           target="_blank" class="btn-edu">
          <i class="fab fa-whatsapp"></i> Daftar / Info
        </a>
      </div>
    </div>
  `).join('');
}

function renderWifi() {
  const grid = document.getElementById('wifiGrid');
  grid.innerHTML = dataWifi.map(w => `
    <div class="wifi-card ${w.popular ? 'popular' : ''}">
      <div class="wifi-name">Paket ${w.name}</div>
      <div class="wifi-speed">${w.speed}</div>
      <div class="wifi-unit">Mbps</div>
      <div class="wifi-price">Rp ${w.price} <small>/bulan</small></div>
      <ul class="wifi-list">
        ${w.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}


// ============ NAVIGASI KATEGORI ============
function showCategory(cat) {
  document.querySelectorAll('.cat-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`cat-${cat}`).classList.add('active');
  
  document.querySelectorAll('.menu-card').forEach(m => m.classList.remove('active'));
  event.currentTarget.classList.add('active');
  
  setTimeout(() => {
    document.getElementById('contentArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}


// ============ CART SYSTEM ============
let cart = [];

function addToCart(id) {
  const product = dataPasar.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  
  updateCartUI();
  showToast(`✓ ${product.name} ditambahkan!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCartUI();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + (c.price * c.qty), 0);
  
  document.getElementById('cartBadge').textContent = totalItems;
  document.getElementById('cartTotal').textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
  
  const cartBody = document.getElementById('cartBody');
  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-basket"></i>
        <p>Keranjang belanja masih kosong</p>
      </div>
    `;
    return;
  }
  
  cartBody.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-img">${c.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-vendor">${c.vendor}</div>
        <div class="cart-item-price">Rp ${(c.price * c.qty).toLocaleString('id-ID')}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
          <span class="qty-num">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${c.id})" title="Hapus">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}


// ============ CART DRAWER (dgn Auto-Hide FAB WA) ============
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
  document.body.classList.add('cart-open'); // Menyembunyikan WA
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
  document.body.classList.remove('cart-open'); // Menampilkan WA kembali
  document.body.style.overflow = 'auto';
}


// ============ CHECKOUT VIA WA ============
function checkoutWA() {
  if (cart.length === 0) {
    showToast('⚠️ Keranjang masih kosong!');
    return;
  }
  
  let msg = `*🛒 PESANAN BARU - PortalWarga*\n\n`;
  msg += `Halo CS, saya ingin memesan:\n\n`;
  
  cart.forEach((c, i) => {
    msg += `${i + 1}. ${c.name}\n`;
    msg += `   Toko: ${c.vendor}\n`;
    msg += `   ${c.qty} x Rp ${c.price.toLocaleString('id-ID')} = *Rp ${(c.price * c.qty).toLocaleString('id-ID')}*\n\n`;
  });
  
  const total = cart.reduce((sum, c) => sum + (c.price * c.qty), 0);
  msg += `━━━━━━━━━━━━━\n`;
  msg += `*TOTAL: Rp ${total.toLocaleString('id-ID')}*\n`;
  msg += `_(Belum termasuk ongkir)_\n\n`;
  msg += `📍 Alamat: _(mohon dikirim setelah ini)_\n`;
  msg += `Terima kasih! 🙏`;
  
  const url = `https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}


// ============ SUBMIT WIFI FORM ============
function submitWifi(e) {
  e.preventDefault();
  
  const nama = document.getElementById('wifiNama').value;
  const wa = document.getElementById('wifiWa').value;
  const alamat = document.getElementById('wifiAlamat').value;
  const paket = document.getElementById('wifiPaket').value;
  
  let msg = `*📡 PENDAFTARAN WIFI - PortalWarga*\n\n`;
  msg += `👤 Nama: ${nama}\n`;
  msg += `📱 WhatsApp: ${wa}\n`;
  msg += `📍 Alamat: ${alamat}\n`;
  msg += `📦 Paket: ${paket}\n\n`;
  msg += `Mohon segera dijadwalkan survei lokasi. Terima kasih! 🙏`;
  
  const url = `https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  
  showToast('✓ Formulir dikirim ke CS!');
  document.getElementById('wifiForm').reset();
}


// ============ TOAST ============
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}


// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderPasar();
  renderProperty();
  renderEdu();
  renderWifi();
  updateCartUI();
  
  // Set default active menu
  document.querySelector('.menu-pasar').classList.add('active');
});