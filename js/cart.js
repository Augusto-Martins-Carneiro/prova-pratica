
/**
 * CartService - Serviço para gerenciamento do carrinho
 */
const CartService = {
    /**
     * Retorna os itens do carrinho
     * @returns {Array} Lista de itens
     */
    getItems: function() {
        return StorageService.get(STORAGE_KEYS.CART) || [];
    },

    /**
     * Adiciona item ao carrinho
     * @param {Object} product - Produto a ser adicionado
     * @param {number} quantity - Quantidade (padrão: 1)
     * @returns {Array} Carrinho atualizado
     */
    addItem: function(product, quantity = 1) {
        const items = this.getItems();
        const existingIndex = items.findIndex(item => item.id === product.id);
        
        if (existingIndex !== -1) {
            // Produto já existe, incrementa quantidade
            items[existingIndex].quantity += quantity;
        } else {
            // Novo produto no carrinho
            items.push({
                id: product.id,
                nome: product.nome,
                preco: product.preco,
                imagem: product.imagem,
                quantity: quantity
            });
        }
        
        StorageService.save(STORAGE_KEYS.CART, items);
        this.updateUI();
        return items;
    },

    /**
     * Remove item do carrinho
     * @param {number} productId - ID do produto
     * @returns {Array} Carrinho atualizado
     */
    removeItem: function(productId) {
        const items = this.getItems();
        const filteredItems = items.filter(item => item.id !== productId);
        
        StorageService.save(STORAGE_KEYS.CART, filteredItems);
        this.updateUI();
        return filteredItems;
    },

    /**
     * Atualiza quantidade de um item
     * @param {number} productId - ID do produto
     * @param {number} quantity - Nova quantidade
     * @returns {Array} Carrinho atualizado
     */
    updateQuantity: function(productId, quantity) {
        const items = this.getItems();
        const index = items.findIndex(item => item.id === productId);
        
        if (index !== -1) {
            if (quantity <= 0) {
                // Remove se quantidade for 0 ou menor
                return this.removeItem(productId);
            }
            items[index].quantity = quantity;
            StorageService.save(STORAGE_KEYS.CART, items);
            this.updateUI();
        }
        
        return items;
    },

    /**
     * Limpa o carrinho
     */
    clear: function() {
        StorageService.save(STORAGE_KEYS.CART, []);
        this.updateUI();
    },

    /**
     * Calcula o total do carrinho
     * @returns {number} Valor total
     */
    getTotal: function() {
        const items = this.getItems();
        return items.reduce((total, item) => {
            return total + (item.preco * item.quantity);
        }, 0);
    },

    /**
     * Conta total de itens no carrinho
     * @returns {number} Quantidade total
     */
    getCount: function() {
        const items = this.getItems();
        return items.reduce((count, item) => count + item.quantity, 0);
    },

    /**
     * Atualiza a interface do carrinho
     */
    updateUI: function() {
        // Atualiza contador no header
        const countElement = document.getElementById('cartCount');
        if (countElement) {
            const count = this.getCount();
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'flex' : 'none';
        }

        // Atualiza conteúdo do sidebar
        this.renderCartItems();
    },

    /**
     * Renderiza os itens no sidebar do carrinho
     */
    renderCartItems: function() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartEmptyElement = document.getElementById('cartEmpty');
        const cartFooterElement = document.getElementById('cartFooter');
        const cartTotalElement = document.getElementById('cartTotal');

        if (!cartItemsContainer) return;

        const items = this.getItems();

        if (items.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartEmptyElement.style.display = 'flex';
            cartFooterElement.style.display = 'none';
            return;
        }

        cartItemsContainer.style.display = 'block';
        cartEmptyElement.style.display = 'none';
        cartFooterElement.style.display = 'block';

        // Renderiza cada item
        cartItemsContainer.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.nome}</h4>
                    <span class="cart-item-price">${this.formatPrice(item.preco)}</span>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="CartService.updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="CartService.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="CartService.removeItem(${item.id})">🗑️</button>
            </div>
        `).join('');

        // Atualiza total
        if (cartTotalElement) {
            cartTotalElement.textContent = this.formatPrice(this.getTotal());
        }
    },

    /**
     * Formata preço para exibição
     * @param {number} price - Valor numérico
     * @returns {string} Preço formatado
     */
    formatPrice: function(price) {
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    },

    /**
     * Gera mensagem para WhatsApp
     * @returns {string} Mensagem formatada
     */
    generateWhatsAppMessage: function() {
        const items = this.getItems();
        
        if (items.length === 0) return '';

        let message = '🍰 *Pedido Dona Maria Doces*\n\n';
        message += '*Itens do Pedido:*\n';
        
        items.forEach((item, index) => {
            const subtotal = item.preco * item.quantity;
            message += `${index + 1}. ${item.nome}\n`;
            message += `   Qtd: ${item.quantity} x ${this.formatPrice(item.preco)} = ${this.formatPrice(subtotal)}\n\n`;
        });
        
        message += `*Total: ${this.formatPrice(this.getTotal())}*\n\n`;
        message += 'Por favor, confirme meu pedido! 😊';
        
        return encodeURIComponent(message);
    },

    /**
     * Redireciona para WhatsApp com o pedido
     */
    checkout: function() {
        const message = this.generateWhatsAppMessage();
        if (message) {
            const phoneNumber = '5511999999999'; // Número de exemplo
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappURL, '_blank');
        }
    }
};

/**
 * CartUI - Gerenciamento da interface do carrinho
 */
const CartUI = {
    /**
     * Inicializa os event listeners do carrinho
     */
    init: function() {
        const cartBtn = document.getElementById('cartBtn');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartClose = document.getElementById('cartClose');
        const cartSidebar = document.getElementById('cartSidebar');
        const checkoutBtn = document.getElementById('checkoutBtn');

        // Abre o carrinho
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.open());
        }

        // Fecha o carrinho
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.close());
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => this.close());
        }

        // Checkout
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                CartService.checkout();
            });
        }

        // Fecha com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cartSidebar && cartSidebar.classList.contains('active')) {
                this.close();
            }
        });

        // Inicializa a UI do carrinho
        CartService.updateUI();
    },

    /**
     * Abre o sidebar do carrinho
     */
    open: function() {
        const cartOverlay = document.getElementById('cartOverlay');
        const cartSidebar = document.getElementById('cartSidebar');
        
        if (cartOverlay) cartOverlay.classList.add('active');
        if (cartSidebar) cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Fecha o sidebar do carrinho
     */
    close: function() {
        const cartOverlay = document.getElementById('cartOverlay');
        const cartSidebar = document.getElementById('cartSidebar');
        
        if (cartOverlay) cartOverlay.classList.remove('active');
        if (cartSidebar) cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Exporta para uso global
window.CartService = CartService;
window.CartUI = CartUI;
