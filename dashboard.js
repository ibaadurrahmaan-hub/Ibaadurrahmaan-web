/**
 * ============================================================
 * 📊 DASHBOARD.JS - Ibaadurrahmaan Web Designer
 * ============================================================
 * Shared JavaScript untuk dashboard.html & dashboard-reseller.html
 * 
 * Fitur Lengkap:
 * ✅ Auth Guard & Session Management
 * ✅ Firebase Firestore Integration
 * ✅ Load & Render Reseller Data
 * ✅ Approve / Reject / Deactivate / Reactivate
 * ✅ Edit Data Reseller (Full Form dengan semua field)
 * ✅ Detail View (Complete Info dengan Kode Reseller)
 * ✅ Delete Permanent (2-step confirmation)
 * ✅ Toast & Modal Notifications
 * ✅ Premium Pill-Shaped Action Buttons dengan Label
 * ============================================================
 */


// ============================================================
// 🔐 CREDENTIALS & AUTH GUARD
// ============================================================
const CREDENTIALS = {
    username: 'owner',
    password: 'ibaadurrahmaan2024'
};


/**
 * Simple hash function untuk validasi token
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36) + str.length.toString(36);
}


/**
 * Cek session, redirect ke login kalau invalid
 */
function checkAuth() {
    const session = localStorage.getItem('ibaad_session');
    
    if (!session) {
        window.location.href = 'dashboard-login.html';
        return false;
    }
    
    try {
        const data = JSON.parse(session);
        
        if (Date.now() > data.expiry) {
            localStorage.removeItem('ibaad_session');
            Swal.fire({
                icon: 'warning',
                title: 'Sesi Berakhir',
                text: 'Silakan login kembali',
                customClass: { popup: 'swal-premium' },
                confirmButtonText: 'Login Ulang',
                allowOutsideClick: false
            }).then(() => {
                window.location.href = 'dashboard-login.html';
            });
            return false;
        }
        
        const validToken = simpleHash(CREDENTIALS.username + CREDENTIALS.password);
        if (data.token !== validToken) {
            localStorage.removeItem('ibaad_session');
            window.location.href = 'dashboard-login.html';
            return false;
        }
        
        return data;
        
    } catch(e) {
        console.error('[AUTH] Error:', e);
        window.location.href = 'dashboard-login.html';
        return false;
    }
}

const session = checkAuth();


// ============================================================
// 🚪 LOGOUT
// ============================================================
function handleLogout() {
    Swal.fire({
        icon: 'question',
        title: 'Keluar Dashboard?',
        text: 'Kamu akan diarahkan ke halaman login',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-sign-out-alt"></i> Ya, Keluar',
        cancelButtonText: 'Batal',
        customClass: { popup: 'swal-premium' },
        reverseButtons: true,
        focusCancel: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Sampai Jumpa! 👋',
                text: 'Berhasil keluar dari dashboard',
                customClass: { popup: 'swal-premium' },
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {
                localStorage.removeItem('ibaad_session');
                sessionStorage.removeItem('welcomed');
                window.location.href = 'dashboard-login.html';
            });
        }
    });
}


// ============================================================
// 🚧 COMING SOON
// ============================================================
function showComingSoon(feature) {
    Swal.fire({
        icon: 'info',
        title: '🚀 Coming Soon',
        html: `Fitur <b style="color:#d4a536;">${feature}</b> sedang dalam pengembangan<br><br>
               <div style="background:rgba(212,165,54,0.1);border:1px solid rgba(212,165,54,0.2);padding:12px 16px;border-radius:10px;font-size:0.85rem;">
                   📅 <b>Target rilis:</b> Phase 2<br>
                   🎯 <b>Fitur:</b> Full CRUD + Analytics
               </div>`,
        customClass: { popup: 'swal-premium' },
        confirmButtonText: 'Oke, Mengerti'
    });
}


// ============================================================
// 📅 SET TODAY DATE & USER INFO
// ============================================================
const monthsID = ['Januari','Februari','Maret','April','Mei','Juni',
                   'Juli','Agustus','September','Oktober','November','Desember'];
const daysID = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const monthsShort = ['Jan','Feb','Mar','Apr','Mei','Jun',
                      'Jul','Ags','Sep','Okt','Nov','Des'];


function updateDate() {
    const el = document.getElementById('todayDate');
    if (!el) return;
    
    const now = new Date();
    const dayName = daysID[now.getDay()];
    const date = now.getDate();
    const month = monthsID[now.getMonth()];
    const year = now.getFullYear();
    el.textContent = `${dayName}, ${date} ${month} ${year}`;
}


if (session) {
    const username = session.username || 'Owner';
    const displayName = username.charAt(0).toUpperCase() + username.slice(1);
    
    const nameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');
    
    if (nameEl) nameEl.textContent = displayName;
    if (avatarEl) avatarEl.textContent = displayName.charAt(0);
}

updateDate();


// ============================================================
// 🔥 FIREBASE HELPERS
// ============================================================

/**
 * Tunggu Firebase ready
 */
async function waitForFirebase(maxAttempts = 20) {
    let attempts = 0;
    while ((!window.firebase || !window.firebase.ready) && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
    }
    
    if (!window.firebase || !window.firebase.ready) {
        throw new Error('Firebase gagal dimuat. Refresh halaman!');
    }
    
    return true;
}


/**
 * Fetch single reseller by ID (get full data)
 */
async function fetchResellerById(docId) {
    await waitForFirebase();
    
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const { doc, getDoc } = firestoreModule;
    
    const { db } = window.firebase;
    const docRef = doc(db, 'resellers', docId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
        throw new Error('Data reseller tidak ditemukan');
    }
    
    return { id: docSnap.id, ...docSnap.data() };
}


/**
 * Update status reseller
 */
async function updateResellerStatus(docId, newStatus, reason = '') {
    await waitForFirebase();
    
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const { doc, updateDoc } = firestoreModule;
    
    const { db } = window.firebase;
    const docRef = doc(db, 'resellers', docId);
    
    const updateData = {
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: 'admin'
    };
    
    if (newStatus === 'active') {
        updateData.activatedAt = new Date();
        updateData.tier = 'silver';
        updateData.rejectReason = null;
        updateData.deactivateReason = null;
    }
    
    if (newStatus === 'rejected' && reason) {
        updateData.rejectReason = reason;
        updateData.rejectedAt = new Date();
    }
    
    if (newStatus === 'inactive' && reason) {
        updateData.deactivateReason = reason;
        updateData.deactivatedAt = new Date();
    }
    
    await updateDoc(docRef, updateData);
    console.log('[FIREBASE] ✅ Status updated:', docId, '→', newStatus);
}


