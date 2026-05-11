

/**
 * App - Controlador principal da aplicação
 */
const App = {
    // Estado da aplicação
    state: {
        products: [],
        filteredProducts: [],
        currentCategory: 'todos',
        searchTerm: '',
        sortBy: 'nome'
    },

    /**
     * Inicializa a aplicação
     */
    init: async function() {
        // Inicializa tema
        ThemeService.init();
        
        // Carrega produtos
        await this.loadProducts();
        
        // Renderiza categorias
        this.renderCategories();
        
        // Renderiza produtos
        this.renderProducts();
        
        // Inicializa event listeners
        this.initEventListeners();
        
        // Inicializa carrinho
        CartUI.init();
        
        console.log('✅ Aplicação inicializada com sucesso!');
    },

    /**
     * Carrega produtos do storage/JSON
     */
    loadProducts: async function() {
        this.state.products = await ProductModel.loadInitialProducts();
        this.state.filteredProducts = [...this.state.products];
        this.populateCategoryFilter();
    },

    /**
     * Preenche o select de categorias
     */
    populateCategoryFilter: function() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = ProductModel.getCategories();
        
        // Mantém a opção "Todos"
        categoryFilter.innerHTML = '<option value="todos">Todas as Categorias</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    },

    /**
     * Renderiza cards de categorias
     */
    renderCategories: function() {
        const grid = document.getElementById('categoriesGrid');
        if (!grid) return;

        const categoryCount = ProductModel.countByCategory();
        const categoryIcons = {
            'Brigadeiros': '🍫',
            'Bolos': '🎂',
            'Tortas': '🥧',
            'Trufas': '🍬',
            'Doces Finos': '✨',
            'Outros': '🍰'
        };

        // Adiciona card "Todos"
        let html = `
            <div class="category-card ${this.state.currentCategory === 'todos' ? 'active' : ''}" data-category="todos">
                <span class="category-icon">🍰</span>
                <span class="category-name">Todos</span>
                <span class="category-count">${this.state.products.length} itens</span>
            </div>
        `;

        // Adiciona demais categorias
        Object.keys(categoryCount).forEach(category => {
            const icon = categoryIcons[category] || '🍬';
            const isActive = this.state.currentCategory === category ? 'active' : '';
            
            html += `
                <div class="category-card ${isActive}" data-category="${category}">
                    <span class="category-icon">${icon}</span>
                    <span class="category-name">${category}</span>
                    <span class="category-count">${categoryCount[category]} itens</span>
                </div>
            `;
        });

        grid.innerHTML = html;

        // Adiciona event listeners aos cards
        grid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });
    },

    /**
     * Renderiza lista de produtos
     */
    renderProducts: function() {
        const grid = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!grid) return;

        const products = this.state.filteredProducts;

        // Mostra/esconde estado vazio
        if (products.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        // Renderiza os cards de produtos
        grid.innerHTML = products.map(product => `
            <article class="product-card">
                <div class="product-image">
                    <img src="${product.imagem}" alt="${product.nome}" loading="lazy">
                    <span class="product-category">${product.categoria}</span>
                    <button class="product-favorite" data-id="${product.id}" aria-label="Favoritar">
                        ❤️
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.nome}</h3>
                    <p class="product-description">${product.descricao}</p>
                    <div class="product-footer">
                        <span class="product-price">
                            R$ ${product.preco.toFixed(2).replace('.', ',')}
                            <small>/un</small>
                        </span>
                        <button class="add-to-cart" data-id="${product.id}" aria-label="Adicionar ao carrinho">
                            🛒
                        </button>
                    </div>
                </div>
            </article>
        `).join('');

        // Adiciona event listeners aos botões de adicionar
        grid.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                this.addToCart(productId);
            });
        });

        // Adiciona event listeners aos botões de favorito
        grid.querySelectorAll('.product-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.currentTarget.classList.toggle('active');
            });
        });
    },

    /**
     * Adiciona produto ao carrinho
     * @param {number} productId - ID do produto
     */
    addToCart: function(productId) {
        const product = ProductModel.getById(productId);
        if (product) {
            CartService.addItem(product);
            this.showAddedFeedback();
        }
    },

    /**
     * Mostra feedback visual ao adicionar item
     */
    showAddedFeedback: function() {
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.classList.add('pulse');
            setTimeout(() => cartBtn.classList.remove('pulse'), 300);
        }
    },

    /**
     * Filtra produtos por categoria
     * @param {string} category - Nome da categoria
     */
    filterByCategory: function(category) {
        this.state.currentCategory = category;
        this.applyFilters();
        
        // Atualiza visual das categorias
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.toggle('active', card.dataset.category === category);
        });

        // Atualiza select
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
    },

    /**
     * Aplica todos os filtros ativos
     */
    applyFilters: function() {
        let result = [...this.state.products];

        // Filtro por categoria
        if (this.state.currentCategory !== 'todos') {
            result = result.filter(p => 
                p.categoria.toLowerCase() === this.state.currentCategory.toLowerCase()
            );
        }

        // Filtro por busca
        if (this.state.searchTerm) {
            const term = this.state.searchTerm.toLowerCase();
            result = result.filter(p => 
                p.nome.toLowerCase().includes(term) ||
                p.descricao.toLowerCase().includes(term)
            );
        }

        // Ordenação
        result = ProductModel.sort(result, this.state.sortBy);

        this.state.filteredProducts = result;
        this.renderProducts();
    },

    /**
     * Inicializa event listeners
     */
    initEventListeners: function() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                ThemeService.toggle();
            });
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const nav = document.getElementById('nav');
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                nav.classList.toggle('active');
            });

            // Fecha menu ao clicar em um link
            nav.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    nav.classList.remove('active');
                });
            });
        }

        // Busca
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.state.searchTerm = e.target.value;
                    this.applyFilters();
                }, 300);
            });
        }

        // Filtro de categoria
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }

        // Ordenação
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.state.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Scroll suave para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Atualiza link ativo na navegação ao scrollar
        this.initScrollSpy();
    },

    /**
     * Inicializa scroll spy para navegação
     */
    initScrollSpy: function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
};

// Adiciona estilo de animação para o botão do carrinho
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    .cart-btn.pulse {
        animation: pulse 0.3s ease;
    }
`;
document.head.appendChild(style);

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
