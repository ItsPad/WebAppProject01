// --- Robust storefront script (no duplicate PRODUCTS/CATS declarations here) ---

// Utilities
const qs = s => document.querySelector(s);
const el = (tag, attrs={}, ...children) => {
  const d = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') d.className=v;
    else if(k==='html') d.innerHTML=v;
    else if(k==='text') d.textContent=v;
    else d.setAttribute(k,v);
  });
  children.forEach(c=>d.append(c));
  return d;
};
const baht = n => '฿' + (Number(n)||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});

// Derive categories if CATS not provided
function deriveCats(products){
  const set = new Map();
  set.set('all', {id:'all', label:'ทั้งหมด'});
  products.forEach(p=>{
    if(p.cat && !set.has(p.cat)){
      const label = (p.cat==='ignition'?'ระบบจุดระเบิด': p.cat==='oil'?'ออยล์เพลท': p.cat==='turbo'?'เทอร์โบ': p.cat);
      set.set(p.cat, {id:p.cat, label});
    }
  });
  return Array.from(set.values());
}

// Global state
let activeCat = 'all';
let cart = JSON.parse(localStorage.getItem('cart.modulie') || '[]');

// Defensive checks
if (typeof PRODUCTS === 'undefined' || !Array.isArray(PRODUCTS)) {
  console.error('[Modulie] PRODUCTS was not found or is not an array. Check that products.js is loaded BEFORE script.js.');
  window.PRODUCTS = [];
}
if (typeof CATS === 'undefined' || !Array.isArray(CATS)) {
  console.warn('[Modulie] CATS not found. Deriving categories from PRODUCTS.');
  window.CATS = deriveCats(PRODUCTS);
}

// Render chips
function renderChips(){
  const box = qs('#chips');
  if(!box) return;
  box.innerHTML='';
  CATS.forEach(c=>{
    const btn = el('button',{class:'chip'+(c.id===activeCat?' active':''), 'data-id':c.id}, c.label);
    btn.addEventListener('click',()=>{ activeCat=c.id; renderChips(); renderGrid(); });
    box.append(btn);
  });
}

// Helpers for variants/gallery
function hasVariants(p){ return Array.isArray(p.variants) && p.variants.length>0; }
function getVariant(p, id){ return p.variants.find(v=>v.id===id) || p.variants[0]; }
function imgForCard(p){
  if (p.hero) return p.hero;
  if (Array.isArray(p.gallery) && p.gallery.length>0) return p.gallery[0];
  if (hasVariants(p)) return getVariant(p,'single').img || p.variants[0].img;
  return '';
}

// Render grid
function renderGrid(){
  const g = qs('#grid');
  if(!g) return;
  g.innerHTML='';
  const items = PRODUCTS.filter(p => activeCat==='all' || p.cat===activeCat);
  items.forEach(p=>{
    const card = el('article',{class:'card'});
    const t = el('div',{class:'thumb'}, el('img',{src: imgForCard(p), alt: p.name}));
    const body = el('div',{class:'card-body'});
    const priceShow = hasVariants(p) ? getVariant(p,'single').price : (p.price || 0);
    body.append(
      el('div',{class:'title'}, p.name),
      el('div',{class:'muted'}, CATS.find(c=>c.id===p.cat)?.label || p.cat || ''),
      el('div',{class:'price'}, baht(priceShow)),
      el('div',{class:'actions'},
        (()=>{const b=el('button',{class:'btn'},'รายละเอียด'); b.addEventListener('click',()=>openDetail(p.id)); return b;})(),
        (()=>{const b=el('button',{class:'btn primary'},'ใส่ตะกร้า'); b.addEventListener('click',()=>addToCart(p.id, hasVariants(p)?'single':(p.variantId||'single'), 1)); return b;})()
      )
    );
    card.append(t, body);
    g.append(card);
  });
}

// Detail modal
const detail = qs('#detail');
let detailId = null;
let detailVariant = 'single';

