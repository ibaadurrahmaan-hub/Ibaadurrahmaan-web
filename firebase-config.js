// ═══════════════════════════════════════════════════
// FIREBASE CONFIG — Ibaadurrahmaan Web Designer
// Shared across: order.html, dashboard-reseller.html,
//                dashboard-admin.html, dashboard-slip.html
// ═══════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyCYRygFt6uwCUiL_6-eoJHhUdkiumSwLzY",
  authDomain: "ibaadurrahmaan-web.firebaseapp.com",
  databaseURL: "https://ibaadurrahmaan-web-default-rtdb.firebaseio.com",
  projectId: "ibaadurrahmaan-web",
  storageBucket: "ibaadurrahmaan-web.firebasestorage.app",
  messagingSenderId: "1066409450927",
  appId: "1:1066409450927:web:3497135ea3a2c4ef77e35a",
  measurementId: "G-ZJP1W4P2P8"
};

// Initialize Firebase (compat mode for static hosting)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ═══════════════════════════════════════════════════
// COMMISSION CONFIG
// ═══════════════════════════════════════════════════
const COMMISSION_CONFIG = {
  rates: {
    hemat:   { name: 'Paket Hemat',   price: 1500000, commission: 10 },
    reguler: { name: 'Paket Reguler', price: 2500000, commission: 12 },
    premium: { name: 'Paket Premium', price: 5000000, commission: 15 },
    custom:  { name: 'Custom Project', price: 0,       commission: 10 }
  },
  orderStatus: {
    pending:      { label: 'Pending',     color: '#EAB308', icon: 'clock'          },
    in_progress:  { label: 'Dikerjakan',  color: '#3B82F6', icon: 'code'           },
    completed:    { label: 'Selesai',     color: '#8B5CF6', icon: 'check-circle'   },
    paid_partial: { label: 'DP Dibayar',  color: '#F97316', icon: 'credit-card'    },
    paid_full:    { label: 'Lunas',       color: '#22C55E', icon: 'check-double'   },
    cancelled:    { label: 'Batal',       color: '#EF4444', icon: 'times-circle'   }
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
  email: 'ibadurrohman1428@gmail.com',
  // Simple admin password (for demo — use Firebase Auth for production)
  adminKey: 'admin2025'
};

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════
const Utils = {

  // Format Rupiah
  formatCurrency(num) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num || 0);
  },

  // Format short currency (1.5jt, 2.5jt)
  formatShort(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + ' Jt';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  },

  // Format date
  formatDate(ts) {
    if (!ts) return '-';
    return new Date(ts).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  },

  // Format date + time
  formatDateTime(ts) {
    if (!ts) return '-';
    return new Date(ts).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  // Generate Order ID: ORD-250115-A1B2
  generateOrderId() {
    const d = new Date();
    const y = String(d.getFullYear()).slice(-2);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${y}${m}${day}-${rand}`;
  },

  // Generate Reseller Code: RES-NAMAXX
  generateResellerCode(name) {
    const clean = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6);
    const rand = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    return `RES-${clean}${rand}`;
  },

  // Calculate commission amount
  calcCommission(paket, customPrice = 0) {
    const cfg = COMMISSION_CONFIG.rates[paket];
    if (!cfg) return 0;
    const price = paket === 'custom' ? (customPrice || 0) : cfg.price;
    return Math.round(price * cfg.commission / 100);
  },

  // Get month key: "2025-01"
  getMonthKey(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  },

  // Get month label: "Januari 2025"
  getMonthLabel(monthKey) {
    if (!monthKey) return '-';
    const [y, m] = monthKey.split('-');
    const months = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${months[parseInt(m)]} ${y}`;
  },

  // Build WhatsApp URL
  buildWaUrl(phone, message) {
    const clean = phone.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
  },

  // Build admin WA notification
  buildAdminNotification(order) {
    const ref = order.referral;
    let msg = `🆕 *ORDER BARU!*\n\n`;
    msg += `📋 *${order.orderId}*\n`;
    msg += `📅 ${Utils.formatDateTime(order.createdAt)}\n\n`;
    msg += `👤 *Client:*\n`;
    msg += `• ${order.client.name}\n`;
    msg += `• WA: ${order.client.phone}\n`;
    msg += `• ${order.client.businessName}\n\n`;
    msg += `📦 *Project:*\n`;
    msg += `• ${order.project.paketName}\n`;
    msg += `• ${Utils.formatCurrency(order.project.price)}\n\n`;
    if (ref) {
      msg += `🎁 *Referral:*\n`;
      msg += `• ${ref.resellerName} (${ref.referralCode})\n`;
      msg += `• Komisi: ${Utils.formatCurrency(ref.commissionAmount)} (${ref.commissionRate}%)\n`;
      msg += `• Bayar: ${ref.paymentSchedule === 'monthly' ? 'Bulanan' : 'Per Closing'}\n\n`;
    }
    msg += `───────────────\n_Otomatis dari Order System_`;
    return msg;
  },

  // Show toast notification
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i> ${message}`;
    toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${type === 'success' ? '#065F46' : type === 'error' ? '#7F1D1D' : '#1E3A5F'};color:#fff;padding:14px 24px;border-radius:12px;font-size:.88rem;font-weight:600;z-index:99999;display:flex;align-items:center;gap:10px;box-shadow:0 10px 40px rgba(0,0,0,0.5);animation:toastIn .3s ease;font-family:'Inter',sans-serif;max-width:90%;`;
    const style = document.createElement('style');
    style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(style);
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3000);
  },

  // Debounce
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
  }
};

