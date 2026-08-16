// ═══════════════════════════════════════════════════
// FIREBASE CONFIG — Ibaadurrahmaan Web Designer
// Menggunakan Cloud FIRESTORE (bukan Realtime DB)
// ═══════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyCYRygFt6uwCUiL_6-eoJHhUdkiumSwLzY",
  authDomain: "ibaadurrahmaan-web.firebaseapp.com",
  projectId: "ibaadurrahmaan-web",
  storageBucket: "ibaadurrahmaan-web.firebasestorage.app",
  messagingSenderId: "1066409450927",
  appId: "1:1066409450927:web:3497135ea3a2c4ef77e35a",
  measurementId: "G-ZJP1W4P2P8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ═══════════════════════════════════════════════════
// COMMISSION CONFIG
// ═══════════════════════════════════════════════════
const COMMISSION_CONFIG = {
  rates: {
    hemat:   { name: 'Paket Hemat',    price: 1500000, commission: 10 },
    reguler: { name: 'Paket Reguler',  price: 2500000, commission: 12 },
    premium: { name: 'Paket Premium',  price: 5000000, commission: 15 },
    custom:  { name: 'Custom Project', price: 0,       commission: 10 }
  },
  
  // Tier bonus (opsional — bonus % tambahan berdasarkan level reseller)
  tierBonus: {
    silver:   0,   // Default rate
    gold:     2,   // +2% dari base
    platinum: 5,   // +5% dari base
    diamond:  8    // +8% dari base
  },
  
  orderStatus: {
    pending:      { label: 'Pending',     color: '#EAB308' },
    in_progress:  { label: 'Dikerjakan',  color: '#3B82F6' },
    completed:    { label: 'Selesai',     color: '#8B5CF6' },
    cancelled:    { label: 'Batal',       color: '#EF4444' }
  },
  
  paymentStatus: {
    pending:      { label: 'Belum Bayar', color: '#EAB308' },
    paid_partial: { label: 'DP Dibayar',  color: '#F97316' },
    paid_full:    { label: 'Lunas',       color: '#22C55E' }
  },
  
  commissionStatus: {
    pending:   { label: 'Belum Cair',    color: '#EAB308' },
    eligible:  { label: 'Siap Cair',     color: '#3B82F6' },
    paid:      { label: 'Sudah Dibayar', color: '#22C55E' },
    cancelled: { label: 'Dibatalkan',    color: '#EF4444' }
  }
};

// ═══════════════════════════════════════════════════
// ADMIN CONFIG
// ═══════════════════════════════════════════════════
const ADMIN_CONFIG = {
  phone: '6281401643188',
  email: 'ibadurrohman1428@gmail.com'
};

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════
const Utils = {
  formatCurrency(num) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(num || 0);
  },

  formatShort(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + ' Jt';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  },

  formatDate(ts) {
    if (!ts) return '-';
    // Handle Firestore Timestamp
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  },

  formatDateTime(ts) {
    if (!ts) return '-';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  generateOrderId() {
    const d = new Date();
    const y = String(d.getFullYear()).slice(-2);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${y}${m}${day}-${rand}`;
  },

  // Calculate commission with tier bonus
  calcCommission(paket, tier = 'silver', customPrice = 0) {
    const cfg = COMMISSION_CONFIG.rates[paket];
    if (!cfg) return 0;
    const price = paket === 'custom' ? (customPrice || 0) : cfg.price;
    const baseRate = cfg.commission;
    const bonus = COMMISSION_CONFIG.tierBonus[tier] || 0;
    const totalRate = baseRate + bonus;
    return Math.round(price * totalRate / 100);
  },

  // Get commission rate with tier
  getCommissionRate(paket, tier = 'silver') {
    const cfg = COMMISSION_CONFIG.rates[paket];
    if (!cfg) return 0;
    const bonus = COMMISSION_CONFIG.tierBonus[tier] || 0;
    return cfg.commission + bonus;
  },

  getMonthKey(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  },

  getMonthLabel(monthKey) {
    if (!monthKey) return '-';
    const [y, m] = monthKey.split('-');
    const months = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${months[parseInt(m)]} ${y}`;
  },

  buildWaUrl(phone, message) {
    const clean = phone.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
  },

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const colors = { success: '#065F46', error: '#7F1D1D', info: '#1E3A5F' };
    const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle' };
    toast.innerHTML = `<i class="fas fa-${icons[type]}"></i> ${message}`;
    toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${colors[type]};color:#fff;padding:14px 24px;border-radius:12px;font-size:.88rem;font-weight:600;z-index:99999;display:flex;align-items:center;gap:10px;box-shadow:0 10px 40px rgba(0,0,0,0.5);animation:toastIn .3s ease;font-family:'Inter',sans-serif;max-width:90%;`;
    if (!document.getElementById('toast-style')) {
      const style = document.createElement('style');
      style.id = 'toast-style';
      style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
      document.head.appendChild(style);
    }
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3000);
  }
};

