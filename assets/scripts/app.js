(function(){
  const PAGE_SIZE = 6;
  const storage = {
    getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); },
    saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); },
    getFavs(){ return JSON.parse(localStorage.getItem('favs')||'[]'); },
    saveFavs(favs){ localStorage.setItem('favs', JSON.stringify(favs)); },
    getDark(){ return localStorage.getItem('darkMode') === 'true'; },
    saveDark(value){ localStorage.setItem('darkMode', value ? 'true' : 'false'); }
  };

  const state = {
    page: 1,
    query: '',
    category: 'all',
    sort: 'latest',
    filtered: PRODUCTS.slice()
  };

  function findProduct(id){ return PRODUCTS.find(p => p.id === Number(id)); }
  function formatPrice(value){ return '$' + Number(value).toFixed(2); }

  function toast(message){
    let toastEl = document.getElementById('toastNotification');
    if(!toastEl){
      toastEl = document.createElement('div');
      toastEl.id = 'toastNotification';
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(()=> toastEl.classList.remove('show'), 2200);
  }

  function applyDarkMode(value){
    if(value) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    storage.saveDark(value);
  }

  function updateBadges(){
    const cart = storage.getCart();
    const count = cart.reduce((sum,item)=>sum + item.qty, 0);
    document.querySelectorAll('[id^="cartCountBadge"]').forEach(el => el.textContent = count);
  }

  function getFilteredProducts(){
    let list = PRODUCTS.slice();
    const q = state.query.trim().toLowerCase();
    if(q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    if(state.category !== 'all') list = list.filter(p => p.category === state.category);
    if(state.sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
    if(state.sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
    if(state.sort === 'rating') list.sort((a,b)=>b.rating-a.rating);
    if(state.sort === 'latest') list.sort((a,b)=>new Date(b.date)-new Date(a.date));
    return list;
  }

  function renderSkeleton(){
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    for(let i=0;i<6;i++){
      const card = document.createElement('div');
      card.className = 'rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden skeleton h-72';
      grid.appendChild(card);
    }
  }

  function renderFeatured(){
    const target = document.getElementById('featuredGrid');
    if(!target) return;
    const featured = PRODUCTS.slice(0, 12);
    target.innerHTML = '';
    featured.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-surface rounded-3xl shadow-lg p-4 transition hover:-translate-y-1 hover:shadow-2xl';
      card.innerHTML = `
        <img src="${p.image}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80'" class="w-full h-44 object-cover rounded-3xl" />
        <div class="mt-4">
          <div class="text-sm text-slate-500 dark:text-slate-400">${p.category}</div>
          <h3 class="font-semibold text-lg mt-2">${p.title}</h3>
          <div class="mt-3 flex items-center justify-between">
            <div class="text-primary font-semibold">${formatPrice(p.price)}</div>
            <button data-id="${p.id}" class="addBtn btn-primary rounded-full px-4 py-2 text-sm">Add</button>
          </div>
        </div>`;
      target.appendChild(card);
    });
  }

  function renderProducts(){
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    state.filtered = getFilteredProducts();
    document.getElementById('productsCount') && (document.getElementById('productsCount').textContent = state.filtered.length);

    if(state.page > Math.ceil(state.filtered.length / PAGE_SIZE)) state.page = 1;
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = state.filtered.slice(start, start + PAGE_SIZE);

    grid.innerHTML = '';
    if(!pageItems.length){
      const empty = document.createElement('div');
      empty.className = 'col-span-full bg-surface rounded-3xl p-10 text-center shadow';
      empty.innerHTML = `
        <div class="text-3xl">Oops!</div>
        <p class="mt-3 text-slate-600 dark:text-slate-400">No products match your search.</p>`;
      grid.appendChild(empty);
      renderPagination();
      return;
    }

    pageItems.forEach(p => {
      const favs = storage.getFavs();
      const active = favs.includes(p.id);
      const card = document.createElement('div');
      card.className = 'bg-surface rounded-3xl shadow p-4 transition hover:-translate-y-1 hover:shadow-2xl';
      card.innerHTML = `
        <div class="relative rounded-3xl overflow-hidden">
          <img src="${p.image}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80'" class="w-full h-44 object-cover" />
          <button data-id="${p.id}" class="favBtn absolute top-3 right-3 rounded-full p-3 bg-white/90 text-red-500 shadow ${active ? 'text-red-600' : ''}">
            <i class="${active ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>
        <div class="mt-4">
          <span class="text-xs uppercase tracking-[0.2em] text-primary">${p.category}</span>
          <h3 class="mt-3 font-semibold text-lg">${p.title}</h3>
          <div class="mt-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>${p.rating.toFixed(1)} ★</span>
            <span>${formatPrice(p.price)}</span>
          </div>
          <div class="mt-4 flex items-center gap-3">
            <a href="product-detail.html?id=${p.id}" class="text-sm text-slate-600 hover:text-primary">View</a>
            <button data-id="${p.id}" class="addBtn btn-primary rounded-full px-3 py-2 text-sm">Add to Cart</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });

    renderPagination();
  }

  function renderPagination(){
    const paginationWrap = document.getElementById('pagination');
    if(!paginationWrap) return;
    const pageCount = Math.ceil(state.filtered.length / PAGE_SIZE);
    if(pageCount <= 1){ paginationWrap.innerHTML = ''; return; }

    let html = '';
    for(let i = 1; i <= pageCount; i++){
      html += `<button class="px-3 py-1 rounded ${i === state.page ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}" data-page="${i}">${i}</button>`;
    }
    paginationWrap.innerHTML = `<div class="flex flex-wrap gap-2 justify-center">${html}</div>`;
    paginationWrap.querySelectorAll('button').forEach(btn => btn.addEventListener('click',()=>{ state.page = Number(btn.dataset.page); renderProducts(); }));
  }

  function renderProductDetail(){
    const wrap = document.getElementById('productDetail');
    if(!wrap) return;
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const p = findProduct(id);
    if(!p){ wrap.innerHTML = '<div>Product not found</div>'; return; }

    wrap.innerHTML = `
      <div class="space-y-6">
        <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="rounded-3xl overflow-hidden shadow-lg"><img src="${p.image}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover" /></div>
          <div class="space-y-4">
            <div class="rounded-3xl p-5 bg-surface shadow-lg">
              <span class="text-xs uppercase tracking-[0.2em] text-primary">${p.category}</span>
              <h1 class="text-3xl font-bold mt-3">${p.title}</h1>
              <div class="mt-4 flex items-center gap-4 text-slate-500 dark:text-slate-400">
                <span>${p.rating.toFixed(1)} ★</span>
                <span>${formatPrice(p.price)}</span>
              </div>
              <p class="mt-4 text-slate-600 dark:text-slate-300">${p.description}</p>
              <ul class="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Premium finishing with modern design</li>
                <li>• Fast delivery and excellent warranty</li>
                <li>• Suitable for home and office use</li>
              </ul>
              <div class="mt-5 flex flex-wrap gap-3">
                <input id="qtyInput" type="number" min="1" value="1" class="w-24 border rounded-xl px-3 py-2 bg-surface" />
                <button id="addToCartBtn" class="btn-primary rounded-xl px-5 py-3">Add to Cart</button>
                <button id="buyNowBtn" class="btn-outline rounded-xl px-5 py-3">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
        <div class="grid gap-4 lg:grid-cols-3">
          <div class="rounded-3xl p-5 bg-surface shadow-lg">
            <h2 class="font-semibold">Product Features</h2>
            <ul class="mt-3 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
              <li>• High quality build</li>
              <li>• Modern marketplace design</li>
              <li>• Trusted seller support</li>
            </ul>
          </div>
          <div class="rounded-3xl p-5 bg-surface shadow-lg lg:col-span-2">
            <h2 class="font-semibold">Related Products</h2>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3" id="relatedProducts"></div>
          </div>
        </div>
      </div>`;

    document.getElementById('addToCartBtn').addEventListener('click', () => {
      const qty = Number(document.getElementById('qtyInput').value) || 1;
      addToCart(p.id, qty);
      toast('Added to cart');
    });
    document.getElementById('buyNowBtn').addEventListener('click', () => {
      addToCart(p.id, Number(document.getElementById('qtyInput').value) || 1);
      location.href = 'checkout.html';
    });

    renderRelatedProducts(p);
  }

  function renderRelatedProducts(product){
    const wrap = document.getElementById('relatedProducts');
    if(!wrap) return;
    const related = PRODUCTS.filter(item => item.category === product.category && item.id !== product.id).slice(0,4);
    wrap.innerHTML = related.map(p => `
      <a href="product-detail.html?id=${p.id}" class="block rounded-3xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
        <div class="font-semibold">${p.title}</div>
        <div class="mt-2 text-sm text-slate-500 dark:text-slate-400">${formatPrice(p.price)}</div>
      </a>`).join('');
  }

  function renderCartPage(){
    const listWrap = document.getElementById('cartList');
    if(!listWrap) return;
    const cart = storage.getCart();
    listWrap.innerHTML = '';
    if(cart.length === 0){
      listWrap.innerHTML = `
        <div class="p-8 rounded-3xl bg-surface shadow text-center">
          <div class="text-3xl">🛒</div>
          <p class="mt-4 text-slate-600 dark:text-slate-400">Your cart is empty. Add products to continue.</p>
        </div>`;
      document.getElementById('cartSubtotal') && (document.getElementById('cartSubtotal').textContent = formatPrice(0));
      return;
    }

    let subtotal = 0;
    cart.forEach(item => {
      const product = findProduct(item.id);
      if(!product) return;
      const row = document.createElement('div');
      row.className = 'flex flex-col gap-4 bg-surface rounded-3xl p-4 shadow md:flex-row md:items-center';
      row.innerHTML = `
        <img src="${product.image}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80'" class="w-full h-44 rounded-3xl object-cover md:w-36 md:h-28" />
        <div class="flex-1 space-y-2">
          <div class="font-semibold">${product.title}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">${product.category}</div>
          <div class="text-primary font-semibold">${formatPrice(product.price)}</div>
          <div class="flex items-center gap-2">
            <button class="decBtn px-3 py-1 rounded-xl border" data-id="${product.id}">-</button>
            <span>${item.qty}</span>
            <button class="incBtn px-3 py-1 rounded-xl border" data-id="${product.id}">+</button>
          </div>
          <button class="removeBtn text-sm text-red-500" data-id="${product.id}">Remove</button>
        </div>
        <div class="text-right text-lg font-semibold">${formatPrice(product.price * item.qty)}</div>`;
      listWrap.appendChild(row);
      subtotal += product.price * item.qty;
    });
    document.getElementById('cartSubtotal') && (document.getElementById('cartSubtotal').textContent = formatPrice(subtotal));
    document.querySelectorAll('.incBtn').forEach(btn => btn.addEventListener('click', e => {
      const id = Number(e.currentTarget.dataset.id);
      const cart = storage.getCart();
      const item = cart.find(entry => entry.id === id);
      if(item){ item.qty += 1; storage.saveCart(cart); renderCartPage(); updateBadges(); }
    }));
    document.querySelectorAll('.decBtn').forEach(btn => btn.addEventListener('click', e => {
      const id = Number(e.currentTarget.dataset.id);
      const cart = storage.getCart();
      const item = cart.find(entry => entry.id === id);
      if(item){ item.qty -= 1; if(item.qty < 1){ removeFromCart(id); } else { storage.saveCart(cart); renderCartPage(); updateBadges(); }}
    }));
    document.querySelectorAll('.removeBtn').forEach(btn => btn.addEventListener('click', e => {
      removeFromCart(Number(e.currentTarget.dataset.id));
      toast('Item removed from cart');
    }));
  }

  function removeFromCart(id){
    const cart = storage.getCart().filter(item => item.id !== id);
    storage.saveCart(cart);
    renderCartPage();
    updateBadges();
  }

  function addToCart(id, qty=1){
    const cart = storage.getCart();
    const item = cart.find(entry => entry.id === id);
    if(item) item.qty += qty;
    else cart.push({ id, qty });
    storage.saveCart(cart);
    updateBadges();
    toast('Product added to cart');
  }

  function renderOrderSummary(){
    const el = document.getElementById('orderSummary');
    if(!el) return;
    const cart = storage.getCart();
    if(cart.length === 0){
      el.innerHTML = '<div class="text-slate-500">No items in your order yet.</div>';
      return;
    }
    let total = 0;
    const lines = cart.map(item => {
      const product = findProduct(item.id);
      if(!product) return '';
      const lineTotal = product.price * item.qty;
      total += lineTotal;
      return `
        <div class="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
          <span>${product.title} x ${item.qty}</span>
          <span>${formatPrice(lineTotal)}</span>
        </div>`;
    }).join('');
    el.innerHTML = `${lines}<div class="mt-4 text-lg font-semibold">Total: ${formatPrice(total)}</div>`;
  }

  function updateFilters(){
    const input = document.getElementById('searchInput');
    if(input) state.query = input.value;
    const category = document.getElementById('categoryFilter');
    if(category) state.category = category.value;
    const sort = document.getElementById('sortSelect');
    if(sort) state.sort = sort.value;
    state.page = 1;
    renderProducts();
  }

  function setupSearchFilters(){
    const search = document.getElementById('searchInput');
    if(search) search.addEventListener('input', () => updateFilters());
    const category = document.getElementById('categoryFilter');
    if(category) category.addEventListener('change', () => updateFilters());
    const sort = document.getElementById('sortSelect');
    if(sort) sort.addEventListener('change', () => updateFilters());
  }

  function setupDelegation(){
    document.body.addEventListener('click', e => {
      const addBtn = e.target.closest('.addBtn');
      if(addBtn){ const id = Number(addBtn.dataset.id); addToCart(id); return; }
      const favBtn = e.target.closest('.favBtn');
      if(favBtn){
        const id = Number(favBtn.dataset.id);
        const favs = storage.getFavs();
        if(favs.includes(id)){
          storage.saveFavs(favs.filter(item => item !== id));
          favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        } else {
          favs.push(id);
          storage.saveFavs(favs);
          favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }
        return;
      }
      const mobileBtn = e.target.closest('#mobileMenuBtn');
      if(mobileBtn){
        const menu = document.getElementById('mobileMenu');
        if(menu) menu.classList.toggle('hidden');
      }
    });
  }

  function setupNewsletter(){
    const form = document.getElementById('newsletterForm');
    if(!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      if(!email){ toast('Please enter a valid email'); return; }
      toast('Subscribed successfully');
      form.reset();
    });
  }

  function setupCoupon(){
    const btn = document.getElementById('applyCouponBtn');
    if(!btn) return;
    btn.addEventListener('click', () => {
      const code = document.getElementById('couponInput').value.trim().toUpperCase();
      const subtotalEl = document.getElementById('cartSubtotal');
      if(!subtotalEl){ toast('Cart is empty'); return; }
      const subtotal = Number(subtotalEl.textContent.replace('$',''));
      if(code === 'DISCOUNT10' && subtotal > 0){
        subtotalEl.textContent = formatPrice(subtotal * 0.9);
        toast('Coupon applied');
      } else {
        toast('Invalid coupon');
      }
    });
  }

  function setupCheckout(){
    const form = document.getElementById('checkoutForm');
    if(!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      toast('Checkout successful');
      localStorage.removeItem('cart');
      updateBadges();
      setTimeout(() => location.href = 'index.html', 1200);
    });
  }

  function setupDarkToggle(){
    const btn = document.getElementById('darkToggle');
    if(!btn) return;
    btn.addEventListener('click', () => {
      const active = document.documentElement.classList.toggle('dark');
      storage.saveDark(active);
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    applyDarkMode(storage.getDark());
    updateBadges();
    renderFeatured();
    renderProductDetail();
    renderCartPage();
    renderOrderSummary();
    renderProducts();
    setupSearchFilters();
    setupDelegation();
    setupNewsletter();
    setupCoupon();
    setupCheckout();
    setupDarkToggle();
  });

  window.addToCart = addToCart;
})();