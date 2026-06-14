const STORE_KEY="amiwheels_products_customer_admin_v1";
const SALES_KEY="amiwheels_sales_customer_admin_v1";

const demoProducts=[
 {id:crypto.randomUUID(),name:"Nissan Skyline GT-R R34",brand:"Hot Wheels",category:"Koleksi Premium",condition:"MOC",price:350000,stock:10,sold:0,whatsapp:"6281234567890",image:"https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=800&auto=format&fit=crop",createdAt:new Date().toISOString()},
 {id:crypto.randomUUID(),name:"Toyota Supra MK4",brand:"Hot Wheels",category:"Mobil Die-cast Standar",condition:"MOC",price:320000,stock:2,sold:8,whatsapp:"6281234567890",image:"https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=800&auto=format&fit=crop",createdAt:new Date().toISOString()},
 {id:crypto.randomUUID(),name:"Display Acrylic 12 Slot",brand:"AmiWheels",category:"Display & Blister",condition:"New",price:120000,stock:0,sold:10,whatsapp:"6281234567890",image:"https://images.unsplash.com/photo-1605515298946-d66455f10c87?q=80&w=800&auto=format&fit=crop",createdAt:new Date().toISOString()}
];

function products(){
 const saved=localStorage.getItem(STORE_KEY);
 if(!saved){localStorage.setItem(STORE_KEY,JSON.stringify(demoProducts));return demoProducts}
 return JSON.parse(saved);
}
function saveProducts(data){localStorage.setItem(STORE_KEY,JSON.stringify(data))}
function sales(){return JSON.parse(localStorage.getItem(SALES_KEY)||"[]")}
function saveSales(data){localStorage.setItem(SALES_KEY,JSON.stringify(data))}
function rupiah(n){return "Rp "+Number(n||0).toLocaleString("id-ID")}
function statusOf(p){return Number(p.stock)<=0?"soldout":"active"}
function badge(p){
 if(statusOf(p)==="soldout")return `<span class="badge sold">SOLD OUT</span>`;
 if(Number(p.stock)<=2)return `<span class="badge low">TINGGAL ${p.stock}</span>`;
 return `<span class="badge">READY STOCK</span>`;
}
function totals(){
 const ps=products().map(p=>({...p,status:statusOf(p)}));
 const active=ps.filter(p=>p.status==="active").length;
 const soldout=ps.filter(p=>p.status==="soldout").length;
 const sold=ps.reduce((a,p)=>a+Number(p.sold||0),0);
 const revenue=sales().reduce((a,s)=>a+Number(s.total||0),0);
 return {active,soldout,sold,revenue};
}
function card(p, customer=true){
 const soldout=statusOf(p)==="soldout";
 const image=p.image||"https://placehold.co/500x400/111827/ffffff?text=AmiWheels";
 const text=encodeURIComponent(`Halo, saya tertarik dengan ${p.name} di AmiWheels`);
 return `<article class="card ${soldout?"soldout":""}">
  ${soldout?`<div class="ribbon">SOLD OUT</div>`:""}
  <img src="${image}" alt="${p.name}">
  <div class="card-body">
   <h3>${p.name}</h3>
   <small>${p.category}</small>
   <div class="price">${rupiah(p.price)}</div>
   <small>Stok: ${p.stock} • Terjual: ${p.sold||0}</small><br>
   ${badge(p)}
   ${customer?`<a class="btn full ${soldout?"dark":"green"}" style="margin-top:8px;pointer-events:${soldout?"none":"auto"}" target="_blank" href="https://wa.me/${p.whatsapp}?text=${text}">${soldout?"Stok Habis":"Chat WhatsApp"}</a>`:""}
  </div>
 </article>`
}
function filtered(q="",cat="all"){
 q=q.toLowerCase();
 return products().map(p=>({...p,status:statusOf(p)})).filter(p=>{
  const mcat=cat==="all"||p.category===cat;
  const mq=p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.category.toLowerCase().includes(q);
  return mcat&&mq;
 }).sort((a,b)=>{
  if(a.status!==b.status)return a.status==="active"?-1:1;
  return new Date(b.createdAt)-new Date(a.createdAt);
 });
}
function invoice(){return "AW-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+Math.floor(1000+Math.random()*9000)}
function addSale(p,qty=1){
 const data=sales();
 data.unshift({id:crypto.randomUUID(),invoice:invoice(),productName:p.name,brand:p.brand,category:p.category,condition:p.condition,qty,price:Number(p.price),total:Number(p.price)*qty,status:"Selesai",date:new Date().toISOString()});
 saveSales(data);
}
function copyReceipt(id){
 const s=sales().find(x=>x.id===id); if(!s)return;
 const txt=`BUKTI PEMBELIAN AMIWHEELS\nInvoice: ${s.invoice}\nProduk: ${s.productName}\nQty: ${s.qty}\nHarga: ${rupiah(s.price)}\nTotal: ${rupiah(s.total)}\nStatus: ${s.status}\nTanggal: ${new Date(s.date).toLocaleString("id-ID")}`;
 navigator.clipboard.writeText(txt); alert("Bukti pembelian disalin.");
}
function exportSales(){
 const rows=[["Invoice","Tanggal","Produk","Qty","Harga","Total","Status"],...sales().map(s=>[s.invoice,new Date(s.date).toLocaleString("id-ID"),s.productName,s.qty,s.price,s.total,s.status])];
 const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
 const blob=new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob);
 const a=document.createElement("a"); a.href=url; a.download="amiwheels-history.csv"; a.click(); URL.revokeObjectURL(url);
}