/**
 * Update data reseller (full data)
 */
async function updateResellerData(docId, updateData) {
    await waitForFirebase();
    
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const { doc, updateDoc } = firestoreModule;
    
    const { db } = window.firebase;
    const docRef = doc(db, 'resellers', docId);
    
    const finalData = {
        ...updateData,
        updatedAt: new Date(),
        updatedBy: 'admin'
    };
    
    await updateDoc(docRef, finalData);
    console.log('[FIREBASE] ✏️ Data updated:', docId);
}


/**
 * Delete reseller permanen (hard delete)
 */
async function deleteReseller(docId) {
    await waitForFirebase();
    
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const { doc, deleteDoc } = firestoreModule;
    
    const { db } = window.firebase;
    const docRef = doc(db, 'resellers', docId);
    
    await deleteDoc(docRef);
    console.log('[FIREBASE] 🗑️ Deleted:', docId);
}


// ============================================================
// 🔄 LOAD RESELLER DATA (Dashboard Overview)
// ============================================================
async function loadResellerData() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.classList.add('loading');
    
    console.log('[DASHBOARD] Loading data...');
    
    try {
        await waitForFirebase();
        
        const { db, collection, getDocs } = window.firebase;
        const resellersRef = collection(db, 'resellers');
        
        const allSnapshot = await getDocs(resellersRef);
        console.log('[DASHBOARD] ✅ Docs found:', allSnapshot.size);
        
        const allResellers = [];
        allSnapshot.forEach(docSnap => {
            allResellers.push({ id: docSnap.id, ...docSnap.data() });
        });
        
        // HITUNG STATS
        const total = allResellers.length;
        const pending = allResellers.filter(r => r.status === 'pending').length;
        const active = allResellers.filter(r => r.status === 'active').length;
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const startTs = startOfDay.getTime();
        
        const today = allResellers.filter(r => {
            if (!r.timestamp) return false;
            const ts = r.timestamp.toDate ? r.timestamp.toDate().getTime() : 0;
            return ts >= startTs;
        }).length;
        
        updateStat('statTotalReseller', total);
        updateStat('statPendingReseller', pending);
        updateStat('statActiveReseller', active);
        updateStat('statTodayReseller', today);
        
        const trendEl = document.getElementById('statResellerTrend');
        if (trendEl) {
            trendEl.innerHTML = `<i class="fas fa-users"></i> ${total} Total`;
        }
        
        // RESELLER TERBARU (5 terbaru)
        const sortedResellers = allResellers
            .filter(r => r.timestamp)
            .sort((a, b) => {
                const timeA = a.timestamp.toDate ? a.timestamp.toDate().getTime() : 0;
                const timeB = b.timestamp.toDate ? b.timestamp.toDate().getTime() : 0;
                return timeB - timeA;
            })
            .slice(0, 5);
        
        renderResellerList(sortedResellers);
        
        console.log('[DASHBOARD] ✅ Data loaded successfully');
        
    } catch (error) {
        console.error('[DASHBOARD] ❌ Error:', error);
        
        ['statTotalReseller', 'statPendingReseller', 'statActiveReseller', 'statTodayReseller'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = '<i class="fas fa-times-circle" style="color:#e74c3c;font-size:1rem;"></i>';
                el.classList.remove('loading');
            }
        });
        
        const listEl = document.getElementById('resellerList');
        if (listEl) {
            let errorMsg = error.message;
            let solution = 'Coba refresh halaman';
            
            if (error.code === 'permission-denied' || error.message.includes('permission')) {
                errorMsg = 'Akses ditolak oleh Firestore Rules';
                solution = 'Update Firestore Rules → allow read: if true;';
            }
            
            listEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle" style="color:#e74c3c;"></i>
                    <p><strong style="color:#e74c3c;">Gagal memuat data</strong><br>
                    <small style="opacity:0.8;">${errorMsg}</small><br><br>
                    <small style="color:#f39c12;">💡 ${solution}</small>
                    </p>
                </div>
            `;
        }
    } finally {
        if (refreshBtn) refreshBtn.classList.remove('loading');
    }
}


/**
 * Helper: Update stat value
 */
function updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = value;
        el.classList.remove('loading');
    }
}


/**
 * Helper: Render reseller list DENGAN aksi berdasarkan status
 * ✨ VERSI BARU: Pill buttons dengan label icon+text
 */
function renderResellerList(resellers) {
    const listEl = document.getElementById('resellerList');
    if (!listEl) return;
    
    if (!resellers || resellers.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Belum ada reseller terdaftar<br>
                <small style="opacity:0.7;">Reseller akan muncul di sini setelah mendaftar via MoU form</small></p>
            </div>
        `;
        return;
    }
    
    let html = '';
    resellers.forEach(data => {
        const initial = (data.nama || '?').charAt(0).toUpperCase();
        
        // Format tanggal relatif
        let dateStr = '-';
        if (data.timestamp && data.timestamp.toDate) {
            const date = data.timestamp.toDate();
            const now = new Date();
            const diffMs = now - date;
            const diffMin = Math.floor(diffMs / 60000);
            const diffHour = Math.floor(diffMs / 3600000);
            const diffDay = Math.floor(diffMs / 86400000);
            
            if (diffMin < 1) dateStr = 'Baru saja';
            else if (diffMin < 60) dateStr = `${diffMin} menit lalu`;
            else if (diffHour < 24) dateStr = `${diffHour} jam lalu`;
            else if (diffDay < 7) dateStr = `${diffDay} hari lalu`;
            else dateStr = date.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});
        }
        
        const status = data.status || 'pending';
        
        // Escape data untuk onclick
        const dataStr = JSON.stringify({
            id: data.id,
            nama: data.nama || 'Tanpa Nama',
            wa: data.wa || '',
            resellerCode: data.resellerCode || '-'
        }).replace(/"/g, '&quot;');
        
        // ✨ Tombol action berdasarkan status (PILL DENGAN LABEL)
        let actionButtons = '';
        
        if (status === 'pending') {
            actionButtons = `
                <div class="reseller-actions">
                    <button class="btn-action btn-approve" onclick='handleApprove(${dataStr})' title="Approve">
                        <i class="fas fa-check"></i><span>Approve</span>
                    </button>
                    <button class="btn-action btn-edit" onclick='handleEdit(${dataStr})' title="Edit">
                        <i class="fas fa-edit"></i><span>Edit</span>
                    </button>
                    <button class="btn-action btn-reject" onclick='handleReject(${dataStr})' title="Reject">
                        <i class="fas fa-times"></i><span>Reject</span>
                    </button>
                </div>
            `;
        } else if (status === 'active') {
            actionButtons = `
                <div class="reseller-actions">
                    <button class="btn-action btn-detail" onclick='handleDetail(${dataStr})' title="Detail">
                        <i class="fas fa-eye"></i><span>Detail</span>
                    </button>
                    <button class="btn-action btn-edit" onclick='handleEdit(${dataStr})' title="Edit">
                        <i class="fas fa-edit"></i><span>Edit</span>
                    </button>
                    <button class="btn-action btn-deactivate" onclick='handleDeactivate(${dataStr})' title="Non-Aktifkan">
                        <i class="fas fa-user-slash"></i><span>Non-Aktif</span>
                    </button>
                </div>
            `;
        } else if (status === 'inactive') {
            actionButtons = `
                <div class="reseller-actions">
                    <button class="btn-action btn-reactivate" onclick='handleReactivate(${dataStr})' title="Aktifkan Kembali">
                        <i class="fas fa-user-check"></i><span>Aktifkan</span>
                    </button>
                    <button class="btn-action btn-edit" onclick='handleEdit(${dataStr})' title="Edit">
                        <i class="fas fa-edit"></i><span>Edit</span>
                    </button>
                    <button class="btn-action btn-delete" onclick='handleDelete(${dataStr})' title="Hapus Permanen">
                        <i class="fas fa-trash-alt"></i><span>Hapus</span>
                    </button>
                </div>
            `;
        } else if (status === 'rejected') {
            actionButtons = `
                <div class="reseller-actions">
                    <button class="btn-action btn-detail" onclick='handleDetail(${dataStr})' title="Detail">
                        <i class="fas fa-eye"></i><span>Detail</span>
                    </button>
                    <button class="btn-action btn-delete" onclick='handleDelete(${dataStr})' title="Hapus Permanen">
                        <i class="fas fa-trash-alt"></i><span>Hapus</span>
                    </button>
                </div>
            `;
        }
        
        html += `
            <div class="reseller-item">
                <div class="reseller-avatar">${initial}</div>
                <div class="reseller-info">
                    <div class="reseller-name">${data.nama || 'Tanpa Nama'}</div>
                    <div class="reseller-meta">
                        <span class="reseller-code">${data.resellerCode || '-'}</span>
                        <span><i class="fas fa-clock"></i> ${dateStr}</span>
                        <span><i class="fab fa-whatsapp"></i> ${data.wa || '-'}</span>
                    </div>
                </div>
                <div class="reseller-right">
                    <span class="reseller-status ${status}">${status}</span>
                    ${actionButtons}
                </div>
            </div>
        `;
    });
    
    listEl.innerHTML = html;
}


