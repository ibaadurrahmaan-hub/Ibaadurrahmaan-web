// ═══════════════════════════════════════════════════════════════
// FIREBASE CONFIG — Ibaadurrahmaan Web Designer
// Cloud Firestore — Project: ibaadurrahmaan-web
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyCYRygFt6uwCUiL_6-eoJHhUdkiumSwLzY",
  authDomain:        "ibaadurrahmaan-web.firebaseapp.com",
  projectId:         "ibaadurrahmaan-web",
  storageBucket:     "ibaadurrahmaan-web.firebasestorage.app",
  messagingSenderId: "1066409450927",
  appId:             "1:1066409450927:web:3497135ea3a2c4ef77e35a",
  measurementId:     "G-ZJP1W4P2P8"
};

// ── Initialize ──────────────────────────────────────────────────
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ═══════════════════════════════════════════════════════════════
// COMMISSION CONFIG
// ═══════════════════════════════════════════════════════════════
const COMMISSION_CONFIG = {

  // Paket harga & base komisi
  rates: {
    hemat:   { name: 'Paket Hemat',    price: 1500000, commission: 10 },
    reguler: { name: 'Paket Reguler',  price: 2500000, commission: 12 },
    premium: { name: 'Paket Premium',  price: 5000000, commission: 15 },
    custom:  { name: 'Custom Project', price: 0,       commission: 10 }
  },

  // Bonus % komisi berdasarkan tier reseller
  tierBonus: {
    silver:   0,  // base rate saja
    gold:     2,  // +2%
    platinum: 5,  // +5%
    diamond:  8   // +8%
  },

  // Label & warna status order
  orderStatus: {
    pending:     { label: 'Pending',    color: '#EAB308' },
    in_progress: { label: 'Dikerjakan', color: '#3B82F6' },
    completed:   { label: 'Selesai',    color: '#8B5CF6' },
    cancelled:   { label: 'Batal',      color: '#EF4444' }
  },

  // Label & warna status pembayaran client
  paymentStatus: {
    pending:      { label: 'Belum Bayar', color: '#EAB308' },
    paid_partial: { label: 'DP Dibayar',  color: '#F97316' },
    paid_full:    { label: 'Lunas',       color: '#22C55E' }
  },

  // Label & warna status komisi reseller
  commissionStatus: {
    pending:   { label: 'Belum Cair',    color: '#EAB308' },
    eligible:  { label: 'Siap Cair',     color: '#3B82F6' },
    paid:      { label: 'Sudah Dibayar', color: '#22C55E' },
    cancelled: { label: 'Dibatalkan',    color: '#EF4444' }
  }
};