function openDetail(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  detailId = id;
  detailVariant = 'single';
  qs('#dTitle').textContent = p.name;
  qs('#dCat').textContent = CATS.find(c=>c.id===p.cat)?.label || p.cat || '';
  qs('#dDesc').textContent = p.desc || '';
  const v = hasVariants(p) ? getVariant(p, 'single') : {price: p.price || 0, img: imgForCard(p)};
  const imgEl = qs('#dImg');
  if (imgEl.tagName.toLowerCase()==='img') imgEl.src = v.img; else imgEl.textContent = '';
  qs('#dPrice').textContent = baht(v.price);
  qs('#dQty').value = 1;
  // render variants (if any)
  const box = qs('#dVariants'); box.innerHTML='';
  if (hasVariants(p)){
    p.variants.forEach(vv=>{
      const idr = `var-${p.id}-${vv.id}`;
      const label = el('label',{class:'radio',for:idr});
      const radio = el('input',{type:'radio',name:'variant',id:idr,value:vv.id});
      if(vv.id==='single') radio.checked = true;
      radio.addEventListener('change',()=>selectVariant(p, vv.id));
      label.append(radio, el('span',{}, `${vv.label} — ${baht(vv.price)}`));
      box.append(label);
    });
  }
  // Gallery thumbs if p.gallery
  setupGallery(p);
  detail.showModal();
}
function selectVariant(p, varId){
  detailVariant = varId;
  const v = getVariant(p, varId);
  const imgEl = qs('#dImg');
  if (imgEl.tagName.toLowerCase()==='img') imgEl.src = v.img;
  qs('#dPrice').textContent = baht(v.price);
}
qs('#dAdd')?.addEventListener('click', (e)=>{
  e.preventDefault();
  const qty = Math.max(1, parseInt(qs('#dQty').value||'1',10));
  addToCart(detailId, detailVariant, qty);
  detail.close();
});
detail?.addEventListener('click', (e)=>{
  const r = detail.getBoundingClientRect();
  if(!(e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom)){ detail.close(); }
});

// Gallery support for oil plate or any product with p.gallery
let galleryIndex = 0;
function setupGallery(p){
  const img = qs('#dImg');
  const note = qs('#variantNote');
  let bar = document.getElementById('thumbBar');
  const has = Array.isArray(p.gallery) && p.gallery.length>0;
  if(!has){ if(bar) bar.remove(); note.textContent=''; document.onkeydown=null; return; }
  galleryIndex=0;
  if (img.tagName.toLowerCase()==='img') img.src = p.gallery[0];
  note.textContent='เลื่อนรูปได้ (◀ ▶)';
  if(!bar){
    bar = document.createElement('div');
    bar.id='thumbBar';
    bar.style.display='flex'; bar.style.gap='6px'; bar.style.marginTop='8px'; bar.style.flexWrap='wrap';
    img.parentElement.parentElement.append(bar);
  }
  bar.innerHTML='';
  p.gallery.forEach((src,idx)=>{
    const t=document.createElement('img');
    t.src=src; t.style.width='64px'; t.style.height='64px'; t.style.objectFit='contain'; t.style.border='1px solid #eee'; t.style.borderRadius='8px'; t.style.cursor='pointer';
    if(idx===0) t.style.outline='2px solid #e50914';
    t.addEventListener('click',()=>{ galleryIndex=idx; img.src=src; Array.from(bar.children).forEach(x=>x.style.outline='none'); t.style.outline='2px solid #e50914'; });
    bar.appendChild(t);
  });
  document.onkeydown=(ev)=>{
    if(ev.key==='ArrowRight'){ galleryIndex=(galleryIndex+1)%p.gallery.length; img.src=p.gallery[galleryIndex]; }
    if(ev.key==='ArrowLeft'){ galleryIndex=(galleryIndex-1+p.gallery.length)%p.gallery.length; img.src=p.gallery[galleryIndex]; }
  };
}

// Cart
function addToCart(id, variantId, qty){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  let price = p.price||0;
  if(hasVariants(p)){ price = getVariant(p, variantId).price; }
  const key = `${id}:${variantId||'single'}`;
  const i = cart.findIndex(x=>x.key===key);
  if(i>-1) cart[i].qty += qty; else cart.push({key, id, variantId:variantId||'single', qty, price});
  persist(); renderCart();
}
function setQty(key, qty){ const i=cart.findIndex(x=>x.key===key); if(i<0) return; cart[i].qty=Math.max(1,qty|0); persist(); renderCart(); }
function removeItem(key){ cart = cart.filter(x=>x.key!==key); persist(); renderCart(); }
function clearCart(){ cart = []; persist(); renderCart(); }
function persist(){ localStorage.setItem('cart.modulie', JSON.stringify(cart)); }

// คูปองตัวอย่าง แก้ได้ตามต้องการ
const COUPONS = {
  MOD10:   { type: 'percent', value: 10,  note: 'ลด 10%' },
  SAVE100: { type: 'amount',  value: 100, note: 'ลด 100.-' }
};

let coupon = JSON.parse(localStorage.getItem('coupon.modulie') || 'null');
const setCoupon = c => { coupon = c; localStorage.setItem('coupon.modulie', JSON.stringify(coupon)); };
const clearCoupon = () => { coupon = null; localStorage.removeItem('coupon.modulie'); };