// ============================================================
// ✅ APPROVE RESELLER (Enhanced Message)
// ============================================================
async function handleApprove(data) {
    const result = await Swal.fire({
        icon: 'question',
        title: '✅ Approve Reseller?',
        html: `
            Approve <b style="color:#25d366;">${data.nama}</b> sebagai reseller aktif?<br><br>
            <div style="background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.2);padding:12px 16px;border-radius:10px;font-size:0.85rem;text-align:left;">
                ✅ Status: <b>pending</b> → <b style="color:#25d366;">active</b><br>
                🎫 Tier default: <b>Silver (15%)</b><br>
                📱 Reseller: ${data.wa}<br>
                🎁 Auto-send Welcome Pack + Starter Kit
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check"></i> Ya, Approve!',
        cancelButtonText: 'Batal',
        customClass: { popup: 'swal-premium' },
        reverseButtons: true
    });
    
    if (!result.isConfirmed) return;
    
    Swal.fire({
        title: 'Memproses...',
        html: 'Mengupdate status reseller',
        allowOutsideClick: false,
        customClass: { popup: 'swal-premium' },
        didOpen: () => Swal.showLoading()
    });
    
    try {
        await updateResellerStatus(data.id, 'active');
        
        // Format nomor WA
        const waNumber = data.wa.replace(/[^0-9]/g, '').replace(/^0/, '62');
        
        // ============================================
        // 📝 BUILD PESAN WA LENGKAP
        // ============================================
const waMessage = 
`Assalamu'alaikum Kak *${data.nama}*,

🎉 *SELAMAT & BARAKALLAHU FIIK!*

Pendaftaran reseller Anda telah *DISETUJUI* ✅

━━━━━━━━━━━━━━━━━━━━━
🎫 *DATA RESELLER*
━━━━━━━━━━━━━━━━━━━━━

Kode Reseller: *${data.resellerCode || '-'}*
Tier: 🥉 *SILVER (Komisi 15%)*
Status: ✅ AKTIF

━━━━━━━━━━━━━━━━━━━━━
📚 *STARTER KIT RESELLER*
━━━━━━━━━━━━━━━━━━━━━

Silakan buka Starter Kit untuk akses:
✅ 15 Modul Curriculum 30 Hari
✅ 6 SOP Reseller Resmi
✅ 4 Template Script Chat siap copy
✅ 6 Knowledge Cards
✅ 4 Link Website siap share
✅ Info Tier & Komisi lengkap
✅ Progress Tracker Belajar

🔗 Buka di sini:
https://ibaadurrahmaan-hub.github.io/Ibaadurrahmaan-web/starter-kit.html

*Cara Pakai:*
1️⃣ Buka link di atas
2️⃣ Masukkan Kode: *${data.resellerCode || '-'}*
3️⃣ Ikuti curriculum step-by-step
4️⃣ Copy template & mulai jualan!

*Coming Soon:*
⏳ Poster Instagram siap pakai
⏳ Video promosi
⏳ Caption sosmed template
_(update berkala)_

━━━━━━━━━━━━━━━━━━━━━
💰 *POTENSI KOMISI ANDA*
━━━━━━━━━━━━━━━━━━━━━

Setiap closing dapat:
🎫 Paket Hemat (Rp 1,5jt) = *Rp 225.000*
🎫 Paket Reguler (Rp 2,5jt) = *Rp 375.000*
🎫 Paket Premium (Rp 5jt) = *Rp 750.000*

💡 *Simulasi 3 Closing/Bulan:*
Rata-rata paket Reguler = *Rp 1.125.000/bulan*
+ Auto naik ke Gold (20% + bonus 100rb) 🎁

💎 *Naik ke Platinum:*
6 closing/bulan → Komisi 25% + bonus 200rb

━━━━━━━━━━━━━━━━━━━━━
📋 *ATURAN PENTING*
━━━━━━━━━━━━━━━━━━━━━

✅ *WAJIB:* Client yang Anda bawa harus mencantumkan Kode Reseller Anda saat order:
🔗 https://ibaadurrahmaan-hub.github.io/Ibaadurrahmaan-web/order.html

📖 Baca MoU lengkap:
🔗 https://ibaadurrahmaan-hub.github.io/Ibaadurrahmaan-web/mou-reseller.html

❌ *DILARANG:*
- Mengubah harga sendiri
- Menjanjikan hal di luar paket
- Menggunakan brand untuk hal negatif

━━━━━━━━━━━━━━━━━━━━━
🎯 *LANGKAH SELANJUTNYA*
━━━━━━━━━━━━━━━━━━━━━

*Hari Ini:*
1️⃣ Buka Starter Kit → pelajari Modul 1
2️⃣ Save Kode Reseller Anda
3️⃣ Update WA/IG bio: "Reseller Ibaadurrahmaan"

*Minggu Ini:*
1️⃣ Selesaikan Week 1 (Modul 1-3)
2️⃣ List 20+ prospek dari lingkaran sendiri
3️⃣ Coba pitch ke 5 kontak terdekat

*Target Bulan 1:*
🎯 Selesaikan semua 15 modul
🎯 Dapatkan 1-3 closing pertama!

━━━━━━━━━━━━━━━━━━━━━

💬 Ada pertanyaan? Langsung chat kami di nomor ini.
🚀 Selamat mulai belajar & closing pertama!

*Barakallahu fiik* 🙏

_Ibaadurrahmaan Web Designer_
_"Solusi Digital untuk Bisnis Anda"_`;
        
        const waMsg = encodeURIComponent(waMessage);
        const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;
        
        // ============================================
        // 🎉 SUCCESS MODAL
        // ============================================
        await Swal.fire({
            icon: 'success',
            title: '🎉 Reseller Aktif!',
            html: `
                <div style="text-align:center;">
                    <b style="color:#25d366;font-size:1.1rem;">${data.nama}</b><br>
                    <span style="color:rgba(255,255,255,0.7);font-size:0.85rem;">berhasil di-approve sebagai reseller</span>
                </div>
                <br>
                <div style="background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.2);padding:14px 16px;border-radius:12px;font-size:0.85rem;text-align:left;">
                    ✅ Status: <b style="color:#25d366;">ACTIVE</b><br>
                    🎫 Kode: <b style="color:#d4a536;font-family:monospace;">${data.resellerCode || '-'}</b><br>
                    🥉 Tier: <b>Silver (15%)</b><br>
                    📱 WA: ${data.wa}
                </div>
                <br>
                <div style="background:rgba(212,165,54,0.08);border:1px dashed rgba(212,165,54,0.3);padding:12px;border-radius:10px;font-size:0.82rem;color:rgba(255,255,255,0.85);">
                    💡 <b>Klik tombol WA</b> untuk kirim welcome message lengkap<br>
                    <small style="opacity:0.7;">Berisi: Kode reseller, Starter Kit link, potensi komisi, dan langkah selanjutnya</small>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fab fa-whatsapp"></i> Kirim Welcome via WA',
            cancelButtonText: 'Nanti Saja',
            customClass: { popup: 'swal-premium' },
            reverseButtons: true,
            focusConfirm: true
        }).then(res => {
            if (res.isConfirmed) {
                window.open(waUrl, '_blank');
                
                // Optional: Toast notification setelah buka WA
                setTimeout(() => {
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        customClass: { popup: 'swal-premium' }
                    });
                    toast.fire({
                        icon: 'success',
                        title: 'WhatsApp Anda sudah terbuka! 📱'
                    });
                }, 500);
            }
        });
        
        // Reload data (function di-call sesuai halaman)
        if (typeof loadResellerData === 'function') loadResellerData();
        if (typeof loadResellers === 'function') loadResellers();
        
    } catch (error) {
        console.error('[APPROVE] Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Approve',
            html: `
                <p>Terjadi kesalahan saat mengupdate status reseller.</p>
                <div style="background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.2);padding:12px;border-radius:10px;font-size:0.85rem;text-align:left;margin-top:12px;">
                    <b style="color:#e74c3c;">Error:</b><br>
                    ${error.message}
                </div>
            `,
            customClass: { popup: 'swal-premium' },
            confirmButtonText: 'Coba Lagi'
        });
    }
}


