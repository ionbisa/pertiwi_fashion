const whatsappNumber = "6285333888295";
const marketplaceSearchUrls = {
  shopee: "https://shopee.co.id/search?keyword=",
  tiktok: "https://www.tiktok.com/search?q=",
};
const products = [
  {
    id: 1,
    name: "Daster Rayon Premium",
    category: "Daster",
    price: 129000,
    desc: "Daster rayon premium dengan motif modern dan jatuh yang nyaman.",
    icon: "bi-flower1",
    unit: "Satu pcs",
    visualClass: "visual-daster",
    rating: 4.9,
    sold: "328",
    reviewsCount: "86",
    variants: ["All size", "Motif floral", "Motif geometris"],
    detail:
      "Daster berbahan rayon premium yang lembut, ringan, dan adem. Siluet longgar memberi ruang gerak untuk aktivitas di rumah.",
  },
  {
    id: 2,
    name: "Pajamas Set Mellow",
    category: "Pajamas",
    price: 189000,
    desc: "Set piyama modern dengan bahan lembut untuk tidur yang lebih nyaman.",
    icon: "bi-moon-stars",
    unit: "Satu set",
    visualClass: "visual-pajamas",
    cardImage: "img/produk/pajamas/biru.png",
    gallery: [
      "img/produk/pajamas/biru.png",
      "img/produk/pajamas/cream.png",
      "img/produk/pajamas/pink.png",
      "img/produk/pajamas/A1.png",
    ],
    rating: 4.9,
    sold: "241",
    reviewsCount: "73",
    options: {
      colors: [
        {
          name: "Biru",
          value: "#5c88a8",
          image: "img/produk/pajamas/biru.png",
        },
        {
          name: "Cream",
          value: "#e7d4b5",
          image: "img/produk/pajamas/cream.png",
        },
        {
          name: "Pink",
          value: "#df9cab",
          image: "img/produk/pajamas/pink.png",
        },
      ],
      sizes: ["L", "XXL"],
    },
    specs: ["Ukuran: L dan XXL", "Warna: Biru, pink, dan cream"],
    detail:
      "Pajamas set floral atasan dan celana dengan pilihan warna biru, cream, dan pink. Tersedia dalam ukuran L dan XXL.",
  },
  {
    id: 3,
    name: "Mukena",
    category: "Mukena",
    price: 0,
    desc: "Mukena untuk menemani kebutuhan ibadah sehari-hari.",
    icon: "bi-moon-stars",
    unit: "Satu set",
    visualClass: "visual-mukena",
    variants: [],
    detail:
      "Informasi bahan, motif, ukuran, dan warna mukena dapat dikonfirmasi kepada admin. Hubungi kami untuk melihat pilihan yang tersedia.",
  },
];

let cart = [];
let detailProduct = null;
let detailQty = 1;
let detailVariant = "";
let detailColor = "";
let detailSize = "";
let detailImage = "";
let checkoutMode = "detail";
let productSearchQuery = "";
let productCategoryFilter = "";
let productPage = 1;
const productsPerPage = 3;

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

function renderProductVisual(
  product,
  extraClass = "",
  imagePath = product.cardImage,
) {
  if (imagePath?.startsWith("img/")) {
    return `<img class="product-photo ${extraClass}" src="${imagePath}" alt="${product.name}" loading="lazy" />`;
  }

  return `
    <div class="fashion-visual ${imagePath || product.visualClass || ""} ${extraClass}">
      <i class="bi ${product.icon}"></i>
      <span>${product.category}</span>
    </div>
  `;
}

