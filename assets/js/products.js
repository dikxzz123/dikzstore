// YoshCasaster

// codefomo.xyz

let products = [];

async function loadProducts() {
    try {
        const response = await fetch('product-upload-template.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        products = data.map((product, index) => {
            if (product.id === null) {
                return { ...product, id: index + 1 };
            }
            return product;
        });
        
        // Tampilkan produk setelah data dimuat
        displayProducts(products);
        
        // Simpan data produk ke window object agar bisa diakses oleh halaman lain
        window.productsData = products;
    } catch (error) {
        console.error('Error loading products:', error);
        // Tampilkan pesan error jika gagal memuat data
        const container = document.getElementById('product-container');
        if (container) {
            container.innerHTML = '<p class="no-products">Gagal memuat data produk. Silakan coba lagi nanti.</p>';
        }
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

function createProductCard(product) {
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
    
    return card;
}

function displayProducts(productList) {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (productList.length === 0) {
        container.innerHTML = '<p class="no-products">Tidak ada produk yang ditemukan.</p>';
        return;
    }
    
    productList.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}


function filterProducts() {
    const searchInput = document.getElementById('search-products');
    const categorySelect = document.getElementById('category-select');
    const priceSelect = document.getElementById('price-select');
    
    if (!searchInput || !categorySelect || !priceSelect) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = categorySelect.value;
    const priceFilter = priceSelect.value;
    
    let filteredProducts = products.filter(product => {

        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             product.description.toLowerCase().includes(searchTerm);

        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        

        let matchesPrice = true;
        if (priceFilter === 'low') {
            matchesPrice = product.price < 500000;
        } else if (priceFilter === 'medium') {
            matchesPrice = product.price >= 500000 && product.price <= 1000000;
        } else if (priceFilter === 'high') {
            matchesPrice = product.price > 1000000;
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    displayProducts(filteredProducts);
}

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    const searchInput = document.getElementById('search-products');
    const categorySelect = document.getElementById('category-select');
    const priceSelect = document.getElementById('price-select');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', filterProducts);
    }
    
    if (priceSelect) {
        priceSelect.addEventListener('change', filterProducts);
    }
});