// ============================================================
// ❌ REJECT RESELLER
// ============================================================
async function handleReject(data) {
    const result = await Swal.fire({
        icon: 'warning',
        title: '❌ Reject Reseller?',
        html: `
            Yakin ingin reject <b style="color:#e74c3c;">${data.nama}</b>?<br><br>
            <div style="background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.2);padding:12px 16px;border-radius:10px;font-size:0.85rem;text-align:left;">
                ⚠️ Status: <b>pending</b> → <b style="color:#e74c3c;">rejected</b><br>
                🚫 Reseller tidak bisa aktifasi lagi
            </div>
        `,
        input: 'text',
        inputPlaceholder: 'Alasan reject (opsional)',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-times"></i> Ya, Reject',
        cancelButtonText: 'Batal',
        customClass: { popup: 'swal-premium' },
        reverseButtons: true
    });
    
    if (!result.isConfirmed) return;
    
    const reason = result.value || 'Tidak memenuhi syarat';
    
    Swal.fire({
        title: 'Memproses...',
        allowOutsideClick: false,
        customClass: { popup: 'swal-premium' },
        didOpen: () => Swal.showLoading()
    });
    
    try {
        await updateResellerStatus(data.id, 'rejected', reason);
        
        await Swal.fire({
            icon: 'success',
            title: 'Reseller Di-reject',
            text: `${data.nama} telah di-reject`,
            customClass: { popup: 'swal-premium' },
            timer: 2000
        });
        
        if (typeof loadResellerData === 'function') loadResellerData();
        if (typeof loadResellers === 'function') loadResellers();
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal Reject',
            text: error.message,
            customClass: { popup: 'swal-premium' }
        });
    }
}


