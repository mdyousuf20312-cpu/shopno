// Stripe Configuration
const stripe = Stripe(document.currentScript.getAttribute('data-stripe-pk') || 'pk_test_demo');
let elements;
let cardElement;

// Cart management
let cart = [];
const CART_STORAGE_KEY = 'shopno_cart';

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    cart = saved ? JSON.parse(saved) : [];
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Fetch and display products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        // Display demo products if API fails
        displayDemoProducts();
    }
}

// Display demo products (for testing)
function displayDemoProducts() {
    const demoProducts = [
        { id: 1, name: 'স্মার্টফোন', price: 15000, description: 'সর্বশেষ প্রযুক্তির স্মার্টফোন', image: '📱', stock: 10 },
        { id: 2, name: 'ল্যাপটপ', price: 50000, description: 'শক্তিশালী ল্যাপটপ কম্পিউটার', image: '💻', stock: 5 },
        { id: 3, name: 'হেডফোন', price: 3000, description: 'উচ্চ মানের অডিও হেডফোন', image: '🎧', stock: 15 },
        { id: 4, name: 'ক্যামেরা', price: 25000, description: 'পেশাদার ডিজিটাল ক্যামেরা', image: '📷', stock: 8 },
        { id: 5, name: 'ঘড়ি', price: 5000, description: 'স্মার্ট ওয়াচ', image: '⌚', stock: 20 },
        { id: 6, name: 'ট্যাবলেট', price: 25000, description: 'পোর্টেবল ট্যাবলেট ডিভাইস', image: '📱', stock: 12 }
    ];
    displayProducts(demoProducts);
}

// Display products on page
function displayProducts(products) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image || '📦'}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">৳ ${product.price}</div>
                <div class="product-stock">স্টক: ${product.stock}</div>
                <div class="product-actions">
                    <button class="btn btn-add" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">কার্টে যোগ করুন</button>
                </div>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.product_id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product_id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    alert(`${productName} কার্টে যোগ হয়েছে!`);
}

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">কার্ট খালি আছে</p>';
        totalPrice.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-quantity">
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                <span>x ৳ ${item.price}</span>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">সরাও</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    totalPrice.textContent = total;
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = quantity;
        saveCart();
        displayCart();
    }
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

// Initialize Stripe elements
function initializeStripe() {
    elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#card-element');
    
    cardElement.on('change', (event) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

// Handle payment form submission
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('কার্ট খালি আছে!');
            return;
        }
        
        const email = document.getElementById('customer-email').value;
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        try {
            // Create payment intent
            const paymentResponse = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount, email })
            });
            
            const { clientSecret } = await paymentResponse.json();
            
            // Confirm payment
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { email }
                }
            });
            
            if (error) {
                alert(`পেমেন্ট ব্যর্থ: ${error.message}`);
            } else if (paymentIntent.status === 'succeeded') {
                // Create order
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_email: email,
                        items: cart,
                        total_price: totalAmount,
                        stripe_payment_id: paymentIntent.id
                    })
                });
                
                alert('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
                cart = [];
                saveCart();
                closeModal('cart-modal');
                displayCart();
            }
        } catch (error) {
            alert(`ত্রুটি: ${error.message}`);
        }
    });
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        if (modalId === 'cart-modal') {
            displayCart();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const cartModal = document.getElementById('cart-modal');
    const productModal = document.getElementById('product-modal');
    
    if (event.target === cartModal) cartModal.style.display = 'none';
    if (event.target === productModal) productModal.style.display = 'none';
});

// Close button functionality
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
    });
});

// Cart link click handler
document.querySelector('.cart-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('cart-modal');
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadProducts();
    initializeStripe();
});