// ═══════════════════════════════════════════════════
// DATABASE HELPER FUNCTIONS
// ═══════════════════════════════════════════════════
const DB = {

  // ── RESELLER ──
  async getResellerByCode(code) {
    const snap = await db.ref('resellers').orderByChild('referralCode').equalTo(code).once('value');
    if (!snap.exists()) return null;
    const data = snap.val();
    const id = Object.keys(data)[0];
    return { id, ...data[id] };
  },

  async getReseller(id) {
    const snap = await db.ref(`resellers/${id}`).once('value');
    return snap.exists() ? { id, ...snap.val() } : null;
  },

  // ── ORDER ──
  async createOrder(orderData) {
    await db.ref(`orders/${orderData.orderId}`).set(orderData);
    return orderData.orderId;
  },

  async updateOrder(orderId, updates) {
    updates.updatedAt = Date.now();
    await db.ref(`orders/${orderId}`).update(updates);
  },

  // ── COMMISSION ──
  async createCommission(resellerId, orderId, commData) {
    const updates = {};
    updates[`commissions/${resellerId}/${orderId}`] = commData;
    updates[`commissions_monthly/${resellerId}/${commData.monthKey}/${orderId}`] = commData;
    await db.ref().update(updates);
  },

  async updateCommissionStatus(resellerId, orderId, monthKey, newStatus) {
    const updates = {};
    updates[`commissions/${resellerId}/${orderId}/status`] = newStatus;
    updates[`commissions/${resellerId}/${orderId}/updatedAt`] = Date.now();
    if (monthKey) {
      updates[`commissions_monthly/${resellerId}/${monthKey}/${orderId}/status`] = newStatus;
    }
    await db.ref().update(updates);
  },

  async updateResellerStats(resellerId, statUpdates) {
    await db.ref(`resellers/${resellerId}/stats`).update(statUpdates);
  },

  async getResellerStats(resellerId) {
    const snap = await db.ref(`resellers/${resellerId}/stats`).once('value');
    return snap.val() || {
      totalOrders: 0,
      totalCommission: 0,
      pendingCommission: 0,
      eligibleCommission: 0,
      paidCommission: 0,
      lastOrderDate: null
    };
  },

  // ── PROCESS ORDER + COMMISSION TOGETHER ──
  async processNewOrder(orderData) {
    const updates = {};
    const now = Date.now();

    // 1. Save order
    updates[`orders/${orderData.orderId}`] = orderData;

    // 2. If has referral, save commission
    if (orderData.referral) {
      const rid = orderData.referral.resellerId;
      const oid = orderData.orderId;
      const comm = {
        orderId: oid,
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

      updates[`commissions/${rid}/${oid}`] = comm;
      updates[`commissions_monthly/${rid}/${orderData.monthKey}/${oid}`] = comm;

      // Update reseller stats
      const stats = await DB.getResellerStats(rid);
      updates[`resellers/${rid}/stats`] = {
        totalOrders: (stats.totalOrders || 0) + 1,
        totalCommission: (stats.totalCommission || 0) + comm.commissionAmount,
        pendingCommission: (stats.pendingCommission || 0) + comm.commissionAmount,
        eligibleCommission: stats.eligibleCommission || 0,
        paidCommission: stats.paidCommission || 0,
        lastOrderDate: now
      };
    }

    // Atomic write
    await db.ref().update(updates);
    return orderData.orderId;
  },

  // ── PROCESS STATUS CHANGE (admin) ──
  async processOrderStatusChange(order, newOrderStatus, newPaymentStatus, dpAmount) {
    const updates = {};
    const now = Date.now();
    const oid = order.orderId;

    // Update order
    updates[`orders/${oid}/status`] = newOrderStatus;
    updates[`orders/${oid}/payment/status`] = newPaymentStatus;
    updates[`orders/${oid}/payment/dpAmount`] = dpAmount || 0;
    updates[`orders/${oid}/updatedAt`] = now;

    if (newPaymentStatus === 'paid_full') {
      updates[`orders/${oid}/payment/paidAmount`] = order.project?.price || 0;
      updates[`orders/${oid}/payment/paidAt`] = now;
    }

    // Handle commission changes
    if (order.referral) {
      const rid = order.referral.resellerId;
      const commAmt = order.referral.commissionAmount;
      const oldCommStatus = order.referral.commissionStatus || 'pending';
      const mk = order.monthKey;
      let newCommStatus = oldCommStatus;

      // Client pays full → commission eligible
      if (newPaymentStatus === 'paid_full' && oldCommStatus === 'pending') {
        newCommStatus = 'eligible';
        const stats = await DB.getResellerStats(rid);
        updates[`resellers/${rid}/stats/pendingCommission`] = Math.max(0, (stats.pendingCommission || 0) - commAmt);
        updates[`resellers/${rid}/stats/eligibleCommission`] = (stats.eligibleCommission || 0) + commAmt;
      }

      // Order cancelled → remove commission
      if (newOrderStatus === 'cancelled' && oldCommStatus !== 'cancelled' && oldCommStatus !== 'paid') {
        newCommStatus = 'cancelled';
        const stats = await DB.getResellerStats(rid);
        updates[`resellers/${rid}/stats/totalOrders`] = Math.max(0, (stats.totalOrders || 0) - 1);
        updates[`resellers/${rid}/stats/totalCommission`] = Math.max(0, (stats.totalCommission || 0) - commAmt);
        if (oldCommStatus === 'pending') {
          updates[`resellers/${rid}/stats/pendingCommission`] = Math.max(0, (stats.pendingCommission || 0) - commAmt);
        } else if (oldCommStatus === 'eligible') {
          updates[`resellers/${rid}/stats/eligibleCommission`] = Math.max(0, (stats.eligibleCommission || 0) - commAmt);
        }
      }

      updates[`orders/${oid}/referral/commissionStatus`] = newCommStatus;
      updates[`commissions/${rid}/${oid}/status`] = newCommStatus;
      updates[`commissions/${rid}/${oid}/updatedAt`] = now;
      if (mk) {
        updates[`commissions_monthly/${rid}/${mk}/${oid}/status`] = newCommStatus;
      }
    }

    await db.ref().update(updates);
  },

  // ── MARK COMMISSION AS PAID ──
  async markCommissionPaid(resellerId, orderId, monthKey) {
    const updates = {};
    const now = Date.now();

    // Get commission data first
    const commSnap = await db.ref(`commissions/${resellerId}/${orderId}`).once('value');
    if (!commSnap.exists()) return;
    const comm = commSnap.val();

    if (comm.status !== 'eligible') return; // Can only pay eligible commissions

    updates[`commissions/${resellerId}/${orderId}/status`] = 'paid';
    updates[`commissions/${resellerId}/${orderId}/paidAt`] = now;
    updates[`orders/${orderId}/referral/commissionStatus`] = 'paid';

    if (monthKey) {
      updates[`commissions_monthly/${resellerId}/${monthKey}/${orderId}/status`] = 'paid';
      updates[`commissions_monthly/${resellerId}/${monthKey}/${orderId}/paidAt`] = now;
    }

    const stats = await DB.getResellerStats(resellerId);
    updates[`resellers/${resellerId}/stats/eligibleCommission`] = Math.max(0, (stats.eligibleCommission || 0) - comm.commissionAmount);
    updates[`resellers/${resellerId}/stats/paidCommission`] = (stats.paidCommission || 0) + comm.commissionAmount;

    await db.ref().update(updates);
  },

  // ── BULK PAY MONTHLY COMMISSIONS ──
  async bulkPayMonthlyCommissions(resellerId, monthKey) {
    const snap = await db.ref(`commissions_monthly/${resellerId}/${monthKey}`).once('value');
    if (!snap.exists()) return 0;

    const entries = snap.val();
    let paidCount = 0;

    for (const [orderId, comm] of Object.entries(entries)) {
      if (comm.status === 'eligible') {
        await DB.markCommissionPaid(resellerId, orderId, monthKey);
        paidCount++;
      }
    }

    return paidCount;
  }
};

console.log('🔥 Firebase initialized: ibaadurrahmaan-web');
console.log('📊 Database connected:', firebaseConfig.databaseURL);