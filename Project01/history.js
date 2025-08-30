const qs=s=>document.querySelector(s); const qsa=s=>document.querySelectorAll(s);
function readOrders(){return JSON.parse(localStorage.getItem('orders.modulie')||'[]');}
const baht=n=>'฿'+n.toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});

function render(){
  const box=qs('#orders'); box.innerHTML='';
  const orders = readOrders();
  if(orders.length===0){ box.innerHTML='<div class="muted">ยังไม่มีประวัติการสั่งซื้อ</div>'; return; }
  orders.forEach(o=>{
    const div=document.createElement('div');
    div.className='form';
    const d=new Date(o.createdAt);
    const items = o.items.map(it=>{
      const label = it.variantId==='single'?'1 ชิ้น':'เซ็ท 4 ชิ้น';
      const line = it.price*it.qty;
      return `<tr><td>NGK 90654 SILZKFR8E7S</td><td>${label}</td><td>${it.qty}</td><td>${baht(it.price)}</td><td>${baht(line)}</td></tr>`;
    }).join('');
    const totalNum = o.amounts?.grand ??
  o.items.reduce((a,b)=>a+b.price*b.qty,0);

const subtotal = o.amounts?.subtotal ?? totalNum;
const discount = o.amounts?.discount ?? 0;
const grand = o.amounts?.grand ?? (subtotal - discount);

div.innerHTML = `
  ...
  <table class="table">
    <thead><tr><th>สินค้า</th><th>ตัวเลือก</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>รวม</th></tr></thead>
    <tbody>${items}</tbody>
    <tfoot>
      <tr><th colspan="4" style="text-align:right">ยอดย่อย</th><th>${baht(subtotal)}</th></tr>
      <tr><th colspan="4" style="text-align:right">ส่วนลด</th><th>- ${baht(discount)}</th></tr>
      <tr><th colspan="4" style="text-align:right">ยอดรวมสุทธิ</th><th>${baht(grand)}</th></tr>
    </tfoot>
  </table>
  ${o.amounts?.coupon?.code ? `<div class="muted">ใช้โค้ด: ${o.amounts.coupon.code} — ${o.amounts.coupon.note||''}</div>` : ''}
`;

    box.appendChild(div);
  });
}
render();
qs('#yy').textContent=new Date().getFullYear();