function renderProducts() {
  const productList = document.getElementById("productList");
  const productPagination = document.getElementById("productPagination");
  const productFilterStatus = document.getElementById("productFilterStatus");
  const keyword = productSearchQuery.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesKeyword = keyword
      ? [product.name, product.category, product.desc, product.unit]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      : true;
    const matchesCategory = productCategoryFilter
      ? product.category.toLowerCase() === productCategoryFilter.toLowerCase()
      : true;

    return matchesKeyword && matchesCategory;
  });
  if (productFilterStatus) {
    productFilterStatus.innerHTML = productCategoryFilter
      ? `<span>Menampilkan kategori ${productCategoryFilter}</span><button type="button" class="clear-product-filter" aria-label="Tampilkan semua produk">Hapus filter <i class="bi bi-x"></i></button>`
      : "";
  }
  const totalPages = Math.ceil(visibleProducts.length / productsPerPage);
  productPage = Math.min(Math.max(productPage, 1), totalPages || 1);
  const pageStart = (productPage - 1) * productsPerPage;
  const pagedProducts = visibleProducts.slice(
    pageStart,
    pageStart + productsPerPage,
  );

  if (visibleProducts.length === 0) {
    productList.innerHTML = `
      <div class="col-12">
        <div class="product-empty-state">
          <i class="bi bi-search"></i>
          <h5>Produk tidak ditemukan</h5>
          <p>Coba gunakan kata kunci lain.</p>
        </div>
      </div>
    `;
    if (productPagination) {
      productPagination.innerHTML = "";
    }
    return;
  }

  productList.innerHTML = pagedProducts
    .map(
      (product) => `
    <div class="col-md-6 col-lg-4">
      <article class="product-card">
        <button type="button" class="product-img product-image-button ${product.cardImage ? "product-img-photo" : ""}" onclick="openProductDetail(${product.id})" aria-label="Lihat detail ${product.name}" aria-haspopup="dialog">
          ${renderProductVisual(product)}
          <span class="product-image-hint">Lihat detail ↗</span>
        </button>
        <div class="product-body">
          <div class="product-category">${product.category}</div>
          <h5 class="product-title">${product.name}</h5>
          <p class="product-desc">${product.desc}</p>
          <div class="product-meta">
            <strong class="product-price">${product.price > 0 ? formatRupiah(product.price) : "Tanya harga"}</strong>
            <span class="product-unit">${product.unit}</span>
          </div>
          ${product.options?.colors?.length ? `<div class="product-swatches" aria-label="Pilihan warna">${product.options.colors.map((color) => `<span class="product-swatch" style="--swatch-color: ${color.value}" title="${color.name}" aria-label="${color.name}"></span>`).join("")}</div>` : ""}
          <div class="product-actions">
            <button class="btn btn-success" type="button" onclick="addToCart(${product.id})">
              <i class="bi bi-bag-plus"></i> Tambah ke keranjang
            </button>
            <button class="product-detail-link" type="button" onclick="openProductDetail(${product.id})">
              Lihat detail <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </article>
    </div>
  `,
    )
    .join("");

  renderProductPagination(visibleProducts.length, totalPages);
}

function renderProductPagination(totalProducts, totalPages) {
  const productPagination = document.getElementById("productPagination");
  if (!productPagination) return;

  if (totalProducts <= productsPerPage) {
    productPagination.innerHTML = "";
    return;
  }

  productPagination.innerHTML = `
    <button
      type="button"
      class="product-page-btn"
      onclick="changeProductPage(-1)"
      ${productPage === 1 ? "disabled" : ""}
    >
      <i class="bi bi-chevron-left"></i> Previous
    </button>
    <span>Halaman ${productPage} dari ${totalPages}</span>
    <button
      type="button"
      class="product-page-btn"
      onclick="changeProductPage(1)"
      ${productPage === totalPages ? "disabled" : ""}
    >
      Next <i class="bi bi-chevron-right"></i>
    </button>
  `;
}

function changeProductPage(change) {
  productPage += change;
  renderProducts();
  document.getElementById("produk")?.scrollIntoView({ behavior: "smooth" });
}

function getProductGallery(product) {
  return product.gallery && product.gallery.length
    ? product.gallery
    : [product.visualClass || "visual-daster"];
}

function getMarketplaceSearchUrl(platform, productName = "") {
  const query = `Pertiwi Fashion ${productName}`.trim();
  return `${marketplaceSearchUrls[platform]}${encodeURIComponent(query)}`;
}

