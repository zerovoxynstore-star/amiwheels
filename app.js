const ADMIN_WA = '6281234567890'; // ganti dengan nomor WhatsApp AmiWheels

const products = [
  { id: 1, nama: 'Nissan Skyline GT-R R34', harga: 75000, kategori: 'Blister', kondisi: 'Blister Mint', lokasi: 'Jakarta Timur', status: 'Tersedia', wa: '6281234567890' },
  { id: 2, nama: 'Toyota Supra MK4', harga: 60000, kategori: 'Loose', kondisi: 'Good', lokasi: 'Bandung', status: 'Tersedia', wa: '6281234567890' },
  { id: 3, nama: 'Display Acrylic 1:64', harga: 120000, kategori: 'Display', kondisi: 'Baru', lokasi: 'Surabaya', status: 'Tersedia', wa: '6281234567890' },
  { id: 4, nama: 'Blister Protector 10pcs', harga: 25000, kategori: 'Protector', kondisi: 'Baru', lokasi: 'Jakarta', status: 'Tersedia', wa: '6281234567890' },
  { id: 5, nama: 'Porsche 911 GT3 RS', harga: 150000, kategori: 'Premium', kondisi: 'Mint', lokasi: 'Depok', status: 'Tersedia', wa: '6281234567890' },
  { id: 6, nama: 'Honda Civic EG', harga: 60000, kategori: 'Loose', kondisi: 'Good', lokasi: 'Bogor', status: 'Tersedia', wa: '6281234567890' }
];

const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const resultCount = document.getElementById('resultCount');
let activeCategory = 'Semua';

function rupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function renderProducts() {
  const keyword = searchInput.value.toLowerCase();
  const filtered = products.filter(p => {
    const matchCategory = activeCategory === 'Semua' || p.kategori === activeCategory;
    const matchKeyword = p.nama.toLowerCase().includes(keyword) || p.lokasi.toLowerCase().includes(keyword) || p.kategori.toLowerCase().includes(keyword);
    return matchCategory && matchKeyword;
  });

  resultCount.textContent = `${filtered.length} produk`;
  grid.innerHTML = filtered.map(p => {
    const message = encodeURIComponent(`Halo, saya tertarik dengan ${p.nama} di AmiWheels.`);
    return `
      <article class="product-card">
        <div class="product-img">${p.nama}</div>
        <div class="product-body">
          <span class="badge">${p.status}</span>
          <h3>${p.nama}</h3>
          <p class="price">${rupiah(p.harga)}</p>
          <div class="meta">${p.kategori} • ${p.kondisi}<br>${p.lokasi}</div>
          <a class="whatsapp" target="_blank" href="https://wa.me/${p.wa}?text=${message}">Chat Penjual</a>
        </div>
      </article>
    `;
  }).join('');
}

document.querySelectorAll('[data-category]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.dataset.category;
    renderProducts();
  });
});

searchInput.addEventListener('input', renderProducts);

document.getElementById('sellForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const text = encodeURIComponent(`Halo AmiWheels, saya mau jual produk:\n\nNama: ${data.nama}\nHarga: ${data.harga}\nKategori: ${data.kategori}\nLokasi: ${data.lokasi}\nDeskripsi: ${data.deskripsi || '-'}`);
  window.open(`https://wa.me/${ADMIN_WA}?text=${text}`, '_blank');
});

renderProducts();