// ============================================================
// 👁️ DETAIL VIEW (Full Data)
// ============================================================
async function handleDetail(data) {
    Swal.fire({
        title: 'Memuat detail...',
        allowOutsideClick: false,
        customClass: { popup: 'swal-premium' },
        didOpen: () => Swal.showLoading()
    });
    
    try {
        const fullData = await fetchResellerById(data.id);
        
        // Format tanggal daftar
        let tanggalDaftar = '-';
        if (fullData.timestamp?.toDate) {
            const date = fullData.timestamp.toDate();
            tanggalDaftar = date.toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            }) + ' • ' + date.toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit'
            }) + ' WIB';
        }
        
        // Format tanggal aktivasi
        let tanggalAktif = '-';
        if (fullData.activatedAt) {
            const actDate = fullData.activatedAt.toDate ? fullData.activatedAt.toDate() : new Date(fullData.activatedAt);
            tanggalAktif = actDate.toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        }
        
        // Status label
        const statusMap = {
            pending: { label: '⏳ PENDING', color: '#f39c12' },
            active: { label: '✅ ACTIVE', color: '#25d366' },
            inactive: { label: '🚫 INACTIVE', color: '#f39c12' },
            rejected: { label: '❌ REJECTED', color: '#e74c3c' }
        };
        const status = statusMap[fullData.status] || statusMap.pending;
        
        // Tier label
        const tierMap = {
            silver: { label: '🥉 SILVER (15%)', color: '#95a5a6' },
            gold: { label: '🥇 GOLD (20% + 100rb)', color: '#f39c12' },
            platinum: { label: '💎 PLATINUM (25% + 200rb)', color: '#9b59b6' }
        };
        const tier = tierMap[fullData.tier] || tierMap.silver;
        
        // Payment
        const paymentMap = {
            'per-closing': '⚡ Per Closing (Cepat)',
            'per-bulan': '📅 Per Bulan (Tgl 1-5)'
        };
        const payment = fullData.paymentLabel || paymentMap[fullData.paymentType] || '-';
        
        // WA URL
        const waNumber = (fullData.wa || '').replace(/[^0-9]/g, '').replace(/^0/, '62');
        const waUrl = `https://wa.me/${waNumber}`;
        
        Swal.fire({
            title: `👤 ${fullData.nama || 'Tanpa Nama'}`,
            html: `
                <div style="text-align:left;font-size:0.85rem;line-height:1.8;">
                    
                    <!-- Reseller Code (BIG & PROMINENT) -->
                    <div style="background:linear-gradient(135deg,rgba(212,165,54,0.15),rgba(212,165,54,0.05));border:2px solid rgba(212,165,54,0.3);border-radius:12px;padding:14px;margin-bottom:16px;text-align:center;">
                        <div style="font-size:0.72rem;color:#d4a536;font-weight:700;letter-spacing:1px;margin-bottom:4px;">
                            🎫 KODE RESELLER
                        </div>
                        <div style="font-family:'Montserrat',monospace;font-size:1.3rem;font-weight:900;color:#d4a536;letter-spacing:1px;">
                            ${fullData.resellerCode || '-'}
                        </div>
                    </div>
                    
                    <!-- Status & Tier -->
                    <div style="display:flex;gap:8px;margin-bottom:16px;justify-content:center;flex-wrap:wrap;">
                        <span style="background:${status.color}20;color:${status.color};padding:6px 14px;border-radius:100px;font-size:0.75rem;font-weight:700;border:1px solid ${status.color}40;">
                            ${status.label}
                        </span>
                        <span style="background:${tier.color}20;color:${tier.color};padding:6px 14px;border-radius:100px;font-size:0.75rem;font-weight:700;border:1px solid ${tier.color}40;">
                            ${tier.label}
                        </span>
                    </div>
                    
                    <div style="border-top:1px dashed rgba(255,255,255,0.15);margin:16px 0;"></div>
                    
                    <!-- Data Pribadi -->
                    <div style="color:#d4a536;font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                        📋 Data Pribadi
                    </div>
                    <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;margin-bottom:14px;">
                        <div style="margin-bottom:6px;"><b>Nama:</b> ${fullData.nama || '-'}</div>
                        <div style="margin-bottom:6px;"><b>KTP:</b> ${fullData.ktp || '-'}</div>
                        ${fullData.tgllahir ? `<div style="margin-bottom:6px;"><b>Tgl Lahir:</b> ${fullData.tgllahir}</div>` : ''}
                        <div style="margin-bottom:6px;"><b>Email:</b> ${fullData.email || '-'}</div>
                        <div style="margin-bottom:6px;"><b>WhatsApp:</b> <a href="${waUrl}" target="_blank" style="color:#25d366;text-decoration:none;">${fullData.wa || '-'}</a></div>
                        ${fullData.sosmed ? `<div><b>Sosmed:</b> ${fullData.sosmed}</div>` : ''}
                    </div>
                    
                    <!-- Alamat -->
                    ${fullData.alamat ? `
                        <div style="color:#d4a536;font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                            📍 Alamat
                        </div>
                        <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;margin-bottom:14px;font-size:0.85rem;">
                            ${fullData.alamat}
                        </div>
                    ` : ''}
                    
                    <!-- Rekening -->
                    <div style="color:#d4a536;font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                        🏦 Rekening Bank
                    </div>
                    <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;margin-bottom:14px;">
                        <div style="margin-bottom:6px;"><b>Bank:</b> ${fullData.bank || '-'}</div>
                        <div style="margin-bottom:6px;"><b>No. Rek:</b> <span style="font-family:monospace;background:rgba(212,165,54,0.1);padding:2px 8px;border-radius:6px;color:#d4a536;">${fullData.norek || '-'}</span></div>
                        <div style="margin-bottom:6px;"><b>a.n.:</b> ${fullData.atasNama || '-'}</div>
                        <div><b>Pembayaran:</b> ${payment}</div>
                    </div>
                    
                    <!-- Statistik -->
                    <div style="color:#d4a536;font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                        📊 Statistik
                    </div>
                    <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;margin-bottom:14px;">
                        <div style="margin-bottom:6px;"><b>Total Closing:</b> ${fullData.totalClosing || 0}</div>
                        <div><b>Total Komisi:</b> Rp ${(fullData.totalKomisi || 0).toLocaleString('id-ID')}</div>
                    </div>
                    
                    <!-- Timeline -->
                    <div style="color:#d4a536;font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                        📅 Timeline
                    </div>
                    <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;font-size:0.85rem;">
                        <div style="margin-bottom:6px;"><b>Daftar:</b> ${tanggalDaftar}</div>
                        ${fullData.status === 'active' && tanggalAktif !== '-' ? `<div><b>Aktivasi:</b> ${tanggalAktif}</div>` : ''}
                        ${fullData.rejectReason ? `<div style="color:#e74c3c;margin-top:6px;"><b>Alasan Reject:</b> ${fullData.rejectReason}</div>` : ''}
                        ${fullData.deactivateReason ? `<div style="color:#f39c12;margin-top:6px;"><b>Alasan Non-Aktif:</b> ${fullData.deactivateReason}</div>` : ''}
                    </div>
                    
                    <!-- Database ID (Small) -->
                    <div style="border-top:1px dashed rgba(255,255,255,0.1);margin-top:16px;padding-top:12px;text-align:center;">
                        <div style="font-size:0.65rem;color:rgba(255,255,255,0.3);letter-spacing:0.5px;">
                            🔧 Database ID: <span style="font-family:monospace;">${data.id}</span>
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fab fa-whatsapp"></i> Chat WhatsApp',
            cancelButtonText: 'Tutup',
            customClass: { popup: 'swal-premium' },
            width: '90%',
            padding: '20px'
        }).then(result => {
            if (result.isConfirmed) {
                window.open(waUrl, '_blank');
            }
        });
        
    } catch (error) {
        console.error('[DETAIL] Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat',
            text: error.message,
            customClass: { popup: 'swal-premium' }
        });
    }
}


// ============================================================
// ✏️ EDIT RESELLER (Full Form)
// ============================================================
async function handleEdit(data) {
    Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        customClass: { popup: 'swal-premium' },
        didOpen: () => Swal.showLoading()
    });
    
    try {
        const fullData = await fetchResellerById(data.id);
        
        const { value: formValues } = await Swal.fire({
            title: `✏️ Edit: ${fullData.nama}`,
            html: `
                <div style="text-align:left;font-size:0.85rem;">
                    
                    <div style="background:rgba(212,165,54,0.1);border-radius:10px;padding:10px 14px;margin-bottom:16px;text-align:center;">
                        <div style="font-size:0.7rem;color:#d4a536;font-weight:700;letter-spacing:1px;">KODE RESELLER (Tidak Bisa Diubah)</div>
                        <div style="font-family:monospace;font-size:1rem;font-weight:800;color:#d4a536;margin-top:4px;">${fullData.resellerCode || '-'}</div>
                    </div>
                    
                    <div style="color:#d4a536;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                        📋 Data Pribadi
                    </div>
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Nama Lengkap</label>
                    <input id="edit-nama" class="swal2-input" placeholder="Nama lengkap" value="${fullData.nama || ''}" style="margin:0 0 12px;width:100%;">
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Email</label>
                    <input id="edit-email" class="swal2-input" type="email" placeholder="Email" value="${fullData.email || ''}" style="margin:0 0 12px;width:100%;">
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">WhatsApp</label>
                    <input id="edit-wa" class="swal2-input" placeholder="08xxxxxxxxxx" value="${fullData.wa || ''}" style="margin:0 0 12px;width:100%;">
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Alamat</label>
                    <textarea id="edit-alamat" class="swal2-textarea" placeholder="Alamat lengkap" style="margin:0 0 12px;width:100%;min-height:60px;">${fullData.alamat || ''}</textarea>
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Sosial Media</label>
                    <input id="edit-sosmed" class="swal2-input" placeholder="@username" value="${fullData.sosmed || ''}" style="margin:0 0 16px;width:100%;">
                    
                    <div style="color:#d4a536;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                        🏦 Data Rekening
                    </div>
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Bank</label>
                    <select id="edit-bank" class="swal2-select" style="margin:0 0 12px;width:100%;padding:12px;background:#0D1829;border:1.5px solid rgba(212,165,54,0.2);border-radius:10px;color:#fff;">
                        <option value="BCA" ${fullData.bank === 'BCA' ? 'selected' : ''}>BCA</option>
                        <option value="BNI" ${fullData.bank === 'BNI' ? 'selected' : ''}>BNI</option>
                        <option value="BRI" ${fullData.bank === 'BRI' ? 'selected' : ''}>BRI</option>
                        <option value="Mandiri" ${fullData.bank === 'Mandiri' ? 'selected' : ''}>Mandiri</option>
                        <option value="CIMB Niaga" ${fullData.bank === 'CIMB Niaga' ? 'selected' : ''}>CIMB Niaga</option>
                        <option value="Permata" ${fullData.bank === 'Permata' ? 'selected' : ''}>Permata</option>
                        <option value="Danamon" ${fullData.bank === 'Danamon' ? 'selected' : ''}>Danamon</option>
                        <option value="BTN" ${fullData.bank === 'BTN' ? 'selected' : ''}>BTN</option>
                        <option value="BSI" ${fullData.bank === 'BSI' ? 'selected' : ''}>BSI</option>
                        <option value="Jenius" ${fullData.bank === 'Jenius' ? 'selected' : ''}>Jenius</option>
                        <option value="Seabank" ${fullData.bank === 'Seabank' ? 'selected' : ''}>Seabank</option>
                        <option value="Blu BCA" ${fullData.bank === 'Blu BCA' ? 'selected' : ''}>Blu BCA</option>
                        <option value="DANA" ${fullData.bank === 'DANA' ? 'selected' : ''}>DANA</option>
                        <option value="OVO" ${fullData.bank === 'OVO' ? 'selected' : ''}>OVO</option>
                        <option value="GoPay" ${fullData.bank === 'GoPay' ? 'selected' : ''}>GoPay</option>
                        <option value="ShopeePay" ${fullData.bank === 'ShopeePay' ? 'selected' : ''}>ShopeePay</option>
                    </select>
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">No. Rekening</label>
                    <input id="edit-norek" class="swal2-input" placeholder="Nomor rekening" value="${fullData.norek || ''}" style="margin:0 0 12px;width:100%;">
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Atas Nama</label>
                    <input id="edit-atasNama" class="swal2-input" placeholder="Nama pemilik rekening" value="${fullData.atasNama || ''}" style="margin:0 0 16px;width:100%;">
                    
                    <div style="color:#d4a536;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                        🎫 Status & Tier
                    </div>
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Status</label>
                    <select id="edit-status" class="swal2-select" style="margin:0 0 12px;width:100%;padding:12px;background:#0D1829;border:1.5px solid rgba(212,165,54,0.2);border-radius:10px;color:#fff;">
                        <option value="pending" ${fullData.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                        <option value="active" ${fullData.status === 'active' ? 'selected' : ''}>✅ Active</option>
                        <option value="inactive" ${fullData.status === 'inactive' ? 'selected' : ''}>🚫 Inactive</option>
                        <option value="rejected" ${fullData.status === 'rejected' ? 'selected' : ''}>❌ Rejected</option>
                    </select>
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Tier</label>
                    <select id="edit-tier" class="swal2-select" style="margin:0 0 12px;width:100%;padding:12px;background:#0D1829;border:1.5px solid rgba(212,165,54,0.2);border-radius:10px;color:#fff;">
                        <option value="silver" ${fullData.tier === 'silver' ? 'selected' : ''}>🥉 Silver (15%)</option>
                        <option value="gold" ${fullData.tier === 'gold' ? 'selected' : ''}>🥇 Gold (20% + 100rb)</option>
                        <option value="platinum" ${fullData.tier === 'platinum' ? 'selected' : ''}>💎 Platinum (25% + 200rb)</option>
                    </select>
                    
                    <div style="color:#d4a536;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">
                        📊 Statistik (Manual Update)
                    </div>
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Total Closing</label>
                    <input id="edit-totalClosing" class="swal2-input" type="number" min="0" placeholder="0" value="${fullData.totalClosing || 0}" style="margin:0 0 12px;width:100%;">
                    
                    <label style="display:block;margin-bottom:4px;font-weight:600;color:#d4a536;font-size:0.75rem;">Total Komisi (Rp)</label>
                    <input id="edit-totalKomisi" class="swal2-input" type="number" min="0" placeholder="0" value="${fullData.totalKomisi || 0}" style="margin:0 0 8px;width:100%;">
                    
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-save"></i> Simpan Perubahan',
            cancelButtonText: 'Batal',
            customClass: { popup: 'swal-premium' },
            width: '90%',
            reverseButtons: true,
            focusConfirm: false,
            preConfirm: () => {
                const values = {
                    nama: document.getElementById('edit-nama').value.trim(),
                    email: document.getElementById('edit-email').value.trim(),
                    wa: document.getElementById('edit-wa').value.trim(),
                    alamat: document.getElementById('edit-alamat').value.trim(),
                    sosmed: document.getElementById('edit-sosmed').value.trim(),
                    bank: document.getElementById('edit-bank').value,
                    norek: document.getElementById('edit-norek').value.trim(),
                    atasNama: document.getElementById('edit-atasNama').value.trim(),
                    status: document.getElementById('edit-status').value,
                    tier: document.getElementById('edit-tier').value,
                    totalClosing: parseInt(document.getElementById('edit-totalClosing').value) || 0,
                    totalKomisi: parseInt(document.getElementById('edit-totalKomisi').value) || 0
                };
                
                if (!values.nama) { Swal.showValidationMessage('Nama wajib diisi'); return false; }
                if (!values.wa) { Swal.showValidationMessage('WhatsApp wajib diisi'); return false; }
                if (!values.email) { Swal.showValidationMessage('Email wajib diisi'); return false; }
                if (!values.norek) { Swal.showValidationMessage('No rekening wajib diisi'); return false; }
                
                return values;
            }
        });
        
        if (!formValues) return;
        
        Swal.fire({
            title: 'Menyimpan...',
            allowOutsideClick: false,
            customClass: { popup: 'swal-premium' },
            didOpen: () => Swal.showLoading()
        });
        
        const updateData = {
            ...formValues,
            sosmed: formValues.sosmed || null
        };
        
        await updateResellerData(data.id, updateData);
        
        await Swal.fire({
            icon: 'success',
            title: '✅ Berhasil Update!',
            html: `Data <b>${formValues.nama}</b> berhasil diperbarui`,
            customClass: { popup: 'swal-premium' },
            timer: 2500
        });
        
        if (typeof loadResellerData === 'function') loadResellerData();
        if (typeof loadResellers === 'function') loadResellers();
        
    } catch (error) {
        console.error('[EDIT] Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Update',
            text: error.message,
            customClass: { popup: 'swal-premium' }
        });
    }
}