// ═══════════════════════════════════════════════════════════════
// ADMIN CONFIG
// ═══════════════════════════════════════════════════════════════
const ADMIN_CONFIG = {
  phone: '6281401643188',
  email: 'ibadurrohman1428@gmail.com'
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════
const Utils = {

  // Format angka → Rupiah
  formatCurrency(num) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num || 0);
  },

  // Format angka singkat: 1500000 → "1.5 Jt"
  formatShort(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + ' Jt';
    if (num >= 1000)    return (num / 1000).toFixed(0) + 'K';
    return String(num);
  },

  // Format Firestore Timestamp → tanggal singkat
  formatDate(ts) {
    if (!ts) return '-';
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  },

  // Format Firestore Timestamp → tanggal + jam
  formatDateTime(ts) {
    if (!ts) return '-';
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  // Generate ID order unik: ORD-250115-A1B2
  generateOrderId() {
    const d   = new Date();
    const y   = String(d.getFullYear()).slice(-2);
    const m   = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${y}${m}${day}-${rnd}`;
  },

  // Key bulan untuk grouping komisi: "2025-01"
  getMonthKey(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  },

  // "2025-01" → "Januari 2025"
  getMonthLabel(monthKey) {
    if (!monthKey) return '-';
    const [y, m] = monthKey.split('-');
    const months = [
      '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${months[parseInt(m)]} ${y}`;
  },

  // Hitung nominal komisi (sudah include tier bonus)
  calcCommission(paket, tier = 'silver', customPrice = 0) {
    const cfg = COMMISSION_CONFIG.rates[paket];
    if (!cfg) return 0;
    const price    = paket === 'custom' ? (customPrice || 0) : cfg.price;
    const baseRate = cfg.commission;
    const bonus    = COMMISSION_CONFIG.tierBonus[tier] || 0;
    return Math.round(price * (baseRate + bonus) / 100);
  },

  // Ambil total % komisi (base + tier bonus)
  getCommissionRate(paket, tier = 'silver') {
    const cfg = COMMISSION_CONFIG.rates[paket];
    if (!cfg) return 0;
    return cfg.commission + (COMMISSION_CONFIG.tierBonus[tier] || 0);
  },

  // Buat URL WhatsApp
  buildWaUrl(phone, message) {
    const clean     = phone.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
  },

  // Toast notification
  showToast(message, type = 'success') {
    const colors = { success: '#065F46', error: '#7F1D1D', info: '#1E3A5F', warning: '#78350F' };
    const icons  = { success: 'check-circle', error: 'times-circle', info: 'info-circle', warning: 'exclamation-triangle' };

    // Inject keyframe sekali saja
    if (!document.getElementById('toast-style')) {
      const s = document.createElement('style');
      s.id          = 'toast-style';
      s.textContent = `
        @keyframes toastIn  { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes toastOut { from { opacity:1; } to { opacity:0; } }
      `;
      document.head.appendChild(s);
    }

    const toast = document.createElement('div');
    toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i> ${message}`;
    toast.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      background:${colors[type] || colors.info}; color:#fff;
      padding:14px 24px; border-radius:12px; font-size:.88rem; font-weight:600;
      z-index:99999; display:flex; align-items:center; gap:10px;
      box-shadow:0 10px 40px rgba(0,0,0,.5); animation:toastIn .3s ease;
      font-family:'Inter',sans-serif; max-width:90%;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut .3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// ═══════════════════════════════════════════════════════════════
// DATABASE HELPERS (Firestore)
// ═══════════════════════════════════════════════════════════════
const DB = {

  // ── RESELLER ────────────────────────────────────────────────

  /**
   * Cari reseller aktif berdasarkan resellerCode
   * Cocok dengan struktur data Anda: field "resellerCode" & "status"
   */
  async getResellerByCode(code) {
    try {
      const snap = await db.collection('resellers')
        .where('resellerCode', '==', code)
        .where('status', '==', 'active')
        .limit(1)
        .get();

      if (snap.empty) return null;
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (err) {
      console.error('[DB.getResellerByCode]', err);
      return null;
    }
  },

  /**
   * Ambil reseller berdasarkan document ID
   */
  async getReseller(id) {
    try {
      const doc = await db.collection('resellers').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (err) {
      console.error('[DB.getReseller]', err);
      return null;
    }
  },

  /**
   * Ambil semua reseller (untuk admin dashboard)
   */
  async getAllResellers() {
    try {
      const snap = await db.collection('resellers')
        .orderBy('timestamp', 'desc')
        .get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('[DB.getAllResellers]', err);
      return [];
    }
  },

  // ── ORDER ────────────────────────────────────────────────────

  /**
   * Ambil satu order berdasarkan orderId
   */
  async getOrder(orderId) {
    try {
      const doc = await db.collection('orders').doc(orderId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (err) {
      console.error('[DB.getOrder]', err);
      return null;
    }
  },

  /**
   * Ambil semua order (untuk admin)
   */
  async getAllOrders() {
    try {
      const snap = await db.collection('orders')
        .orderBy('createdAt', 'desc')
        .get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('[DB.getAllOrders]', err);
      return [];
    }
  },

  // ── CORE: PROSES ORDER BARU ──────────────────────────────────

  /**
   * Simpan order baru + buat entri komisi + update stats reseller
   * Menggunakan batch write → atomic (semua berhasil atau semua gagal)
   *
   * @param {Object} orderData - Data order lengkap
   * @returns {string} orderId
   */
  async processNewOrder(orderData) {
    const batch = db.batch();
    const now   = firebase.firestore.FieldValue.serverTimestamp();

    // 1. Simpan order ke collection "orders"
    const orderRef = db.collection('orders').doc(orderData.orderId);
    batch.set(orderRef, {
      ...orderData,
      createdAt: now,
      updatedAt: now
    });

    // 2. Jika ada referral reseller → buat komisi + update stats
    if (orderData.referral) {
      const { resellerId, commissionAmount } = orderData.referral;

      // 2a. Dokumen komisi di subcollection resellers/{id}/commissions/{orderId}
      const commRef = db.collection('resellers').doc(resellerId)
        .collection('commissions').doc(orderData.orderId);

      batch.set(commRef, {
        orderId:          orderData.orderId,
        resellerId,
        resellerName:     orderData.referral.resellerName,
        resellerCode:     orderData.referral.referralCode,
        clientName:       orderData.client.name,
        clientPhone:      orderData.client.phone,
        paket:            orderData.project.paket,
        paketName:        orderData.project.paketName,
        orderAmount:      orderData.project.price,
        commissionAmount,
        commissionRate:   orderData.referral.commissionRate,
        paymentSchedule:  orderData.referral.paymentSchedule,
        status:           'pending',   // pending → eligible → paid
        monthKey:         orderData.monthKey,
        createdAt:        now,
        updatedAt:        now
      });

      // 2b. Update counter di dokumen reseller
      // Catatan: field pendingKomisi/eligibleKomisi/paidKomisi
      //          akan dibuat otomatis jika belum ada (Firestore behavior)
      const resellerRef = db.collection('resellers').doc(resellerId);
      batch.update(resellerRef, {
        totalClosing:  firebase.firestore.FieldValue.increment(1),
        totalKomisi:   firebase.firestore.FieldValue.increment(commissionAmount),
        pendingKomisi: firebase.firestore.FieldValue.increment(commissionAmount),
        lastOrderAt:   now,
        updatedAt:     now
      });
    }

    await batch.commit();
    return orderData.orderId;
  },

  // ── CORE: UPDATE STATUS ORDER (Admin) ────────────────────────

  /**
   * Update status order + otomatis kelola status komisi
   *
   * Flow komisi:
   *   pending → eligible  : saat client LUNAS
   *   pending/eligible → cancelled : saat order DIBATALKAN
   *   eligible → paid     : via markCommissionPaid()
   *
   * @param {Object} order           - Data order saat ini (dari Firestore)
   * @param {string} newOrderStatus  - Status order baru
   * @param {string} newPaymentStatus - Status bayar baru
   * @param {number} dpAmount        - Nominal DP (opsional)
   */
  async processOrderStatusChange(order, newOrderStatus, newPaymentStatus, dpAmount = 0) {
    const batch = db.batch();
    const now   = firebase.firestore.FieldValue.serverTimestamp();

    const orderRef = db.collection('orders').doc(order.orderId);

    // -- Update order --
    const orderUpdate = {
      status:           newOrderStatus,
      'payment.status': newPaymentStatus,
      'payment.dpAmount': dpAmount,
      updatedAt:        now
    };

    if (newPaymentStatus === 'paid_full') {
      orderUpdate['payment.paidAmount'] = order.project?.price || 0;
      orderUpdate['payment.paidAt']     = now;
    }

    batch.update(orderRef, orderUpdate);

    // -- Update komisi jika ada referral --
    if (order.referral) {
      const { resellerId, commissionAmount } = order.referral;
      const oldCommStatus = order.referral.commissionStatus || 'pending';

      const resellerRef = db.collection('resellers').doc(resellerId);
      const commRef     = db.collection('resellers').doc(resellerId)
        .collection('commissions').doc(order.orderId);

      let newCommStatus = oldCommStatus; // default: tidak berubah

      // KASUS 1: Client LUNAS → komisi jadi "eligible" (siap cair)
      if (newPaymentStatus === 'paid_full' && oldCommStatus === 'pending') {
        newCommStatus = 'eligible';

        batch.update(resellerRef, {
          pendingKomisi:  firebase.firestore.FieldValue.increment(-commissionAmount),
          eligibleKomisi: firebase.firestore.FieldValue.increment(commissionAmount),
          updatedAt:      now
        });
      }

      // KASUS 2: Order DIBATALKAN → batalkan komisi
      if (
        newOrderStatus === 'cancelled' &&
        oldCommStatus !== 'cancelled' &&
        oldCommStatus !== 'paid'  // komisi yang sudah dibayar tidak bisa dibatalkan
      ) {
        newCommStatus = 'cancelled';

        const resellerUpdates = {
          totalClosing: firebase.firestore.FieldValue.increment(-1),
          totalKomisi:  firebase.firestore.FieldValue.increment(-commissionAmount),
          updatedAt:    now
        };

        // Kurangi dari bucket yang sesuai
        if (oldCommStatus === 'pending') {
          resellerUpdates.pendingKomisi = firebase.firestore.FieldValue.increment(-commissionAmount);
        } else if (oldCommStatus === 'eligible') {
          resellerUpdates.eligibleKomisi = firebase.firestore.FieldValue.increment(-commissionAmount);
        }

        batch.update(resellerRef, resellerUpdates);
      }

      // Simpan perubahan status komisi
      if (newCommStatus !== oldCommStatus) {
        batch.update(commRef, { status: newCommStatus, updatedAt: now });
        batch.update(orderRef, { 'referral.commissionStatus': newCommStatus });
      }
    }

    await batch.commit();
  },

  // ── CORE: BAYAR KOMISI (Admin) ───────────────────────────────

  /**
   * Tandai satu komisi sebagai sudah dibayar
   * Hanya bisa jika status komisi = "eligible"
   *
   * @param {string} resellerId
   * @param {string} orderId
   */
  async markCommissionPaid(resellerId, orderId) {
    const commRef  = db.collection('resellers').doc(resellerId)
      .collection('commissions').doc(orderId);
    const commSnap = await commRef.get();

    if (!commSnap.exists) {
      throw new Error(`Komisi ${orderId} tidak ditemukan`);
    }

    const comm = commSnap.data();

    if (comm.status !== 'eligible') {
      throw new Error(`Komisi berstatus "${comm.status}", bukan "eligible"`);
    }

    const batch = db.batch();
    const now   = firebase.firestore.FieldValue.serverTimestamp();

    batch.update(commRef, {
      status:    'paid',
      paidAt:    now,
      updatedAt: now
    });

    batch.update(db.collection('orders').doc(orderId), {
      'referral.commissionStatus': 'paid',
      updatedAt: now
    });

    batch.update(db.collection('resellers').doc(resellerId), {
      eligibleKomisi: firebase.firestore.FieldValue.increment(-comm.commissionAmount),
      paidKomisi:     firebase.firestore.FieldValue.increment(comm.commissionAmount),
      updatedAt:      now
    });

    await batch.commit();
  },

  /**
   * Bayar semua komisi "eligible" milik satu reseller di bulan tertentu
   *
   * @param {string} resellerId
   * @param {string} monthKey  - Format "2025-01"
   * @returns {number} jumlah komisi yang dibayar
   */
  async bulkPayMonthlyCommissions(resellerId, monthKey) {
    const snap = await db.collection('resellers').doc(resellerId)
      .collection('commissions')
      .where('monthKey', '==', monthKey)
      .where('status', '==', 'eligible')
      .get();

    if (snap.empty) return 0;

    // Proses satu per satu (setiap markCommissionPaid sudah atomic)
    for (const doc of snap.docs) {
      await DB.markCommissionPaid(resellerId, doc.id);
    }

    return snap.size;
  },

  // ── READ: KOMISI RESELLER ────────────────────────────────────

  /**
   * Ambil semua komisi milik satu reseller (one-time fetch)
   */
  async getResellerCommissions(resellerId) {
    try {
      const snap = await db.collection('resellers').doc(resellerId)
        .collection('commissions')
        .orderBy('createdAt', 'desc')
        .get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('[DB.getResellerCommissions]', err);
      return [];
    }
  },

  // ── REAL-TIME LISTENERS ──────────────────────────────────────

  /**
   * Listen perubahan komisi reseller secara real-time
   * @returns {Function} unsubscribe function
   */
  listenResellerCommissions(resellerId, callback) {
    return db.collection('resellers').doc(resellerId)
      .collection('commissions')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      }, err => console.error('[listenResellerCommissions]', err));
  },

  /**
   * Listen semua order secara real-time (untuk admin dashboard)
   * @returns {Function} unsubscribe function
   */
  listenAllOrders(callback) {
    return db.collection('orders')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      }, err => console.error('[listenAllOrders]', err));
  },

  /**
   * Listen semua komisi dari semua reseller (collection group query)
   * Butuh index: Firebase Console → Firestore → Indexes → Collection Group
   * @returns {Function} unsubscribe function
   */
  listenAllCommissions(callback) {
    return db.collectionGroup('commissions')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      }, err => console.error('[listenAllCommissions]', err));
  }
};

// ── Sanity check ────────────────────────────────────────────────
console.log('%c🔥 Firestore Ready', 'color:#F59E0B;font-weight:bold', '— ibaadurrahmaan-web');