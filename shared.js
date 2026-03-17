// ═══════════════════════════════════════════
// CREX CRICKET STORE — Shared State & Utils
// ═══════════════════════════════════════════

const CREX = (() => {

  // ── Cart (localStorage) ──────────────────
  function getCart() {
    try { return JSON.parse(localStorage.getItem('crex_cart') || '[]'); }
    catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem('crex_cart', JSON.stringify(cart));
    updateNavBadge();
  }

  function addToCart(name, emoji, priceNum, brand, category) {
    const cart = getCart();
    const ex = cart.find(i => i.name === name);
    if (ex) ex.qty++;
    else cart.push({ name, emoji, priceNum, brand, category, qty: 1 });
    saveCart(cart);
    showToast(`<strong>${name.slice(0,30)}</strong> added to cart!`);
  }

  function removeFromCart(idx) {
    const cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartCount() {
    return getCart().reduce((s, i) => s + i.qty, 0);
  }

  function getCartTotal() {
    return getCart().reduce((s, i) => s + i.priceNum * i.qty, 0);
  }

  // ── Nav badge update ─────────────────────
  function updateNavBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getCartCount();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // ── Toast ────────────────────────────────
  let toastTimer;
  function showToast(msg, icon = '🏏') {
    const t = document.getElementById('crex-toast');
    if (!t) return;
    document.getElementById('crex-toast-msg').innerHTML = msg;
    document.getElementById('crex-toast-icon').textContent = icon;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  // ── Cart Drawer ──────────────────────────
  function openCart() {
    renderCartDrawer();
    document.getElementById('crex-cart-drawer').classList.add('open');
    document.getElementById('crex-cart-overlay').classList.add('open');
  }

  function closeCart() {
    document.getElementById('crex-cart-drawer').classList.remove('open');
    document.getElementById('crex-cart-overlay').classList.remove('open');
  }

  function renderCartDrawer() {
    const cart = getCart();
    const el = document.getElementById('crex-cart-items');
    if (!el) return;
    if (cart.length === 0) {
      el.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛒</div><p>Your cart is empty.<br>Add some great gear!</p></div>`;
    } else {
      el.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <div class="cart-item-img">${item.emoji}</div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.brand} · Qty: ${item.qty}</p>
          </div>
          <div class="cart-item-price">₹${(item.priceNum * item.qty).toLocaleString()}</div>
          <button class="cart-remove" onclick="CREX.removeFromCart(${i});CREX.renderCartDrawer();CREX.updateNavBadge()">🗑</button>
        </div>
      `).join('');
    }
    document.getElementById('crex-cart-total').textContent = '₹' + getCartTotal().toLocaleString();
  }

  function checkout() {
    if (getCartCount() === 0) return;
    clearCart();
    renderCartDrawer();
    updateNavBadge();
    closeCart();
    showToast('🎉 Order placed! Thank you for shopping at CREX!', '🏆');
  }

  // ── Shared NAV HTML ──────────────────────
  function injectNav(activePage) {
    const pages = [
      { id: 'home', label: 'Home', href: 'index.html' },
      { id: 'products', label: 'Products', href: 'products.html' },
      { id: 'brands', label: 'Brands', href: 'brands.html' },
      { id: 'contact', label: 'Contact', href: 'contact.html' },
    ];

    const links = pages.map(p =>
      `<li><a href="${p.href}" class="${p.id === activePage ? 'active' : ''}">${p.label}</a></li>`
    ).join('');

    document.getElementById('crex-nav').innerHTML = `
      <a href="index.html" class="nav-logo">CREX<span>.</span></a>
      <ul class="nav-links">${links}</ul>
      <div class="nav-right">
        <button class="cart-btn" onclick="CREX.openCart()">
          🛒 Cart
          <span class="cart-badge" id="nav-badge" style="display:none">0</span>
        </button>
      </div>
    `;
    updateNavBadge();
  }

  // ── Shared Cart Drawer HTML ───────────────
  function injectCartDrawer() {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="cart-overlay" id="crex-cart-overlay" onclick="CREX.closeCart()"></div>
      <div class="cart-drawer" id="crex-cart-drawer">
        <div class="cart-header">
          <h2>YOUR CART</h2>
          <button class="cart-close" onclick="CREX.closeCart()">✕</button>
        </div>
        <div class="cart-items" id="crex-cart-items">
          <div class="cart-empty"><div class="empty-icon">🛒</div><p>Your cart is empty.</p></div>
        </div>
        <div class="cart-footer">
          <div class="cart-total-row">
            <span>Total</span>
            <strong id="crex-cart-total">₹0</strong>
          </div>
          <button class="checkout-btn" onclick="CREX.checkout()">CHECKOUT →</button>
        </div>
      </div>
      <div class="toast" id="crex-toast">
        <span class="toast-icon" id="crex-toast-icon">🏏</span>
        <span class="toast-msg" id="crex-toast-msg">Added!</span>
      </div>
    `;
    document.body.appendChild(div);
  }

  // ── Products Data ─────────────────────────
  const products = [
    // BATS
    { id:1, name:'SS Ton Reserve Edition', brand:'SS', category:'Bat', emoji:'🏏', price:8999, original:10999, badge:'Sale', desc:'English Willow Grade 1 · Full Size' },
    { id:2, name:'MRF Genius Grand Edition', brand:'MRF', category:'Bat', emoji:'🏏', price:12499, original:14999, badge:'Featured', desc:'English Willow Pro Series' },
    { id:3, name:'SG Sunny Tonny Ultimate', brand:'SG', category:'Bat', emoji:'🏏', price:6999, original:8499, badge:'Sale', desc:'Kashmir Willow · Full Size' },
    { id:4, name:'Kookaburra Kahuna Pro', brand:'Kookaburra', category:'Bat', emoji:'🏏', price:15999, original:18000, badge:'New', desc:'English Willow Grade A+' },
    { id:5, name:'Gray-Nicolls Kaboom Elite', brand:'Gray-Nicolls', category:'Bat', emoji:'🏏', price:11299, original:13000, badge:'', desc:'English Willow · Big Edges' },
    { id:6, name:'SS Ton Premium', brand:'SS', category:'Bat', emoji:'🏏', price:4499, original:5200, badge:'', desc:'Kashmir Willow · Starter Series' },
    { id:7, name:'GM Noir 909', brand:'GM', category:'Bat', emoji:'🏏', price:13499, original:15000, badge:'New', desc:'English Willow · DXM Technology' },
    { id:8, name:'Spartan CG Ultimate', brand:'Spartan', category:'Bat', emoji:'🏏', price:9299, original:10500, badge:'', desc:'English Willow · Pro Range' },

    // BALLS
    { id:9, name:'SG Test Best Red Ball', brand:'SG', category:'Ball', emoji:'🎾', price:1299, original:1599, badge:'Sale', desc:'Red Leather · 156g · Match Grade' },
    { id:10, name:'Kookaburra Turf White Ball', brand:'Kookaburra', category:'Ball', emoji:'🎾', price:1499, original:1800, badge:'Featured', desc:'White Leather · Official ODI' },
    { id:11, name:'MRF Training Ball Pack ×6', brand:'MRF', category:'Ball', emoji:'🎾', price:899, original:1100, badge:'Sale', desc:'Synthetic · Indoor Training' },
    { id:12, name:'SS Super Club Tennis Ball', brand:'SS', category:'Ball', emoji:'🎾', price:299, original:399, badge:'New', desc:'Yellow · All-Surface Play' },
    { id:13, name:'SG Club Leather Ball', brand:'SG', category:'Ball', emoji:'🎾', price:699, original:849, badge:'', desc:'Red Leather · Club Level' },
    { id:14, name:'Dukes Special County Ball', brand:'Dukes', category:'Ball', emoji:'🎾', price:2199, original:2599, badge:'Featured', desc:'Hand-stitched · Pro Match' },

    // JERSEYS - National
    { id:15, name:'India Home ODI Jersey 2024', brand:'BCCI', category:'Jersey', emoji:'👕', price:1799, original:2200, badge:'Featured', desc:'Official Team India Blue · M/L/XL' },
    { id:16, name:'India Test Jersey (White)', brand:'BCCI', category:'Jersey', emoji:'🤍', price:1599, original:1999, badge:'', desc:'Official Test Match White' },
    { id:17, name:'Australia ODI Jersey', brand:'Cricket Australia', category:'Jersey', emoji:'💛', price:1999, original:2500, badge:'New', desc:'Official Gold & Green' },
    { id:18, name:'England Test White Jersey', brand:'ECB', category:'Jersey', emoji:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', price:1899, original:2300, badge:'', desc:'Official Three Lions' },
    { id:19, name:'Pakistan ODI Jersey', brand:'PCB', category:'Jersey', emoji:'💚', price:1699, original:2100, badge:'', desc:'Official Pakistan Green' },
    { id:20, name:'South Africa ODI Jersey', brand:'CSA', category:'Jersey', emoji:'🇿🇦', price:1799, original:2200, badge:'New', desc:'Official Proteas Green' },

    // JERSEYS - IPL
    { id:21, name:'CSK Home Jersey 2025', brand:'CSK', category:'Jersey', emoji:'🦁', price:1499, original:1800, badge:'New', desc:'Chennai Super Kings Yellow' },
    { id:22, name:'MI Home Jersey 2025', brand:'MI', category:'Jersey', emoji:'💙', price:1499, original:1800, badge:'New', desc:'Mumbai Indians Blue' },
    { id:23, name:'RCB Home Jersey 2025', brand:'RCB', category:'Jersey', emoji:'❤️', price:1499, original:1800, badge:'Featured', desc:'Royal Challengers Bengaluru Red' },
    { id:24, name:'KKR Home Jersey 2025', brand:'KKR', category:'Jersey', emoji:'💜', price:1499, original:1800, badge:'', desc:'Kolkata Knight Riders Purple' },
    { id:25, name:'SRH Home Jersey 2025', brand:'SRH', category:'Jersey', emoji:'🧡', price:1499, original:1800, badge:'Sale', desc:'Sunrisers Hyderabad Orange' },
    { id:26, name:'DC Home Jersey 2025', brand:'DC', category:'Jersey', emoji:'🔵', price:1299, original:1600, badge:'', desc:'Delhi Capitals Blue' },
    { id:27, name:'GT Home Jersey 2025', brand:'GT', category:'Jersey', emoji:'🩵', price:1299, original:1600, badge:'New', desc:'Gujarat Titans Teal' },
    { id:28, name:'LSG Home Jersey 2025', brand:'LSG', category:'Jersey', emoji:'🔷', price:1299, original:1600, badge:'', desc:'Lucknow Super Giants Blue' },
    { id:29, name:'PBKS Home Jersey 2025', brand:'PBKS', category:'Jersey', emoji:'🔴', price:1299, original:1600, badge:'', desc:'Punjab Kings Red' },
    { id:30, name:'RR Home Jersey 2025', brand:'RR', category:'Jersey', emoji:'🌸', price:1299, original:1600, badge:'Sale', desc:'Rajasthan Royals Pink' },

    // GEAR
    { id:31, name:'SS Pro Batting Gloves', brand:'SS', category:'Gear', emoji:'🧤', price:1199, original:1499, badge:'', desc:'Full finger Mesh Back · M/L' },
    { id:32, name:'SG Test Batting Pads', brand:'SG', category:'Gear', emoji:'🦺', price:2499, original:2999, badge:'Featured', desc:'Adult · High-density foam' },
    { id:33, name:'Masuri Titanium Helmet', brand:'Masuri', category:'Gear', emoji:'⛑️', price:5999, original:6999, badge:'', desc:'Steel grill · Adjustable fit' },
    { id:34, name:'SS Duffle Cricket Bag', brand:'SS', category:'Gear', emoji:'🎒', price:2999, original:3599, badge:'Sale', desc:'4 pockets · Bat holder · Waterproof' },
    { id:35, name:'MRF WK Gloves', brand:'MRF', category:'Gear', emoji:'🥊', price:1899, original:2299, badge:'', desc:'Premium leather · All-around grip' },
    { id:36, name:'SG Cricket Batting Helmet', brand:'SG', category:'Gear', emoji:'⛑️', price:3499, original:3999, badge:'New', desc:'Titanium grill · Adult size' },
  ];

  return {
    getCart, saveCart, addToCart, removeFromCart, clearCart,
    getCartCount, getCartTotal,
    updateNavBadge, showToast,
    openCart, closeCart, renderCartDrawer, checkout,
    injectNav, injectCartDrawer,
    products
  };
})();

// Auto-init cart drawer on any page
document.addEventListener('DOMContentLoaded', () => {
  CREX.injectCartDrawer();
  CREX.updateNavBadge();
});