// ============================================================
// 🚫 DEACTIVATE (Soft Delete)
// ============================================================
async function handleDeactivate(data) {
    const result = await Swal.fire({
        icon: 'warning',
        title: '🚫 Non-Aktifkan Reseller?',
        html: `
            Yakin ingin non-aktifkan <b style="color:#f39c12;">${data.nama}</b>?<br><br>
            <div style="background:rgba(243,156,18,0.1);border:1px solid rgba(243,156,18,0.2);padding:12px 16px;border-radius:10px;font-size:0.85rem;text-align:left;">
                ⚠️ Status: <b>active</b> → <b style="color:#f39c12;">inactive</b><br>
                🚫 Reseller tidak bisa terima komisi baru<br>
                💾 Data <b>TIDAK dihapus</b>, bisa diaktifkan lagi<br>
                📊 Data komisi lama tetap tersimpan
            </div>
        `,
        input: 'text',
        inputPlaceholder: 'Alasan non-aktifkan (opsional)',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-user-slash"></i> Ya, Non-Aktifkan',
        cancelButtonText: 'Batal',
        customClass: { popup: 'swal-premium' },
        reverseButtons: true
    });
    
    if (!result.isConfirmed) return;
    
    const reason = result.value || 'Tidak disebutkan';
    
    Swal.fire({
        title: 'Memproses...',
        allowOutsideClick: false,
        customClass: { popup: 'swal-premium' },
        didOpen: () => Swal.showLoading()
    });
    
    try {
        await updateResellerStatus(data.id, 'inactive', reason);
        
        await Swal.fire({
            icon: 'success',
            title: '🚫 Reseller Non-Aktif',
            html: `
                <b>${data.nama}</b> berhasil di-non-aktifkan.<br><br>
                <small style="opacity:0.8;">Data tetap tersimpan. Bisa diaktifkan kembali kapan saja.</small>
            `,
            customClass: { popup: 'swal-premium' },
            timer: 2500
        });
        
        if (typeof loadResellerData === 'function') loadResellerData();
        if (typeof loadResellers === 'function') loadResellers();
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal Non-Aktifkan',
            text: error.message,
            customClass: { popup: 'swal-premium' }
        });
    }
}


