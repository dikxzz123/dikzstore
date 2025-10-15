// YoshCasaster

// codefomo.xyz
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}


async function loadProductsIfNeeded() {
    if (!window.productsData) {
        try {
            const response = await fetch('product-upload-template.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            window.productsData = data.map((product, index) => {
                if (product.id === null) {
                    return { ...product, id: index + 1 };
                }
                return product;
            });
        } catch (error) {
            console.error('Error loading products:', error);
            return null;
        }
    }
    return true;
}

function findProductById(id) {
    if (window.productsData) {
        return window.productsData.find(product => product.id === id);
    }

    return {
        id: 1,
        name: "E-Commerce Platform",
        price: 1200000,
        category: "ecommerce",
        image: "assets/images/ecommerce.jpg",
        description: "Platform toko online lengkap dengan sistem pembayaran dan inventori. Solusi all-in-one untuk bisnis online Anda dengan fitur manajemen produk, keranjang belanja, pembayaran, dan laporan penjualan.",
        features: [
            "Manajemen produk",
            "Keranjang belanja",
            "Sistem pembayaran",
            "Manajemen pesanan",
            "Dashboard admin",
            "Laporan penjualan"
        ],
        technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"]
    };
}


function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}


function displayProductDetail(product) {
    const container = document.getElementById('product-detail-container');
    if (!container) return;
    

    container.innerHTML = '';
    

    const detailContent = document.createElement('div');
    detailContent.className = 'product-detail-content';
    

    let featuresHtml = '';
    product.features.forEach(feature => {
        featuresHtml += `<div class="feature-item"><i class="fas fa-check-circle"></i> ${feature}</div>`;
    });
    

    let techTagsHtml = '';
    product.technologies.forEach(tech => {
        techTagsHtml += `<span class="tech-tag">${tech}</span>`;
    });
    

    detailContent.innerHTML = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
            <h1>${product.name}</h1>
            <p class="product-detail-price">${formatPrice(product.price)}</p>
            <div class="product-detail-description">
                <p>${product.description}</p>
            </div>
            <div class="product-features">
                <h3>Fitur Admin</h3>
                <div class="features-list">
                    ${featuresHtml}
                </div>
            </div>
            <div class="technologies">
                <h3></h3>
                <div class="tech-tags">
                    ${techTagsHtml}
                </div>
            </div>
            <div class="product-actions">
                <a href="checkout.html?id=${product.id}" class="btn btn-primary">Checkout Sekarang</a>
            </div>
        </div>
    `;
    
    container.appendChild(detailContent);
}


function displayRelatedProducts(currentProductId) {
    const container = document.getElementById('related-products-container');
    if (!container || !window.productsData) return;

    const relatedProducts = window.productsData
        .filter(product => product.id !== currentProductId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    container.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${formatPrice(product.price)}</p>
                <p class="description">${product.description}</p>
                <a href="product-detail.html?id=${product.id}" class="btn btn-outline">Lihat Detail</a>
            </div>
        `;
        
        container.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', async function() {
    // Memuat data produk dari JSON jika belum dimuat
    await loadProductsIfNeeded();
    
    const productId = getProductIdFromUrl();
    
    if (productId) {
        const product = findProductById(productId);
        if (product) {
            displayProductDetail(product);
            displayRelatedProducts(productId);
            
            document.title = `${product.name} - DIKZSTORE`;
        } else {
            const container = document.getElementById('product-detail-container');
            if (container) {
                container.innerHTML = '<div class="not-found"><h2>Produk tidak ditemukan</h2><p>Maaf, produk yang Anda cari tidak ditemukan.</p><a href="products.html" class="btn btn-primary">Kembali ke Daftar Produk</a></div>';
            }
        }
    } else {
        window.location.href = 'products.html';
    }
});
