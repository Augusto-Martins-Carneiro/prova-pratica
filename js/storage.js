/**
 * =====================================================
 * DONA MARIA DOCES - STORAGE MODULE
 * Módulo responsável pelo gerenciamento de dados
 * utilizando LocalStorage e JSON
 * =====================================================
 */

// Chaves do LocalStorage
const STORAGE_KEYS = {
    PRODUCTS: 'donaMaria_products',
    CART: 'donaMaria_cart',
    THEME: 'donaMaria_theme',
    FAVORITES: 'donaMaria_favorites'
};

/**
 * StorageService - Serviço para manipulação do LocalStorage
 * Implementa operações CRUD e manipulação de JSON
 */
const StorageService = {
    /**
     * Salva dados no LocalStorage
     * @param {string} key - Chave de armazenamento
     * @param {any} data - Dados a serem salvos
     */
    save: function(key, data) {
        try {
            // Serialização JSON - converte objeto para string
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    },

    /**
     * Recupera dados do LocalStorage
     * @param {string} key - Chave de armazenamento
     * @returns {any} Dados recuperados ou null
     */
    get: function(key) {
        try {
            const jsonData = localStorage.getItem(key);
            if (jsonData === null) return null;
            // Parse JSON - converte string para objeto
            return JSON.parse(jsonData);
        } catch (error) {
            console.error('Erro ao recuperar dados:', error);
            return null;
        }
    },

    /**
     * Remove dados do LocalStorage
     * @param {string} key - Chave de armazenamento
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover dados:', error);
            return false;
        }
    },

    /**
     * Verifica se existe dados para uma chave
     * @param {string} key - Chave de armazenamento
     * @returns {boolean}
     */
    exists: function(key) {
        return localStorage.getItem(key) !== null;
    }
};

/**
 * ProductModel - Model para gerenciamento de produtos
 * Implementa operações CRUD completas
 */
const ProductModel = {
    /**
     * Carrega os produtos iniciais do JSON
     * @returns {Promise<Array>} Lista de produtos
     */
    loadInitialProducts: async function() {
        try {
            // Verifica se já existem produtos no LocalStorage
            const existingProducts = StorageService.get(STORAGE_KEYS.PRODUCTS);
            if (existingProducts && existingProducts.length > 0) {
                return existingProducts;
            }

            // Carrega do arquivo JSON
            const response = await fetch('data/produtos.json');
            const data = await response.json();
            
            // Salva no LocalStorage
            StorageService.save(STORAGE_KEYS.PRODUCTS, data.produtos);
            
            return data.produtos;
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            return [];
        }
    },

    /**
     * Retorna todos os produtos
     * @returns {Array} Lista de produtos
     */
    getAll: function() {
        return StorageService.get(STORAGE_KEYS.PRODUCTS) || [];
    },

    /**
     * Busca um produto pelo ID
     * @param {number} id - ID do produto
     * @returns {Object|null} Produto encontrado ou null
     */
    getById: function(id) {
        const products = this.getAll();
        return products.find(product => product.id === id) || null;
    },

    /**
     * Adiciona um novo produto
     * @param {Object} product - Dados do produto
     * @returns {Object} Produto criado
     */
    create: function(product) {
        const products = this.getAll();
        
        // Gera um novo ID único
        const newId = products.length > 0 
            ? Math.max(...products.map(p => p.id)) + 1 
            : 1;
        
        const newProduct = {
            id: newId,
            nome: product.nome,
            descricao: product.descricao,
            preco: parseFloat(product.preco),
            categoria: product.categoria,
            imagem: product.imagem || 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400'
        };
        
        products.push(newProduct);
        StorageService.save(STORAGE_KEYS.PRODUCTS, products);
        
        return newProduct;
    },

    /**
     * Atualiza um produto existente
     * @param {number} id - ID do produto
     * @param {Object} updates - Dados atualizados
     * @returns {Object|null} Produto atualizado ou null
     */
    update: function(id, updates) {
        const products = this.getAll();
        const index = products.findIndex(product => product.id === id);
        
        if (index === -1) return null;
        
        products[index] = {
            ...products[index],
            nome: updates.nome,
            descricao: updates.descricao,
            preco: parseFloat(updates.preco),
            categoria: updates.categoria,
            imagem: updates.imagem || products[index].imagem
        };
        
        StorageService.save(STORAGE_KEYS.PRODUCTS, products);
        return products[index];
    },

    /**
     * Remove um produto
     * @param {number} id - ID do produto
     * @returns {boolean} Sucesso da operação
     */
    delete: function(id) {
        const products = this.getAll();
        const filteredProducts = products.filter(product => product.id !== id);
        
        if (filteredProducts.length === products.length) return false;
        
        StorageService.save(STORAGE_KEYS.PRODUCTS, filteredProducts);
        return true;
    },

    /**
     * Filtra produtos por categoria
     * @param {string} category - Nome da categoria
     * @returns {Array} Produtos filtrados
     */
    filterByCategory: function(category) {
        if (!category || category === 'todos') return this.getAll();
        const products = this.getAll();
        return products.filter(product => 
            product.categoria.toLowerCase() === category.toLowerCase()
        );
    },

    /**
     * Busca produtos por nome
     * @param {string} term - Termo de busca
     * @returns {Array} Produtos encontrados
     */
    search: function(term) {
        if (!term) return this.getAll();
        const products = this.getAll();
        const searchTerm = term.toLowerCase();
        return products.filter(product => 
            product.nome.toLowerCase().includes(searchTerm) ||
            product.descricao.toLowerCase().includes(searchTerm)
        );
    },

    /**
     * Ordena produtos
     * @param {Array} products - Lista de produtos
     * @param {string} sortBy - Critério de ordenação
     * @returns {Array} Produtos ordenados
     */
    sort: function(products, sortBy) {
        const sorted = [...products];
        
        switch (sortBy) {
            case 'preco-menor':
                return sorted.sort((a, b) => a.preco - b.preco);
            case 'preco-maior':
                return sorted.sort((a, b) => b.preco - a.preco);
            case 'nome':
            default:
                return sorted.sort((a, b) => a.nome.localeCompare(b.nome));
        }
    },

    /**
     * Retorna categorias únicas
     * @returns {Array} Lista de categorias
     */
    getCategories: function() {
        const products = this.getAll();
        const categories = [...new Set(products.map(p => p.categoria))];
        return categories.sort();
    },

    /**
     * Conta produtos por categoria
     * @returns {Object} Contagem por categoria
     */
    countByCategory: function() {
        const products = this.getAll();
        return products.reduce((acc, product) => {
            acc[product.categoria] = (acc[product.categoria] || 0) + 1;
            return acc;
        }, {});
    },

    /**
     * Exporta produtos para JSON
     * @returns {string} JSON string dos produtos
     */
    exportToJSON: function() {
        const products = this.getAll();
        return JSON.stringify({ produtos: products }, null, 2);
    },

    /**
     * Importa produtos de um JSON
     * @param {string} jsonString - String JSON com produtos
     * @returns {boolean} Sucesso da operação
     */
    importFromJSON: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Valida estrutura do JSON
            if (!data.produtos || !Array.isArray(data.produtos)) {
                throw new Error('Estrutura JSON inválida');
            }

            // Valida cada produto
            const validProducts = data.produtos.filter(p => 
                p.nome && p.descricao && p.preco && p.categoria
            );

            if (validProducts.length === 0) {
                throw new Error('Nenhum produto válido encontrado');
            }

            // Reassinala IDs para evitar conflitos
            const currentProducts = this.getAll();
            let maxId = currentProducts.length > 0 
                ? Math.max(...currentProducts.map(p => p.id)) 
                : 0;

            const newProducts = validProducts.map(p => ({
                ...p,
                id: ++maxId,
                preco: parseFloat(p.preco)
            }));

            // Adiciona aos produtos existentes
            const allProducts = [...currentProducts, ...newProducts];
            StorageService.save(STORAGE_KEYS.PRODUCTS, allProducts);

            return true;
        } catch (error) {
            console.error('Erro ao importar JSON:', error);
            return false;
        }
    }
};

/**
 * ThemeService - Serviço para gerenciamento de tema
 */
const ThemeService = {
    /**
     * Inicializa o tema
     */
    init: function() {
        const savedTheme = StorageService.get(STORAGE_KEYS.THEME);
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    },

    /**
     * Alterna entre temas claro/escuro
     */
    toggle: function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        StorageService.save(STORAGE_KEYS.THEME, newTheme);
        
        return newTheme;
    },

    /**
     * Retorna o tema atual
     * @returns {string} 'light' ou 'dark'
     */
    getCurrent: function() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
};

// Exporta para uso global
window.STORAGE_KEYS = STORAGE_KEYS;
window.StorageService = StorageService;
window.ProductModel = ProductModel;
window.ThemeService = ThemeService;