// ═══════════════════════════════════════════════════
// FIRESTORE DATABASE HELPERS
// ═══════════════════════════════════════════════════
const DB = {

  // ── RESELLER ──
  // Get reseller by referral code (using resellerCode field)
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
      console.error('getResellerByCode error:', err);
      return null;
    }
  },

  async getReseller(id) {
    try {
      const doc = await db.collection('resellers').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (err) {
      console.error('getReseller error:', err);
      return null;
    }
  },

  // ── ORDER ──
  async createOrder(orderData) {
    try {
      await db.collection('orders').doc(orderData.orderId).set(orderData);
      return orderData.orderId;
    } catch (err) {
      console.error('createOrder error:', err);
      throw err;
    }
  },

  async updateOrder(orderId, updates) {
    updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('orders').doc(orderId).update(updates);
  },

  async getOrder(orderId) {
    const doc = await db.collection('orders').doc(orderId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async getAllOrders() {
    const snap = await db.collection('orders').orderBy('createdAt', 'desc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // ── PROCESS NEW ORDER WITH COMMISSION ──
  async processNewOrder(orderData) {
    const batch = db.batch();
    const now = firebase.firestore.FieldValue.serverTimestamp();
    
    // 1. Create order
    const orderRef = db.collection('orders').doc(orderData.orderId);
    batch.set(orderRef, orderData);

    // 2. If has referral, create commission entry
    if (orderData.referral) {
      const rid = orderData.referral.resellerId;
      const oid = orderData.orderId;
      
      const commData = {
        orderId: oid,
        resellerId: rid,
        resellerName: orderData.referral.resellerName,
        resellerCode: orderData.referral.referralCode,
        clientName: orderData.client.name,
        clientPhone: orderData.client.phone,
        paket: orderData.project.paket,
        paketName: orderData.project.paketName,
        orderAmount: orderData.project.price,
        commissionAmount: orderData.referral.commissionAmount,
        commissionRate: orderData.referral.commissionRate,
        paymentSchedule: orderData.referral.paymentSchedule,
        status: 'pending',
        createdAt: now,
        monthKey: orderData.monthKey
      };

      // Save to commissions collection (nested under reseller)
      const commRef = db.collection('resellers').doc(rid)
        .collection('commissions').doc(oid);
      batch.set(commRef, commData);

      // Update reseller totals
      const resellerRef = db.collection('resellers').doc(rid);
      batch.update(resellerRef, {
        totalClosing: firebase.firestore.FieldValue.increment(1),
        totalKomisi: firebase.firestore.FieldValue.increment(orderData.referral.commissionAmount),
        pendingKomisi: firebase.firestore.FieldValue.increment(orderData.referral.commissionAmount),
        lastOrderAt: now,
        updatedAt: now
      });
    }

    await batch.commit();
    return orderData.orderId;
  },

  // ── UPDATE ORDER STATUS (admin) ──
  async processOrderStatusChange(order, newOrderStatus, newPaymentStatus, dpAmount) {
    const batch = db.batch();
    const now = firebase.firestore.FieldValue.serverTimestamp();
    const orderRef = db.collection('orders').doc(order.orderId);

    // Update order
    const orderUpdate = {
      status: newOrderStatus,
      'payment.status': newPaymentStatus,
      'payment.dpAmount': dpAmount || 0,
      updatedAt: now
    };

    if (newPaymentStatus === 'paid_full') {
      orderUpdate['payment.paidAmount'] = order.project?.price || 0;
      orderUpdate['payment.paidAt'] = now;
    }

    batch.update(orderRef, orderUpdate);

    // Handle commission changes if there's a referral
    if (order.referral) {
      const rid = order.referral.resellerId;
      const commAmt = order.referral.commissionAmount;
      const oldCommStatus = order.referral.commissionStatus || 'pending';
      const resellerRef = db.collection('resellers').doc(rid);
      const commRef = db.collection('resellers').doc(rid)
        .collection('commissions').doc(order.orderId);

      let newCommStatus = oldCommStatus;

      // Case 1: Client pays FULL → commission becomes ELIGIBLE
      if (newPaymentStatus === 'paid_full' && oldCommStatus === 'pending') {
        newCommStatus = 'eligible';
        batch.update(resellerRef, {
          pendingKomisi: firebase.firestore.FieldValue.increment(-commAmt),
          eligibleKomisi: firebase.firestore.FieldValue.increment(commAmt),
          updatedAt: now
        });
      }

      // Case 2: Order CANCELLED → remove commission
      if (newOrderStatus === 'cancelled' && oldCommStatus !== 'cancelled' && oldCommStatus !== 'paid') {
        newCommStatus = 'cancelled';
        const updates = {
          totalClosing: firebase.firestore.FieldValue.increment(-1),
          totalKomisi: firebase.firestore.FieldValue.increment(-commAmt),
          updatedAt: now
        };
        if (oldCommStatus === 'pending') {
          updates.pendingKomisi = firebase.firestore.FieldValue.increment(-commAmt);
        } else if (oldCommStatus === 'eligible') {
          updates.eligibleKomisi = firebase.firestore.FieldValue.increment(-commAmt);
        }
        batch.update(resellerRef, updates);
      }

      // Update commission status
      batch.update(commRef, { status: newCommStatus, updatedAt: now });
      batch.update(orderRef, { 'referral.commissionStatus': newCommStatus });
    }

    await batch.commit();
  },

  // ── MARK COMMISSION AS PAID ──
  async markCommissionPaid(resellerId, orderId) {
    const commRef = db.collection('resellers').doc(resellerId)
      .collection('commissions').doc(orderId);
    const commSnap = await commRef.get();
    
    if (!commSnap.exists) return;
    const comm = commSnap.data();
    if (comm.status !== 'eligible') return;

    const batch = db.batch();
    const now = firebase.firestore.FieldValue.serverTimestamp();

    batch.update(commRef, { status: 'paid', paidAt: now });
    batch.update(db.collection('orders').doc(orderId), {
      'referral.commissionStatus': 'paid',
      updatedAt: now
    });
    batch.update(db.collection('resellers').doc(resellerId), {
      eligibleKomisi: firebase.firestore.FieldValue.increment(-comm.commissionAmount),
      paidKomisi: firebase.firestore.FieldValue.increment(comm.commissionAmount),
      updatedAt: now
    });

    await batch.commit();
  },

  // ── BULK PAY MONTHLY COMMISSIONS ──
  async bulkPayMonthlyCommissions(resellerId, monthKey) {
    const snap = await db.collection('resellers').doc(resellerId)
      .collection('commissions')
      .where('monthKey', '==', monthKey)
      .where('status', '==', 'eligible')
      .get();

    if (snap.empty) return 0;

    for (const doc of snap.docs) {
      await DB.markCommissionPaid(resellerId, doc.id);
    }

    return snap.size;
  },

  // ── GET RESELLER COMMISSIONS ──
  async getResellerCommissions(resellerId) {
    const snap = await db.collection('resellers').doc(resellerId)
      .collection('commissions')
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // ── REAL-TIME LISTENER ──
  listenResellerCommissions(resellerId, callback) {
    return db.collection('resellers').doc(resellerId)
      .collection('commissions')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      });
  },

  listenAllOrders(callback) {
    return db.collection('orders')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      });
  }
};

console.log('🔥 Firebase Firestore initialized: ibaadurrahmaan-web');