function findCoupon(code){
  if(!code) return null;
  const key = code.trim().toUpperCase();
  return COUPONS[key] ? { code: key, ...COUPONS[key] } : null;
}
function calcDiscount(subtotal){
  if(!coupon) return 0;
  if(coupon.type === 'percent') return Math.round(subtotal * coupon.value) / 100;
  if(coupon.type === 'amount')  return coupon.value;
  return 0;
}

function renderCart(){
  const list = qs('#cartList');
  const count = cart.reduce((a,b)=>a+b.qty,0);
  qs('#cartCount').textContent = count;
  list.innerHTML='';

  let subtotal = 0;
  if(cart.length===0){
    list.append(el('div',{class:'muted'},'ยังไม่มีสินค้าในตะกร้า'));
  } else {
    cart.forEach(row=>{
      const p = PRODUCTS.find(x=>x.id===row.id);
      const label = Array.isArray(p?.variants) ? (p.variants.find(v=>v.id===row.variantId)?.label || '') : '';
      const imgSrc = Array.isArray(p?.variants) ? (p.variants.find(v=>v.id===row.variantId)?.img || (p.hero||'')) : (p?.hero||'');
      const line = (row.price||0) * row.qty;
      subtotal += line;

      const item = el('div',{class:'cart-item'});
      const ph = el('div',{class:'thumb',style:'aspect-ratio:1/1'}, el('img',{src:imgSrc,alt:label}));
      const info = el('div',{},
        el('div',{class:'title'}, p?.name || 'สินค้า'),
        label ? el('div',{}, el('span',{class:'chip-mini'},label)) : '',
        el('div',{class:'muted'}, `${baht(row.price)} × ${row.qty} = ${baht(line)}`)
      );
      const qty = el('div',{class:'qty-ctrl'},
        (()=>{const b=el('button',{class:'small'},'−'); b.addEventListener('click',()=>setQty(row.key,row.qty-1)); return b;})(),
        el('div',{}, row.qty),
        (()=>{const b=el('button',{class:'small'},'+'); b.addEventListener('click',()=>setQty(row.key,row.qty+1)); return b;})(),
        (()=>{const b=el('button',{class:'small'},'ลบ'); b.addEventListener('click',()=>removeItem(row.key)); return b;})()
      );
      item.append(ph,info,qty);
      list.append(item);
    });
  }

  // คิดส่วนลด
  const discount = Math.min(calcDiscount(subtotal), subtotal);
  const grand = Math.max(subtotal - discount, 0);

  // แสดงผลในส่วนตะกร้า
  const msg = qs('#couponMsg');
  if (coupon?.code && msg) msg.textContent = `ใช้โค้ด ${coupon.code} — ${coupon.note} (-${baht(discount)})`;

  // อัปเดตยอดรวม
  qs('#grand').textContent = baht(grand);

  // เก็บ subtotal สำหรับ checkout
  localStorage.setItem('cart.subtotal', String(subtotal));
  localStorage.setItem('cart.discount', String(discount));
}

// Drawer etc.
const drawer = qs('#drawer');
qs('#openCart')?.addEventListener('click', ()=> drawer.classList.add('open'));
qs('#mask')?.addEventListener('click', ()=> drawer.classList.remove('open'));
qs('#mask')?.addEventListener('click', ()=> drawer.classList.remove('open'));
qs('#closeCart')?.addEventListener('click', ()=> drawer.classList.remove('open'));
qs('#clearCart')?.addEventListener('click', clearCart);
const applyBtn = qs('#applyCoupon');
const codeInput = qs('#couponCode');
const couponMsg = qs('#couponMsg');

if (applyBtn && codeInput) {
  // แสดงโค้ดเดิม (ถ้ามี)
  if (coupon?.code) codeInput.value = coupon.code;

  applyBtn.addEventListener('click', ()=>{
    const c = findCoupon(codeInput.value);
    if(!c){
      couponMsg.textContent = 'โค้ดไม่ถูกต้อง';
      couponMsg.style.color = '#b91c1c';
      clearCoupon();
    }else{
      setCoupon(c);
      couponMsg.textContent = `ใช้โค้ด ${c.code} — ${c.note}`;
      couponMsg.style.color = 'inherit';
    }
    renderCart();
  });
}
qs('#goCheckout')?.addEventListener('click', ()=>{
  if(cart.length===0){ alert('ตะกร้ายังว่าง'); return; }
  window.location.href='checkout.html';
});

// Footer and initial render
qs('#yy').textContent = new Date().getFullYear();
renderChips();
renderGrid();
renderCart();
