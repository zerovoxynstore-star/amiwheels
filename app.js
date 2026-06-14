const STORAGE_KEY = "amiwheels_products_v2";
const SALES_KEY = "amiwheels_sales_history_v2";
let currentCategory = "all";

const sampleProducts = [
  {
    id: crypto.randomUUID(),
    name: "Nissan Skyline GT-R R34",
    brand: "Hot Wheels",
    category: "Koleksi Premium",
    condition: "MOC",
    price: 150000,
    stock: 10,
    sold: 0,
    whatsapp: "6281234567890",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=800&auto=format&fit=crop",
    description: "Kondisi card mulus, blister bening.",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: "Toyota Supra MK4",
    brand: "Hot Wheels",
    category: "Mobil Die-cast Standar",
    condition: "MOC",
    price: 75000,
    stock: 2,
    sold: 8,
    whatsapp: "6281234567890",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=800&auto=format&fit=crop",
    description: "Ready stock, bisa COD.",
    status: "active",
    createdAt: new Date().toISOString()
  }
];

function getProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProducts));
    return sampleProducts;
  }
  return JSON.parse(saved);
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getSalesHistory() {
  const saved = localStorage.getItem(SALES_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveSalesHistory(history) {
  localStorage.setItem(SALES_KEY, JSON.stringify(history));
}

function formatRupiah(value) {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
}

function productStatus(product) {
  return Number(product.stock) <= 0 ? "soldout" : "active";
}

function getBadge(product) {
  if (product.status === "soldout" || Number(product.stock) <= 0) {
    return `<span class="badge sold">SOLD OUT</span>`;
  }
  if (Number(product.stock) <= 2) {
    return `<span class="badge low">TINGGAL ${product.stock}</span>`;
  }
  return `<span class="badge">READY STOCK</span>`;
}

function productCard(product) {
  const soldout = product.status === "soldout" || Number(product.stock) <= 0;
  const waText = encodeURIComponent(`Halo, saya tertarik dengan ${product.name} di AmiWheels`);
  const image = product.image || "https://placehold.co/400x300/111827/ffffff?text=AmiWheels";

  return `
    <article class="product-card ${soldout ? "soldout" : ""}">
      ${soldout ? `<div class="sold-ribbon">SOLD OUT</div>` : ""}
      <img src="${image}" alt="${product.name}" />
      <div class="body">
        <h4>${product.name}</h4>
        <small>${product.category}</small>
        <div class="price">${formatRupiah(product.price)}</div>
        <small>Stok: ${product.stock} • Terjual: ${product.sold || 0}</small><br/>
        ${getBadge(product)}
        <a class="wa ${soldout ? "disabled" : ""}" target="_blank"
          href="https://wa.me/${product.whatsapp}?text=${waText}">
          ${soldout ? "Stok Habis" : "Chat WhatsApp"}
        </a>
      </div>
    </article>
  `;
}

function filterProducts(products) {
  const search = document.getElementById("searchInput")?.value?.toLowerCase() || "";
  return products.filter((product) => {
    const matchCategory = currentCategory === "all" || product.category === currentCategory;
    const matchSearch =
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchCategory && matchSearch;
  });
}

function renderProducts() {
  let products = getProducts().map(p => ({ ...p, status: productStatus(p) }));
  saveProducts(products);

  const filtered = filterProducts(products);
  const active = filtered.filter(p => p.status === "active").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const soldout = filtered.filter(p => p.status === "soldout").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeEl = document.getElementById("activeProducts");
  const soldEl = document.getElementById("soldoutProducts");
  const homeEl = document.getElementById("homeProducts");

  if (activeEl) activeEl.innerHTML = active.map(productCard).join("") || "<p>Belum ada produk aktif.</p>";
  if (soldEl) soldEl.innerHTML = soldout.map(productCard).join("") || "<p>Belum ada produk sold out.</p>";
  if (homeEl) homeEl.innerHTML = active.slice(0, 4).map(productCard).join("") || "<p>Belum ada produk.</p>";

  renderInventory();
  renderSalesHistory();
}

function inventoryCard(product) {
  const image = product.image || "https://placehold.co/300x300/111827/ffffff?text=AmiWheels";
  const soldout = product.status === "soldout" || Number(product.stock) <= 0;

  return `
    <article class="inventory-card">
      <img src="${image}" alt="${product.name}" />
      <div>
        <h4>${product.name}</h4>
        <p>${formatRupiah(product.price)}</p>
        <small>Stok: ${product.stock} • Terjual: ${product.sold || 0}</small><br/>
        ${getBadge(product)}
      </div>
      <div class="inventory-actions">
        <button class="sell-btn" onclick="sellOne('${product.id}')" ${soldout ? "disabled" : ""}>Terjual 1</button>
        <button class="restock-btn" onclick="restock('${product.id}')">Restock</button>
        <button class="sold-btn" onclick="deleteProduct('${product.id}')">Hapus</button>
      </div>
    </article>
  `;
}

function renderInventory() {
  const products = getProducts().map(p => ({ ...p, status: productStatus(p) }));
  const active = products.filter(p => p.status === "active");
  const soldout = products.filter(p => p.status === "soldout");

  const invActive = document.getElementById("inventoryActive");
  const invSold = document.getElementById("inventorySoldout");

  if (invActive) invActive.innerHTML = active.map(inventoryCard).join("") || "<p>Tidak ada produk aktif.</p>";
  if (invSold) invSold.innerHTML = soldout.map(inventoryCard).join("") || "<p>Tidak ada produk sold out.</p>";

  const totalSold = products.reduce((sum, p) => sum + Number(p.sold || 0), 0);

  for (const id of ["statActive", "homeActive"]) {
    const el = document.getElementById(id);
    if (el) el.textContent = active.length;
  }

  for (const id of ["statSoldout", "homeSoldout"]) {
    const el = document.getElementById(id);
    if (el) el.textContent = soldout.length;
  }

  for (const id of ["statSold", "homeSold"]) {
    const el = document.getElementById(id);
    if (el) el.textContent = totalSold;
  }
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll(".nav").forEach(nav => nav.classList.remove("active"));
  const index = ["home", "marketplace", "sell", "inventory", "account"].indexOf(pageId);
  if (index >= 0) document.querySelectorAll(".nav")[index].classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
  renderProducts();
}

function filterCategory(category) {
  currentCategory = category;
  showPage("marketplace");
}

function resetFilter() {
  currentCategory = "all";
  const search = document.getElementById("searchInput");
  if (search) search.value = "";
  renderProducts();
}

function createInvoiceNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `AW-${date}-${random}`;
}

function addSalesRecord(product, qty = 1) {
  const history = getSalesHistory();
  history.unshift({
    id: crypto.randomUUID(),
    invoice: createInvoiceNumber(),
    productId: product.id,
    productName: product.name,
    brand: product.brand || "",
    category: product.category,
    condition: product.condition || "",
    qty,
    price: Number(product.price),
    total: Number(product.price) * qty,
    status: "Selesai",
    date: new Date().toISOString()
  });
  saveSalesHistory(history);
}

function sellOne(id) {
  const products = getProducts().map(product => {
    if (product.id !== id) return product;

    const newStock = Math.max(0, Number(product.stock) - 1);
    const newSold = Number(product.sold || 0) + 1;

    addSalesRecord(product, 1);

    return {
      ...product,
      stock: newStock,
      sold: newSold,
      status: newStock <= 0 ? "soldout" : "active"
    };
  });

  saveProducts(products);
  renderProducts();
}

function restock(id) {
  const amount = Number(prompt("Tambah stok berapa?", "10"));
  if (!amount || amount < 1) return;

  const products = getProducts().map(product => {
    if (product.id !== id) return product;
    return { ...product, stock: Number(product.stock || 0) + amount, status: "active" };
  });

  saveProducts(products);
  renderProducts();
}

function deleteProduct(id) {
  if (!confirm("Hapus produk ini?")) return;
  saveProducts(getProducts().filter(product => product.id !== id));
  renderProducts();
}

function renderSalesHistory() {
  const history = getSalesHistory();
  const list = document.getElementById("salesHistory");

  const totalRevenue = history.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const totalItems = history.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  const countEl = document.getElementById("historyCount");
  const revenueEl = document.getElementById("historyRevenue");
  const itemsEl = document.getElementById("historyItems");

  if (countEl) countEl.textContent = history.length;
  if (revenueEl) revenueEl.textContent = formatRupiah(totalRevenue);
  if (itemsEl) itemsEl.textContent = totalItems;

  if (!list) return;

  if (!history.length) {
    list.innerHTML = `<div class="empty-card">Belum ada history penjualan.</div>`;
    return;
  }

  list.innerHTML = history.map(item => {
    const date = new Date(item.date).toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

    return `
      <article class="receipt-card">
        <div class="receipt-head">
          <div><strong>${item.invoice}</strong><span>${date}</span></div>
          <b>${item.status}</b>
        </div>
        <div class="receipt-body">
          <h3>${item.productName}</h3>
          <p>${item.brand} • ${item.category} • ${item.condition}</p>
          <div class="receipt-row"><span>Qty</span><strong>${item.qty}</strong></div>
          <div class="receipt-row"><span>Harga</span><strong>${formatRupiah(item.price)}</strong></div>
          <div class="receipt-row total"><span>Total</span><strong>${formatRupiah(item.total)}</strong></div>
        </div>
        <div class="receipt-foot">
          <span>AmiWheels Seller</span>
          <button onclick="copyReceipt('${item.id}')">Copy Bukti</button>
        </div>
      </article>
    `;
  }).join("");
}

function copyReceipt(id) {
  const item = getSalesHistory().find(row => row.id === id);
  if (!item) return;

  const text = `
BUKTI PEMBELIAN AMIWHEELS
Invoice: ${item.invoice}
Produk: ${item.productName}
Kategori: ${item.category}
Kondisi: ${item.condition}
Qty: ${item.qty}
Harga: ${formatRupiah(item.price)}
Total: ${formatRupiah(item.total)}
Status: ${item.status}
Tanggal: ${new Date(item.date).toLocaleString("id-ID")}
Terima kasih sudah berbelanja di AmiWheels.
`.trim();

  navigator.clipboard.writeText(text);
  alert("Bukti pembelian berhasil disalin.");
}

function exportSalesHistory() {
  const history = getSalesHistory();
  if (!history.length) return alert("Belum ada history penjualan.");

  const rows = [
    ["Invoice", "Tanggal", "Produk", "Brand", "Kategori", "Kondisi", "Qty", "Harga", "Total", "Status"],
    ...history.map(item => [
      item.invoice,
      new Date(item.date).toLocaleString("id-ID"),
      item.productName,
      item.brand,
      item.category,
      item.condition,
      item.qty,
      item.price,
      item.total,
      item.status
    ])
  ];

  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "amiwheels-history-penjualan.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function clearSalesHistory() {
  if (!confirm("Hapus semua history penjualan?")) return;
  localStorage.removeItem(SALES_KEY);
  renderSalesHistory();
}

function clearAllData() {
  if (!confirm("Reset semua data demo?")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SALES_KEY);
  renderProducts();
  showPage("home");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById("imageUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const preview = document.getElementById("preview");
  const placeholder = document.getElementById("uploadPlaceholder");

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
  placeholder.style.display = "none";
});

document.getElementById("productForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const form = new FormData(event.target);
  const file = document.getElementById("imageUpload").files[0];

  let image = "";
  if (file) image = await fileToBase64(file);

  const stock = Number(form.get("stock") || 0);

  const product = {
    id: crypto.randomUUID(),
    name: form.get("name"),
    brand: form.get("brand") || "",
    category: form.get("category"),
    condition: form.get("condition"),
    price: Number(form.get("price")),
    stock,
    sold: 0,
    whatsapp: form.get("whatsapp"),
    image,
    description: form.get("description") || "",
    status: stock <= 0 ? "soldout" : "active",
    createdAt: new Date().toISOString()
  };

  const products = getProducts();
  products.unshift(product);
  saveProducts(products);

  event.target.reset();
  document.getElementById("preview").style.display = "none";
  document.getElementById("uploadPlaceholder").style.display = "block";

  alert("Koleksi berhasil ditambahkan!");
  showPage("marketplace");
});

renderProducts();
