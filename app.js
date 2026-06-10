const adminWa = "6281234567890"; // ganti dengan nomor WhatsApp kamu

const categories = [
  {name:"Loose", icon:"🚗", desc:"Lihat semua produk loose"},
  {name:"Blister", icon:"📦", desc:"Hot Wheels carded / blister"},
  {name:"Premium", icon:"⭐", desc:"Hot Wheels Premium & Car Culture"},
  {name:"TH", icon:"🏆", desc:"Semua seri Treasure Hunt"},
  {name:"STH", icon:"💎", desc:"Semua seri Super Treasure Hunt"},
  {name:"Display", icon:"🗄️", desc:"Rak / display untuk koleksi"},
  {name:"Protector", icon:"🛡️", desc:"Protector untuk carded"},
  {name:"Aksesoris", icon:"🔧", desc:"Diorama, ban, decal, dll"}
];

const products = [
  {id:1,name:"Nissan Skyline GT-R R34", price:75000, category:"Blister", condition:"Blister Mint", series:"Factory Fresh 2023", location:"Jakarta Timur", seller:"AmiWheels Garage", rating:"4.9 (120)", desc:"Kondisi card blister bagus, blister bening, tidak pecah. Minat? Chat langsung via WhatsApp.", icon:"Nissan Skyline GT-R R34"},
  {id:2,name:"Toyota Supra MK4", price:60000, category:"Loose", condition:"Good", series:"JDM Collection", location:"Bandung", seller:"AmiWheels Garage", rating:"4.9 (120)", desc:"Loose kondisi good, cocok untuk koleksi atau display.", icon:"Toyota Supra MK4"},
  {id:3,name:"Display Acrylic 1:64", price:120000, category:"Display", condition:"Baru", series:"6 Slot", location:"Surabaya", seller:"AmiWheels Garage", rating:"4.9 (120)", desc:"Display acrylic untuk mobil skala 1:64, tampilan rapi dan premium.", icon:"Display Acrylic 1:64"},
  {id:4,name:"Blister Protector 10pcs", price:25000, category:"Protector", condition:"Baru", series:"Carded Protector", location:"Jakarta", seller:"AmiWheels Garage", rating:"4.9 (120)", desc:"Protector bening untuk menjaga card Hot Wheels tetap aman.", icon:"Blister Protector 10pcs"},
  {id:5,name:"Porsche 911 GT3 RS", price:150000, category:"Premium", condition:"Mint", series:"Premium", location:"Depok", seller:"AmiWheels Garage", rating:"4.9 (120)", desc:"Premium mint, cocok untuk kolektor Porsche dan JDM garage display.", icon:"Porsche 911 GT3 RS"},
  {id:6,name:"Honda Civic EG", price:60000, category:"Loose", condition:"Good", series:"Custom Look", location:"Bogor", seller:"AmiWheels Garage", rating:"4.9 (120)", desc:"Loose good condition, warna menarik untuk koleksi harian.", icon:"Honda Civic EG"}
];
let favorites = new Set([1,2,3]);

