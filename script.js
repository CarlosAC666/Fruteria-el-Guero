// Datos de productos
const products = [
    {
        id: 1,
        name: "Manzanas Rojas",
        price: 40.00,
        image: "imagenes/Manzana.png",
        description: "Manzanas rojas crujientes y dulces, perfectas para comer frescas o en postres.",
        category: "Frutas",
    },
    {
        id: 2,
        name: "Plátanos",
        price: 20.00,
        image: "imagenes/Platanos.png",
        description: "Plátanos maduros y dulces, ricos en potasio y energía natural.",
        category: "Frutas"
    },
    {
        id: 3,
        name: "Papas",
        price: 20.00,
        image: "imagenes/papa.png",
        description: "papa lavada",
        category: "Frutas",
    },
    {
        id: 4,
        name: "Lechuga",
        price: 20.00,
        image: "imagenes/Lechuga.png",
        description: "Lechugas frescas para ensaladas saludables",
        category: "Verduras"
    },
    {
        id: 5,
        name: "Tomates",
        price: 27.00,
        image: "imagenes/Tomates.png",
        description: "Tomates maduros y sabrosos, ideales para ensaladas, salsas o guisos.",
        category: "Verduras"
    },
    {
        id: 6,
        name: "Zanahorias",
        price: 17.00,
        image: "imagenes/Zanahoria.png",
        description: "Zanahorias frescas y crujientes, ricas en vitamina A y perfectas para ensaladas.",
        category: "Verduras",
        
    },
    {
        id: 7,
        name: "Chiles Jalapeños",
        price: 35.00,
        image: "imagenes/Jalapeños.png",
        description: "Chiles jalapeños picantes, ideales para dar sabor a tus platillos favoritos.",
        category: "Verduras"
    },
    {
        id: 8,
        name: "Cebollas",
        price: 24.00,
        image: "imagenes/Cebolla.png",
        description: "Cebollas para su comida",
        category: "Verduras",
    }
];

// Variables globales
let cart = [];
let currentProduct = null;

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const productDetail = document.getElementById('productDetail');
const closeModal = document.getElementById('closeModal');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Cargar productos en la página
function loadProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let badgeHTML = '';
        if (product.onSale) {
            badgeHTML = '<div class="sale-badge">Oferta</div>';
        }
        
        productCard.innerHTML = `
            ${badgeHTML}
            <div class="product-category">${product.category}</div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        `;
        
        // Evento para abrir el modal al hacer clic en la tarjeta
        productCard.addEventListener('click', () => {
            openProductModal(product);
        });
        
        productsGrid.appendChild(productCard);
    });
}

// Abrir modal de producto
function openProductModal(product) {
    currentProduct = product;
    productDetail.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-detail-image">
        <div class="product-detail-info">
            <h2 class="product-detail-name">${product.name}</h2>
            <p class="product-detail-price">$${product.price.toFixed(2)}</p>
            <p class="product-detail-description">${product.description}</p>
            <div class="product-detail-quantity">
                <button class="quantity-btn" id="decreaseQuantity">-</button>
                <input type="number" class="quantity-input" id="quantityInput" value="1" min="1">
                <button class="quantity-btn" id="increaseQuantity">+</button>
                <button class="add-to-cart" id="addToCartBtn">Añadir al Carrito</button>
            </div>
        </div>
    `;
    
    // Eventos para los botones de cantidad
    document.getElementById('decreaseQuantity').addEventListener('click', () => {
        const quantityInput = document.getElementById('quantityInput');
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    
    document.getElementById('increaseQuantity').addEventListener('click', () => {
        const quantityInput = document.getElementById('quantityInput');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    
    // Evento para añadir al carrito
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantityInput').value);
        addToCart(currentProduct, quantity);
        closeProductModal();
    });
    
    productModal.style.display = 'flex';
}

// Cerrar modal de producto
function closeProductModal() {
    productModal.style.display = 'none';
}

// Añadir producto al carrito
function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCart();
    showNotification(`${product.name} añadido al carrito`);
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Actualizar carrito
function updateCart() {
    // Actualizar lista de productos en el carrito
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-cart" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-cart" data-id="${item.id}">+</button>
                    <span class="remove-item" data-id="${item.id}">Eliminar</span>
                </div>
                <p class="cart-item-total">Total: $${itemTotal.toFixed(2)}</p>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Actualizar total
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Añadir eventos a los botones del carrito
    document.querySelectorAll('.decrease-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === productId);
            
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                removeFromCart(productId);
            }
            
            updateCart();
        });
    });
    
    document.querySelectorAll('.increase-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === productId);
            item.quantity++;
            updateCart();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--color-primary);
        color: var(--color-white);
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 1002;
        transition: transform 0.3s, opacity 0.3s;
        transform: translateY(20px);
        opacity: 0;
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateY(20px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`¡Gracias por tu compra! Total: $${total.toFixed(2)}\nEn un futuro, aquí se procesaría el pago.`);
    
    // Vaciar carrito
    cart = [];
    updateCart();
    closeCartModal();
}

// Abrir carrito
function openCartModal() {
    cartModal.style.display = 'block';
}

// Cerrar carrito
function closeCartModal() {
    cartModal.style.display = 'none';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Cerrar modal al hacer clic en la X
    closeModal.addEventListener('click', closeProductModal);
    
    // Cerrar modal al hacer clic fuera del contenido
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
    
    // Cerrar carrito
    closeCart.addEventListener('click', closeCartModal);
    
    // Finalizar compra
    checkoutBtn.addEventListener('click', checkout);
});