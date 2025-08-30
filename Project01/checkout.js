const qs=s=>document.querySelector(s);
const baht=n=>'฿'+(Number(n)||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});
function readCart(){return JSON.parse(localStorage.getItem('cart.modulie')||'[]');}
function writeOrders(arr){localStorage.setItem('orders.modulie',JSON.stringify(arr));}
function readOrders(){return JSON.parse(localStorage.getItem('orders.modulie')||'[]');}

function renderSummary(){
  const cart = readCart();
  const tbody = qs('#summary tbody'); tbody.innerHTML='';
  let subtotal = 0;
  cart.forEach(row=>{
    const name = 'สินค้า'; // กรณีต้องการชื่อเต็ม ให้ฝั่ง index เก็บชื่อมาด้วยก็ได้
    const label = row.variantId==='set4'?'เซ็ท 4 ชิ้น': (row.variantId==='single'?'1 ชิ้น':'');
    const line = (row.price||0)*row.qty;
    subtotal += line;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td>${label}</td><td>${row.qty}</td><td>${baht(row.price)}</td><td>${baht(line)}</td>`;
    tbody.appendChild(tr);
  });

  const discount = Number(localStorage.getItem('cart.discount')||'0');
  const grand = Math.max(subtotal - discount, 0);

  // ปรับ footer: แสดง 3 แถว (ยอดย่อย/ส่วนลด/ยอดรวมสุทธิ)
  const tfoot = qs('#summary tfoot');
  tfoot.innerHTML = `
    <tr><th colspan="4" style="text-align:right">ยอดย่อย</th><th>${baht(subtotal)}</th></tr>
    <tr><th colspan="4" style="text-align:right">ส่วนลด</th><th>- ${baht(discount)}</th></tr>
    <tr><th colspan="4" style="text-align:right">ยอดรวมสุทธิ</th><th id="grand">${baht(grand)}</th></tr>
  `;
}
renderSummary();


qs('#placeOrder').addEventListener('click', ()=>{
  const name=qs('#name').value.trim(), phone=qs('#phone').value.trim(), address=qs('#address').value.trim();
  if(!name||!phone||!address){ alert('กรุณากรอกชื่อ เบอร์โทร และที่อยู่'); return; }

  const subtotal = Number(localStorage.getItem('cart.subtotal')||'0');
  const discount = Number(localStorage.getItem('cart.discount')||'0');
  const coupon = JSON.parse(localStorage.getItem('coupon.modulie')||'null');
  const grand = Math.max(subtotal - discount, 0);

  const order={
    id:'OD'+Date.now(),
    createdAt:new Date().toISOString(),
    customer:{name,phone,address,payment:qs('#payment').value,note:qs('#note').value},
    items: readCart(),
    amounts:{subtotal, discount, grand, coupon},
    status:'รอชำระ'
  };

  const orders = readOrders(); orders.unshift(order); writeOrders(orders);
  localStorage.setItem('cart.modulie','[]'); // clear cart
  localStorage.removeItem('cart.subtotal');
  localStorage.removeItem('cart.discount');
  // คูปองยังเก็บต่อได้ หรือจะล้างก็เพิ่มบรรทัดนี้:
  // localStorage.removeItem('coupon.modulie');

  window.location.href='history.html';
});

qs('#yy').textContent=new Date().getFullYear();

// Toggle payment info block
(function(){
  const sel = document.getElementById('payment');
  const bank = document.getElementById('bankInfo');
  const pp = document.getElementById('ppInfo');
  if(!sel || !bank || !pp) return;
  function sync(){
    if(sel.value === 'ธนาคาร'){ bank.style.display='block'; pp.style.display='none'; }
    else { bank.style.display='none'; pp.style.display='block'; }
  }
  sel.addEventListener('change', sync);
  sync();
})();