function rupiah(n){return "Rp " + n.toLocaleString("id-ID")}
function waLink(text){return `https://wa.me/${adminWa}?text=${encodeURIComponent(text)}`}
function renderCategories(){
  const home = document.getElementById("homeCategories");
  const list = document.getElementById("categoryList");
  home.innerHTML = categories.map(c=>`<button class="cat-card" onclick="filterCategory('${c.name}')"><span class="ico">${c.icon}</span>${c.name}</button>`).join("");
  list.innerHTML = categories.map(c=>`<button class="cat-row" onclick="filterCategory('${c.name}')"><span class="ico">${c.icon}</span><div><h3>Hot Wheels ${c.name}</h3><p>${c.desc}</p></div><b>›</b></button>`).join("");
}
function productCard(p){
  return `<article class="product-card"><div class="product-photo" onclick="openDetail(${p.id})"><button class="heart ${favorites.has(p.id)?'saved':''}" onclick="event.stopPropagation();toggleFav(${p.id})">♥</button>${p.icon}</div><div class="product-info"><span class="badge">Tersedia</span><h3>${p.name}</h3><p class="price">${rupiah(p.price)}</p><p class="meta">${p.category} • ${p.condition}<br>${p.location}</p><button class="chat-btn" onclick="location.href='${waLink('Halo AmiWheels, saya tertarik dengan '+p.name)}'">Chat Penjual</button></div></article>`
}
function renderProducts(items=products){document.getElementById("productGrid").innerHTML = items.map(productCard).join("")}
function renderFavorites(){const items=products.filter(p=>favorites.has(p.id));document.getElementById("favoriteGrid").innerHTML = items.length?items.map(productCard).join(""):'<p style="margin:0 18px;color:#777">Belum ada produk favorit.</p>'}
function toggleFav(id){favorites.has(id)?favorites.delete(id):favorites.add(id);renderProducts();renderFavorites()}
function filterCategory(cat){showPage('beranda');renderProducts(products.filter(p=>p.category===cat))}
function openDetail(id){const p=products.find(x=>x.id===id);document.getElementById("detailContent").innerHTML=`<div class="detail-photo">${p.icon}</div><div class="detail-box"><div class="detail-title"><h2>${p.name}</h2><span class="badge">Tersedia</span></div><p class="detail-price">${rupiah(p.price)}</p><div class="detail-row"><b>Kondisi</b><span>${p.condition}</span></div><div class="detail-row"><b>Seri</b><span>${p.series}</span></div><div class="detail-row"><b>Lokasi</b><span>${p.location}</span></div><div class="seller"><div class="seller-logo">AW</div><div><b>${p.seller}</b><br><span>⭐ ${p.rating}</span></div></div><h3>Deskripsi</h3><p class="meta">${p.desc}</p><button class="wa-wide" onclick="location.href='${waLink('Halo AmiWheels, saya tertarik dengan '+p.name)}'">💬 Chat Penjual</button></div>`;showPage('detail')}
function showPage(id, btn){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));if(btn)btn.classList.add('active');if(id==='favorit')renderFavorites();window.scrollTo({top:0,behavior:'smooth'})}
function scrollToProducts(){document.getElementById('produk').scrollIntoView({behavior:'smooth'});}
function sendListing(e){e.preventDefault();const text=`Halo Admin AmiWheels, saya mau jual produk:%0A%0ANama: ${sellName.value}%0AHarga: ${sellPrice.value}%0AKategori: ${sellCategory.value}%0AKondisi: ${sellCondition.value}%0ALokasi: ${sellLocation.value}%0ADeskripsi: ${sellDesc.value}%0AWA Penjual: ${sellWa.value}`;location.href=`https://wa.me/${adminWa}?text=${text}`}
document.getElementById('searchInput').addEventListener('input',e=>{const q=e.target.value.toLowerCase();renderProducts(products.filter(p=>`${p.name} ${p.category} ${p.condition} ${p.location}`.toLowerCase().includes(q)))});
renderCategories();renderProducts();renderFavorites();
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    const text = item.innerText.toLowerCase();

    if (text.includes("produk saya")) {
      document.querySelector("#jual")?.scrollIntoView({ behavior: "smooth" });
    } else if (text.includes("favorit")) {
      document.querySelector("#favorit")?.scrollIntoView({ behavior: "smooth" });
    } else if (text.includes("bantuan")) {
      window.open("https://wa.me/6281234567890?text=Halo%20AmiWheels,%20saya%20butuh%20bantuan", "_blank");
    } else if (text.includes("tentang")) {
      alert("AmiWheels adalah marketplace ringan untuk jual beli Hot Wheels, display, dan blister protector.");
    } else if (text.includes("keluar")) {
      alert("Fitur login belum tersedia di versi ringan.");
    } else {
      alert("Fitur ini segera hadir di AmiWheels.");
    }
  });
});
document.addEventListener("click", function (e) {
  const text = e.target.innerText?.toLowerCase() || "";

  if (text.includes("produk saya")) {
    alert("Produk Saya akan tersedia di versi berikutnya.");
  }

  if (text.includes("transaksi")) {
    alert("Fitur Transaksi segera hadir.");
  }

  if (text.includes("pesanan")) {
    alert("Fitur Pesanan segera hadir.");
  }

  if (text.includes("favorit")) {
    showPage("favorit");
  }

  if (text.includes("pengaturan akun")) {
    alert("Pengaturan Akun segera hadir.");
  }

  if (text.includes("bantuan")) {
    window.open("https://wa.me/6281234567890?text=Halo%20AmiWheels,%20saya%20butuh%20bantuan", "_blank");
  }

  if (text.includes("tentang amiwheels")) {
    alert("AmiWheels adalah marketplace ringan untuk jual beli Hot Wheels, display, dan blister protector.");
  }

  if (text.includes("keluar")) {
    alert("Fitur login belum tersedia di versi ringan.");
  }
});