// ============================================================
// ✅ REACTIVATE
// ============================================================
async function handleReactivate(data) {
    const result = await Swal.fire({
        icon: 'question',
        title: '✅ Aktifkan Kembali?',
        html: `
            Aktifkan kembali <b style="color:#25d366;">${data.nama}</b>?<br><br>
            <div style="background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.2);padding:12px 16px;border-radius:10px;font-size:0.85rem;text-align:left;">
                ✅ Status: <b>inactive</b> → <b style="color:#25d366;">active</b><br>
                🎫 Kembali bisa terima komisi<br>
                📱 Notifikasi akan dikirim ke reseller
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-user-check"></i> Ya, Aktifkan',
        cancelButtonText: 'Batal',
        customClass: { popup: 'swal-premium' },
        reverseButtons: true
    });
    
    if (!result.isConfirmed) return;
    
    Swal.fire({
        title: 'Memproses...',
        allowOutsideClick: false,
        customClass: { popup: 'swal-premium' },
        didOpen: () => Swal.showLoading()
    });
    
    try {
        await updateResellerStatus(data.id, 'active');
        
        const waNumber = data.wa.replace(/[^0-9]/g, '').replace(/^0/, '62');
        const waMsg = encodeURIComponent(
            `Assalamu'alaikum ${data.nama},\n\n` +
            `🎉 *AKUN RESELLER AKTIF KEMBALI!*\n\n` +
            `Akun reseller Anda telah *DIAKTIFKAN KEMBALI*.\n\n` +
            `🎫 Kode Reseller: *${data.resellerCode || '-'}*\n\n` +
            `Silakan mulai memasarkan jasa website kami kembali.\n\n` +
            `Terima kasih atas kesediaannya bergabung kembali.\n\n` +
            `Barakallahu fiik 🙏`
        );
        const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;
        
        await Swal.fire({
            icon: 'success',
            title: '🎉 Reseller Aktif Kembali!',
            html: `<b>${data.nama}</b> berhasil diaktifkan kembali`,
            showCancelButton: true,
            confirmButtonText: '<i class="fab fa-whatsapp"></i> Notif via WA',
            cancelButtonText: 'Nanti',
            customClass: { popup: 'swal-premium' }
        }).then(res => {
            if (res.isConfirmed) {
                window.open(waUrl, '_blank');
            }
        });
        
        if (typeof loadResellerData === 'function') loadResellerData();
        if (typeof loadResellers === 'function') loadResellers();
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal Aktifkan',
            text: error.message,
            customClass: { popup: 'swal-premium' }
        });
    }
}