function openProductDetail(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  detailProduct = product;
  detailQty = 1;
  detailVariant = product.variants?.[0] || "";
  detailColor = product.options?.colors?.[0]?.name || "";
  detailSize = product.options?.sizes?.[0] || "";
  detailImage = getProductGallery(product)[0];

  renderProductDetail();
  const modalElement = document.getElementById("productDetailModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  modal.show();
}

function renderProductDetail() {
  const content = document.getElementById("productDetailContent");
  if (!content || !detailProduct) return;

  const product = detailProduct;
  const gallery = getProductGallery(product);
  const variants = product.variants || [];
  const options = product.options;

  content.innerHTML = `
    <div class="product-detail-layout">
      <div class="product-detail-gallery">
        <div class="detail-main-image">
          ${renderProductVisual(product, "detail-visual", detailImage)}
        </div>
        <div class="detail-thumbs">
          ${gallery
            .map(
              (image) => `
                <button
                  class="${image === detailImage ? "active" : ""}"
                  type="button"
                  onclick="setDetailImage('${image}')"
                >
                  ${renderProductVisual(product, "detail-thumb-visual", image)}
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="detail-share">
          <span>Kunjungi toko:</span>
          <a href="${getMarketplaceSearchUrl("tiktok", product.name)}" target="_blank" rel="noopener noreferrer" aria-label="Cari ${product.name} di TikTok">
            <img src="img/sosmed/tiktok.png" alt="TikTok" />
          </a>
          <a href="${getMarketplaceSearchUrl("shopee", product.name)}" target="_blank" rel="noopener noreferrer" aria-label="Cari ${product.name} di Shopee">
            <img src="img/sosmed/shopee.png" alt="Shopee" />
          </a>
        </div>
      </div>

      <div class="product-detail-info">
        <div class="detail-title-row">
          <div>
            <span class="detail-label">Koleksi Pertiwi</span>
            <h3>${product.name}</h3>
          </div>
        </div>

        <div class="detail-price-box">
          <span>Harga & stok</span>
          <strong>Tanyakan ke admin</strong>
          <small>${product.unit}</small>
        </div>

        ${
          options
            ? `
          <div class="detail-option-row align-start">
            <span>Warna</span>
            <div class="detail-variants">
              ${options.colors
                .map(
                  (color) => `
                    <button
                      class="detail-color-option ${color.name === detailColor ? "active" : ""}"
                      type="button"
                      onclick="setDetailColor('${color.name}')"
                    >
                      <span class="detail-color-swatch" style="--swatch-color: ${color.value}"></span>
                      ${color.name}
                    </button>
                  `,
                )
                .join("")}
            </div>
          </div>
          <div class="detail-option-row align-start">
            <span>Ukuran</span>
            <div class="detail-variants">
              ${options.sizes
                .map(
                  (size) => `
                    <button
                      class="${size === detailSize ? "active" : ""}"
                      type="button"
                      onclick="setDetailSize('${size}')"
                    >
                      ${size}
                    </button>
                  `,
                )
                .join("")}
            </div>
          </div>
        `
            : variants.length
              ? `
          <div class="detail-option-row align-start">
            <span>Warna</span>
            <div class="detail-variants">
              ${variants
                .map(
                  (variant) => `
                    <button
                      class="${variant === detailVariant ? "active" : ""}"
                      type="button"
                      onclick="setDetailVariant('${variant}')"
                    >
                      ${variant}
                    </button>
                  `,
                )
                .join("")}
            </div>
          </div>
        `
              : ""
        }

        <div class="detail-option-row">
          <span>Jumlah</span>
          <div class="detail-qty">
            <button type="button" onclick="changeDetailQty(-1)">-</button>
            <strong>${detailQty}</strong>
            <button type="button" onclick="changeDetailQty(1)">+</button>
          </div>
        </div>

        <div class="detail-actions">
          <button class="detail-cart-btn" type="button" onclick="addDetailToCart()">
            <i class="bi bi-list-check"></i> Tambahkan Permintaan
          </button>
          <button class="detail-buy-btn" type="button" onclick="buyDetailNow()">
            Tanyakan Harga WA
          </button>
        </div>
      </div>
    </div>

    <div class="product-detail-tabs">
      <div class="detail-section">
        <h4>Deskripsi Produk</h4>
        <p>${product.detail || product.desc}</p>
        <ul>
          <li>Kategori: ${product.category}</li>
          <li>Satuan: ${product.unit}</li>
          ${(product.specs || []).map((spec) => `<li>${spec}</li>`).join("")}
        </ul>
      </div>
      
    </div>
  `;
}

function setDetailImage(image) {
  detailImage = image;
  renderProductDetail();
}

function setDetailVariant(variant) {
  detailVariant = variant;
  renderProductDetail();
}

function setDetailColor(color) {
  detailColor = color;
  const selectedColor = detailProduct?.options?.colors?.find(
    (option) => option.name === color,
  );
  if (selectedColor?.image) detailImage = selectedColor.image;
  renderProductDetail();
}

function setDetailSize(size) {
  detailSize = size;
  renderProductDetail();
}

function getSelectedDetailVariant() {
  if (detailProduct?.options) {
    return [detailSize, detailColor].filter(Boolean).join(" - ");
  }
  return detailVariant;
}

function changeDetailQty(change) {
  detailQty = Math.max(1, detailQty + change);
  renderProductDetail();
}

function addDetailToCart() {
  if (!detailProduct) return;

  const selectedVariant = getSelectedDetailVariant();
  const existingItem = cart.find(
    (item) => item.id === detailProduct.id && item.variant === selectedVariant,
  );
  if (existingItem) {
    existingItem.qty += detailQty;
    existingItem.variant = selectedVariant;
  } else {
    cart.push({
      ...detailProduct,
      qty: detailQty,
      variant: selectedVariant,
    });
  }

  renderCart();
}

function buyDetailNow() {
  if (!detailProduct) return;

  checkoutMode = "detail";
  renderOrderSummaryModal();

  const productModalElement = document.getElementById("productDetailModal");
  const paymentModalElement = document.getElementById("paymentMethodModal");
  const productModal = bootstrap.Modal.getInstance(productModalElement);
  if (productModal) {
    productModal.hide();
  }

  const paymentModal = bootstrap.Modal.getOrCreateInstance(paymentModalElement);
  paymentModal.show();
}

function buyProductNow(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  detailProduct = product;
  detailQty = 1;
  detailVariant = product.variants?.[0] || "";
  detailColor = product.options?.colors?.[0]?.name || "";
  detailSize = product.options?.sizes?.[0] || "";
  detailImage = getProductGallery(product)[0];
  checkoutMode = "detail";

  renderOrderSummaryModal();

  const paymentModalElement = document.getElementById("paymentMethodModal");
  const paymentModal = bootstrap.Modal.getOrCreateInstance(paymentModalElement);
  paymentModal.show();
}

function renderOrderSummaryModal() {
  const content = document.getElementById("paymentContent");
  if (!content) return;

  const orderSummary = getCheckoutSummary();
  if (!orderSummary) return;

  content.innerHTML = `
    <div class="payment-layout order-summary-layout">
      <div class="payment-summary">
        <span>Ringkasan Pesanan</span>
        <h4>${orderSummary.title}</h4>
        <p>${orderSummary.subtitle}</p>

        <div class="payment-items">
          ${orderSummary.items
            .map(
              (item) => `
                <div>
                  <span>${item.name}</span>
                  <small>${item.variant ? `${item.variant} | ` : ""}${item.unit} x ${item.qty}</small>
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="payment-summary-row">
          <small>Jumlah Item</small>
          <strong>${orderSummary.qty}</strong>
        </div>
        <div class="payment-summary-note">
          <small>Harga, MOQ, dan stok akan dikonfirmasi oleh admin melalui WhatsApp.</small>
        </div>
      </div>

      <div class="payment-methods order-summary-action">
        <div class="payment-section-header">
          <span>Informasi Pelanggan</span>
          <small>Isi nama dan alamat lengkap agar admin sales dapat memproses pesanan Anda.</small>
        </div>
        <div class="checkout-form-group">
          <label for="customerFullName">Nama Lengkap</label>
          <input id="customerFullName" type="text" placeholder="Masukkan nama lengkap" />
        </div>

        <div class="checkout-form-group">
          <label for="customerAddress">Alamat Lengkap</label>
          <textarea id="customerAddress" rows="3" placeholder="Masukkan alamat lengkap"></textarea>
        </div>

        <div class="payment-note">
          <i class="bi bi-whatsapp"></i>
          <p>Lengkapi nama dan alamat untuk dapat mengirim pesanan ke admin sales.</p>
        </div>

        <button class="payment-confirm-btn" type="button" onclick="sendOrderToWhatsApp()">
          <i class="bi bi-whatsapp"></i> Buat Pesanan
        </button>
      </div>
    </div>
  `;
}

function sendPaymentConfirmation() {
  sendOrderToWhatsApp();
}

function sendOrderToWhatsApp() {
  const orderSummary = getCheckoutSummary();
  if (!orderSummary) return;

  const customerName = document
    .getElementById("customerFullName")
    ?.value.trim();
  const customerAddress = document
    .getElementById("customerAddress")
    ?.value.trim();

  if (!customerName) {
    alert("Nama lengkap wajib diisi.");
    document.getElementById("customerFullName")?.focus();
    return;
  }

  if (!customerAddress) {
    alert("Alamat lengkap wajib diisi.");
    document.getElementById("customerAddress")?.focus();
    return;
  }

  const lines = [
    "Halo admin sales,",
    `saya bernama : ${customerName}`,
    `alamat lengkap : ${customerAddress}`,
    "ingin membuat pesanan:",
    "",
  ];

  orderSummary.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`);
    if (item.variant) {
      lines.push(`   Varian: ${item.variant}`);
    }
    lines.push(`   Qty: ${item.qty}`);
    lines.push(`   Satuan: ${item.unit}`);
    lines.push("");
  });

  lines.push(
    "Mohon bantu cek stok, harga, dan MOQ untuk order ini. Terima kasih.",
  );

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
    "_blank",
  );
}

function getCheckoutSummary() {
  if (checkoutMode === "cart") {
    if (cart.length === 0) return null;

    const qty = cart.reduce((sum, item) => sum + item.qty, 0);

    return {
      title: "Ringkasan Permintaan",
      subtitle: `${cart.length} produk | ${qty} item`,
      items: cart,
      qty,
      total: 0,
    };
  }

  if (!detailProduct) return null;

  const selectedVariant = getSelectedDetailVariant();
  return {
    title: detailProduct.name,
    subtitle: selectedVariant
      ? `${selectedVariant} | ${detailProduct.unit}`
      : detailProduct.unit,
    items: [
      {
        ...detailProduct,
        qty: detailQty,
        variant: selectedVariant,
      },
    ],
    qty: detailQty,
    total: detailProduct.price * detailQty,
  };
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      ...product,
      qty: 1,
    });
  }

  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  cartCount.innerText = totalQty;
  cartTotal.innerText = `${totalQty} item`;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center text-muted py-4">
        <i class="bi bi-cart-x fs-1"></i>
        <p class="mt-2">Daftar permintaan masih kosong.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div>
        <h6>${item.name}</h6>
        <small>${item.variant ? `${item.variant} | ` : ""}${item.unit} x ${item.qty}</small>
      </div>

      <div class="text-end">
        <div class="mb-2">
          <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
          <span class="mx-2">${item.qty}</span>
          <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
        </div>
        <strong>Permintaan</strong>
      </div>
    </div>
  `,
    )
    .join("");
}

function increaseQty(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.qty += 1;
  }
  renderCart();
}

function decreaseQty(productId) {
  const item = cart.find((item) => item.id === productId);

  if (item && item.qty > 1) {
    item.qty -= 1;
  } else {
    cart = cart.filter((item) => item.id !== productId);
  }

  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  checkoutMode = "cart";
  renderOrderSummaryModal();

  const cartCanvasElement = document.getElementById("cartCanvas");
  const cartCanvas = bootstrap.Offcanvas.getInstance(cartCanvasElement);
  if (cartCanvas) {
    cartCanvas.hide();
  }

  const paymentModalElement = document.getElementById("paymentMethodModal");
  const paymentModal = bootstrap.Modal.getOrCreateInstance(paymentModalElement);
  paymentModal.show();
}

function sendQuickMessage() {
  const form = document.getElementById("contactForm");
  if (!form.reportValidity()) return;
  const name = document.getElementById("customerName");
  const message = document.getElementById("customerMessage");
  for (const field of [name, message]) {
    if (!field.value.trim()) {
      field.setCustomValidity("Mohon isi bagian ini.");
      field.reportValidity();
      field.addEventListener("input", () => field.setCustomValidity(""), { once: true });
      return;
    }
  }
  const text = `Halo Pertiwi Fashion, saya ${name.value.trim()}.\n\n${message.value.trim()}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

document.getElementById("contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendQuickMessage();
});

document.querySelectorAll("#navbarMenu a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("navbarMenu");
    if (menu.classList.contains("show")) {
      menu.addEventListener("hidden.bs.collapse", () => {
        document.querySelector(link.getAttribute("href"))?.scrollIntoView();
      }, { once: true });
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

function initProductSearch() {
  const form = document.getElementById("productSearchForm");
  const input = document.getElementById("productSearch");
  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    productPage = 1;
    productSearchQuery = input.value;
    renderProducts();
    document.getElementById("produk")?.scrollIntoView({ behavior: "smooth" });
  });

  input.addEventListener("input", () => {
    productPage = 1;
    productSearchQuery = input.value;
    renderProducts();
  });
}

function initCategoryFilters() {
  document.querySelectorAll("[data-category-filter]").forEach((link) => {
    link.addEventListener("click", () => {
      productCategoryFilter = link.dataset.categoryFilter || "";
      productSearchQuery = "";
      productPage = 1;
      const searchInput = document.getElementById("productSearch");
      if (searchInput) searchInput.value = "";
      renderProducts();
    });
  });

  document
    .getElementById("productFilterStatus")
    ?.addEventListener("click", (event) => {
      if (!event.target.closest(".clear-product-filter")) return;
      productCategoryFilter = "";
      productPage = 1;
      renderProducts();
    });
}

initProductSearch();
initCategoryFilters();
renderProducts();
renderCart();
