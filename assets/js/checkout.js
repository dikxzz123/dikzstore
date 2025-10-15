// YoshCasaster
// Hehe
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}


// Fungsi untuk memuat data produk dari product-upload-template.json jika belum dimuat
async function loadProductsIfNeeded() {
    if (!window.productsData) {
        try {
            const response = await fetch('product-upload-template.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Pastikan setiap produk memiliki ID unik jika belum ada
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
    // Fallback data jika tidak bisa memuat dari JSON
    return {
        id: 1,
        name: "E-Commerce Platform",
        price: 1200000,
        category: "ecommerce",
        image: "assets/images/ecommerce.jpg",
        description: "Platform toko online lengkap dengan sistem pembayaran dan inventori."
    };
}
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

function formatPriceInput(price) {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0
    }).format(price);
}

function displayProductSummary(product) {
    const container = document.getElementById('product-summary');
    if (!container) return;
    
    container.innerHTML = `
        <div class="product-summary-item">
            <div class="product-summary-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-summary-details">
                <h3>${product.name}</h3>
                <p class="product-summary-price">${formatPrice(product.price)}</p>
            </div>
        </div>
    `;
}

function fillCheckoutForm(product) {
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const totalPriceInput = document.getElementById('total-price');
    
    if (productNameInput) {
        productNameInput.value = product.name;
    }
    
    if (productPriceInput) {
        productPriceInput.value = formatPrice(product.price);
    }
    
    if (totalPriceInput) {
        totalPriceInput.value = formatPrice(product.price);
    }
}

function applyDiscountCode(product) {
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountBtn = document.getElementById('apply-discount');
    const discountInfo = document.getElementById('discount-info');
    const totalPriceInput = document.getElementById('total-price');
    
    if (!discountCodeInput || !applyDiscountBtn || !discountInfo || !totalPriceInput) return;
    
    let currentPrice = product.price;
    let discountApplied = false;
    
    applyDiscountBtn.addEventListener('click', function() {
        const discountCode = discountCodeInput.value.trim();

        discountInfo.innerHTML = '';
        discountInfo.className = 'discount-info';
n
        if (discountApplied) {
            discountInfo.innerHTML = 'Diskon sudah diterapkan.';
            discountInfo.classList.add('error');
            return;
        }

        if (discountCode.toLowerCase() === 'yosh') {

            const discountAmount = currentPrice * 0.2;
            currentPrice = currentPrice - discountAmount;
            

            totalPriceInput.value = formatPrice(currentPrice);
            
            discountInfo.innerHTML = `Diskon 20% berhasil diterapkan! Anda hemat ${formatPrice(discountAmount)}`;
            discountInfo.classList.add('success');

            discountApplied = true;
        } else if (discountCode === '') {

            discountInfo.innerHTML = 'Masukkan kode diskon.';
            discountInfo.classList.add('error');
        } else {

            discountInfo.innerHTML = 'Kode diskon tidak valid.';
            discountInfo.classList.add('error');
        }
    });
    
    discountCodeInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            applyDiscountBtn.click();
        }
    });
}

function setupWhatsAppCheckout(product) {
    const whatsappBtn = document.getElementById('whatsapp-checkout');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const totalPriceInput = document.getElementById('total-price');
    
    if (!whatsappBtn || !fullnameInput || !emailInput || !totalPriceInput) return;
    
    whatsappBtn.addEventListener('click', function() {

        if (fullnameInput.value.trim() === '') {
            alert('Harap isi nama lengkap Anda.');
            fullnameInput.focus();
            return;
        }
        
        if (emailInput.value.trim() === '') {
            alert('Harap isi email Anda.');
            emailInput.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            alert('Harap masukkan email yang valid.');
            emailInput.focus();
            return;
        }
        

        const priceText = totalPriceInput.value;
        

        const message = `Saya ingin membeli
        Nama : ${fullname}
        Email :${Email}
        Produk : ${product.name} 
        Harga : ${priceText}`;

        const whatsappUrl = `https://t.me/AGENTKUATWEBID?text=${encodeURIComponent(message)}`;
        

        window.open(whatsappUrl, '_blank');
    });
}


document.addEventListener('DOMContentLoaded', async function() {
    // Memuat data produk dari JSON jika belum dimuat
    await loadProductsIfNeeded();
    
    const productId = getProductIdFromUrl();
    
    if (productId) {
        const product = findProductById(productId);
        if (product) {
            displayProductSummary(product);
            fillCheckoutForm(product);
            applyDiscountCode(product);
            setupWhatsAppCheckout(product);
        } else {
            window.location.href = 'products.html';
        }
    } else {
        window.location.href = 'products.html';
    }
});
