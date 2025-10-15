// YoshCasaster
// codefomo.xyz

// Fungsi untuk memuat data produk dari product-upload-template.json
async function loadHomeProducts() {
    try {
        const response = await fetch('product-upload-template.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Pastikan setiap produk memiliki ID unik jika belum ada
        const products = data.map((product, index) => {
            if (product.id === null) {
                return { ...product, id: index + 1 };
            }
            return product;
        });
        
        // Simpan data produk ke window object agar bisa diakses oleh halaman lain
        window.productsData = products;
        
        // Tampilkan 3 produk pertama di halaman utama
        displayHomeProducts(products.slice(0, 3));
    } catch (error) {
        console.error('Error loading products:', error);
        // Tampilkan produk default jika gagal memuat data
        displayDefaultProducts();
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

function displayHomeProducts(products) {
    const container = document.querySelector('.product-preview');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = `product-card fade-in${index > 0 ? ` delay-${index}` : ''}`;
        
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

function displayDefaultProducts() {
    const container = document.querySelector('.product-preview');
    if (!container) return;
    
    // Tampilkan pesan error jika gagal memuat data
    container.innerHTML = '<p class="no-products">Gagal memuat data produk. Silakan coba lagi nanti.</p>';
}

document.addEventListener('DOMContentLoaded', function() {
    // Muat produk dari product-upload-template.json saat halaman dimuat
    loadHomeProducts();
});