// ============================================================
// 🗑️ DELETE PERMANENT (Hard Delete)
// ============================================================
async function handleDelete(data) {
    // Step 1: Warning
    const step1 = await Swal.fire({
        icon: 'warning',
        title: '⚠️ HAPUS PERMANEN?',
        html: `
            <div style="background:rgba(231,76,60,0.1);border:2px solid rgba(231,76,60,0.4);padding:16px;border-radius:10px;text-align:left;">
                <p style="color:#e74c3c;font-weight:800;margin-bottom:8px;">🚨 PERHATIAN!</p>
                <p style="font-size:0.9rem;line-height:1.6;margin-bottom:8px;">
                    Anda akan menghapus <b style="color:#e74c3c;">${data.nama}</b> secara <b>PERMANEN</b>.
                </p>
                <p style="font-size:0.85rem;opacity:0.9;">
                    ❌ Semua data akan dihapus<br>
                    ❌ Tidak bisa di-restore<br>
                    ❌ Data komisi & history hilang<br>
                    ❌ Aksi ini <b>TIDAK BISA DI-UNDO</b>
                </p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-exclamation-triangle"></i> Ya, Lanjutkan',
        cancelButtonText: 'Batal',
        customClass: { popup: 'swal-premium' },
        reverseButtons: true,
        focusCancel: true
    });
    
    if (!step1.isConfirmed) return;
    
    // Step 2: Type name to confirm
    const step2 = await Swal.fire({
        icon: 'error',
        title: '⛔ KONFIRMASI AKHIR',
        html: `
            Untuk konfirmasi, ketik nama reseller di bawah:<br><br>
            <b style="color:#e74c3c;font-size:1.1rem;font-family:monospace;">${data.nama}</b>
        `,
        input: 'text',
        inputPlaceholder: `Ketik: ${data.nama}`,
        inputValidator: (value) => {
            if (!value) return 'Nama harus diisi!';
            if (value.trim() !== data.nama.trim()) {
                return `Nama tidak cocok. Harus persis: "${data.nama}"`;
            }
        },
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-trash-alt"></i> HAPUS PERMANEN',
        cancelButtonText: 'Batal',
        customClass: { popup: 'swal-premium' },
        reverseButtons: true,
        focusCancel: true
    });
    
    if (!step2.isConfirmed) return;
    
    Swal.fire({
        title: 'Menghapus...',
        html: 'Menghapus data reseller secara permanen',
        allowOutsideClick: false,
        customClass: { popup: 'swal-premium' },
        didOpen: () => Swal.showLoading()
    });
    
    try {
        await deleteReseller(data.id);
        
        await Swal.fire({
            icon: 'success',
            title: '🗑️ Berhasil Dihapus',
            html: `
                <b>${data.nama}</b> telah dihapus permanen dari database.<br><br>
                <small style="opacity:0.7;">ID: ${data.id}</small>
            `,
            customClass: { popup: 'swal-premium' },
            timer: 3000
        });
        
        if (typeof loadResellerData === 'function') loadResellerData();
        if (typeof loadResellers === 'function') loadResellers();
        
    } catch (error) {
        console.error('[DELETE] Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Hapus',
            text: error.message,
            customClass: { popup: 'swal-premium' }
        });
    }
}


// ============================================================
// 🎉 WELCOME TOAST
// ============================================================
if (!sessionStorage.getItem('welcomed')) {
    setTimeout(() => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: { popup: 'swal-premium' }
        });
        Toast.fire({
            icon: 'success',
            title: `Selamat datang kembali! 👋`
        });
        sessionStorage.setItem('welcomed', 'true');
    }, 500);
}


// ============================================================
// 🚀 AUTO LOAD ON READY
// ============================================================
document.addEventListener('firebaseReady', () => {
    console.log('[DASHBOARD] Firebase ready event triggered');
    if (typeof loadResellerData === 'function') loadResellerData();
});

setTimeout(() => {
    if (window.firebase && window.firebase.ready && typeof loadResellerData === 'function') {
        console.log('[DASHBOARD] Auto-loading...');
        loadResellerData();
    }
}, 1500);


// ====================================================
// 🎯 AUTO-SET ACTIVE NAV ITEM
// ====================================================
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        
        const href = item.getAttribute('href');
        if (href && href === currentPage) {
            item.classList.add('active');
        }
    });
    
    console.log('[NAV] Active page:', currentPage);
}

// Auto-run saat page load
setActiveNav();