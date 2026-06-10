const ADMIN_WA = "6281234567890";
const products = [
  {id:1,name:"Nissan Skyline GT-R R34",price:75000,cat:"Blister",condition:"Blister Mint",loc:"Jakarta Timur",rare:"R34"},
  {id:2,name:"Toyota Supra MK4",price:60000,cat:"Loose",condition:"Good",loc:"Bandung",rare:"JDM"},
  {id:3,name:"Display Acrylic 1:64",price:120000,cat:"Display",condition:"Baru",loc:"Surabaya",rare:"CASE"},
  {id:4,name:"Blister Protector 10pcs",price:25000,cat:"Protector",condition:"Baru",loc:"Jakarta",rare:"PACK"},
  {id:5,name:"Porsche 911 GT3 RS",price:150000,cat:"Premium",condition:"Mint",loc:"Depok",rare:"PREM"},
  {id:6,name:"Honda Civic EG",price:60000,cat:"Loose",condition:"Good",loc:"Bogor",rare:"EG"},
  {id:7,name:"Super Treasure Hunt Rare",price:450000,cat:"STH",condition:"Mint",loc:"Bekasi",rare:"STH"},
  {id:8,name:"Treasure Hunt Gold",price:180000,cat:"TH",condition:"Mint",loc:"Tangerang",rare:"TH"}
];
const transactions = {
  "AMI-24001": {buyer:"Raka", item:"Nissan Skyline GT-R R34", status:"Selesai", proof:"Packing aman, barang diterima"},
  "AMI-24002": {buyer:"Dina", item:"Display Acrylic 1:64", status:"Selesai", proof:"Pembayaran dan pengiriman selesai"},
  "AMI-24003": {buyer:"Bayu", item:"Blister Protector 10pcs", status:"Dikirim", proof:"Resi sudah diberikan admin"}
};
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
function rupiah(n){return new Intl.NumberFormat("id-ID").format(n)}
function card(p){
  const liked = favorites.includes(p.id);
  return `<article class="product-card"><button class="fav" onclick="toggleFav(${p.id})">${liked?'♥':'♡'}</button><div class="product-img">${p.name}<br><small>${p.rare}</small></div><div class="product-body"><span class="badge">Tersedia</span><h3>${p.name}</h3><div class="price">Rp ${rupiah(p.price)}</div><div class="meta">${p.cat} • ${p.condition}<br>${p.loc}</div><button class="wa-btn" onclick="chatProduct('${p.name}',${p.price})">Chat Penjual</button></div></article>`;
}
function render(list=products){
  const home = document.getElementById("productGrid");
  const all = document.getElementById("allProductGrid");
  if(home) home.innerHTML = list.slice(0,6).map(card).join("");
  if(all) all.innerHTML = list.map(card).join("");
  renderFav();
}
function renderFav(){
  const el = document.getElementById("favoriteGrid");
  if(!el) return;
  const list = products.filter(p=>favorites.includes(p.id));
  el.innerHTML = list.length ? list.map(card).join("") : "<p>Belum ada produk favorit.</p>";
}
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
function filterProducts(cat){
  const list = cat==="Semua" ? products : products.filter(p=>p.cat===cat);
  render(list); showPage("produk");
}
function searchProducts(){
  const q = document.getElementById("searchInput").value.toLowerCase();
  render(products.filter(p=>p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q))); showPage("produk");
}
function toggleFav(id){
  favorites = favorites.includes(id) ? favorites.filter(x=>x!==id) : [...favorites,id];
  localStorage.setItem("favorites",JSON.stringify(favorites)); render();
}
function chatProduct(name,price){
  window.open(`https://wa.me/${ADMIN_WA}?text=Halo%20AmiWheels,%20saya%20tertarik%20dengan%20${encodeURIComponent(name)}%20Rp%20${rupiah(price)}`,'_blank');
}
document.getElementById("sellForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const msg = `Halo AmiWheels, saya ingin jual produk:%0AProduk: ${sellName.value}%0AHarga: ${sellPrice.value}%0AKategori: ${sellCategory.value}%0AKondisi: ${sellCondition.value}%0ALokasi: ${sellLocation.value}%0AWA: ${sellWa.value}%0ADeskripsi: ${sellDesc.value}`;
  window.open(`https://wa.me/${ADMIN_WA}?text=${msg}`,'_blank');
});
function checkTransaction(){
  const code = document.getElementById("trxCode").value.trim().toUpperCase();
  const box = document.getElementById("trxResult");
  const t = transactions[code];
  box.style.display="block";
  box.innerHTML = t ? `<b>${code}</b><br>Pembeli: ${t.buyer}<br>Produk: ${t.item}<br>Status: <b>${t.status}</b><br>Bukti: ${t.proof}` : "Kode transaksi tidak ditemukan. Hubungi admin AmiWheels.";
}
function fakeLogin(){
  const name = document.getElementById("loginName").value || "Pengguna AmiWheels";
  localStorage.setItem("amiUser", JSON.stringify({name, phone:document.getElementById("loginPhone").value}));
  document.getElementById("profileName").innerText = name;
  showPage("akun");
}
function showMyData(){
  const user = JSON.parse(localStorage.getItem("amiUser") || "{}");
  const box = document.getElementById("accountResult");
  box.style.display="block";
  box.innerHTML = `<b>Data Login Demo</b><br>Nama: ${user.name || 'Belum login'}<br>WA: ${user.phone || '-'}<br><br><b>Riwayat Transaksi</b><br>AMI-24001 • Selesai<br>AMI-24002 • Selesai<br>AMI-24003 • Dikirim`;
}
function copyBuyerLink(){
  navigator.clipboard?.writeText(location.href);
  const box = document.getElementById("accountResult");
  box.style.display="block"; box.innerHTML="Link toko untuk calon pembeli sudah disalin. Bagikan link website ini ke WhatsApp/Instagram.";
}
function helpWa(){window.open(`https://wa.me/${ADMIN_WA}?text=Halo%20AmiWheels,%20saya%20butuh%20bantuan`,'_blank')}
function logoutDemo(){localStorage.removeItem("amiUser");alert("Keluar dari login demo.")}
render();
