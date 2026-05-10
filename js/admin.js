/**
 * =====================================================
 * DONA MARIA DOCES - ADMIN APPLICATION
 * Arquivo responsável pela área administrativa
 * com CRUD completo de produtos
 * =====================================================
 */

/**
 * AdminApp - Controlador da área administrativa
 */
const AdminApp = {
    // Estado da aplicação
    state: {
        products: [],
        editingId: null,
        deleteId: null,
        searchTerm: ''
    },

    /**
     * Inicializa a aplicação administrativa
     */
    init: async function() {
        // Inicializa tema
        ThemeService.init();
        
        // Carrega produtos
        await this.loadProducts();
        
        // Renderiza tabela
        this.renderProductsTable();
        
        // Atualiza estatísticas
        this.updateStats();
        
        // Inicializa event listeners
        this.initEventListeners();
        
        console.log('✅ Painel administrativo inicializado!');
    },

    /**
     * Carrega produtos do storage
     */
    loadProducts: async function() {
        this.state.products = await ProductModel.loadInitialProducts();
    },

    /**
     * Atualiza as estatísticas do dashboard
     */
    updateStats: function() {
        const products = ProductModel.getAll();
        const categories = ProductModel.getCategories();
        
        // Total de produtos
        const totalProducts = document.getElementById('totalProducts');
        if (totalProducts) {
            totalProducts.textContent = products.length;
        }

        // Total de categorias
        const totalCategories = document.getElementById('totalCategories');
        if (totalCategories) {
            totalCategories.textContent = categories.length;
        }

        // Preço médio
        const avgPrice = document.getElementById('avgPrice');
        if (avgPrice && products.length > 0) {
            const average = products.reduce((sum, p) => sum + p.preco, 0) / products.length;
            avgPrice.textContent = `R$ ${average.toFixed(2).replace('.', ',')}`;
        }
    },

    /**
     * Renderiza a tabela de produtos
     */
    renderProductsTable: function() {
        const tbody = document.getElementById('productsTableBody');
        const emptyState = document.getElementById('adminEmptyState');
        const tableContainer = document.querySelector('.products-table-container');
        
        if (!tbody) return;

        let products = ProductModel.getAll();

        // Aplica filtro de busca
        if (this.state.searchTerm) {
            const term = this.state.searchTerm.toLowerCase();
            products = products.filter(p => 
                p.nome.toLowerCase().includes(term) ||
                p.categoria.toLowerCase().includes(term)
            );
        }

        // Mostra/esconde estado vazio
        if (products.length === 0) {
            tableContainer.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        tableContainer.style.display = 'block';
        emptyState.style.display = 'none';

        // Renderiza as linhas da tabela
        tbody.innerHTML = products.map(product => `
            <tr data-id="${product.id}">
                <td>
                    <img src="${product.imagem}" alt="${product.nome}" class="table-image">
                </td>
                <td>
                    <span class="table-name">${product.nome}</span>
                </td>
                <td>
                    <span class="table-category">${product.categoria}</span>
                </td>
                <td>
                    <span class="table-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn action-btn-edit" data-id="${product.id}" title="Editar">
                            ✏️
                        </button>
                        <button class="action-btn action-btn-delete" data-id="${product.id}" title="Excluir">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Adiciona event listeners aos botões de ação
        tbody.querySelectorAll('.action-btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.editProduct(id);
            });
        });

        tbody.querySelectorAll('.action-btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.confirmDelete(id);
            });
        });
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

        // Formulário de produto
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Botão de resetar formulário
        const resetFormBtn = document.getElementById('resetFormBtn');
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        // Busca na tabela
        const adminSearch = document.getElementById('adminSearch');
        if (adminSearch) {
            let debounceTimer;
            adminSearch.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.state.searchTerm = e.target.value;
                    this.renderProductsTable();
                }, 300);
            });
        }

        // Exportar JSON
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportProducts();
            });
        }

        // Importar JSON
        const importBtn = document.getElementById('importBtn');
        const importFile = document.getElementById('importFile');
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => {
                importFile.click();
            });

            importFile.addEventListener('change', (e) => {
                this.importProducts(e.target.files[0]);
                e.target.value = ''; // Reset para permitir importar o mesmo arquivo novamente
            });
        }

        // Modal de exclusão
        const modalClose = document.getElementById('modalClose');
        const cancelDelete = document.getElementById('cancelDelete');
        const confirmDelete = document.getElementById('confirmDelete');
        const deleteModal = document.getElementById('deleteModal');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeDeleteModal());
        }
        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => this.closeDeleteModal());
        }
        if (confirmDelete) {
            confirmDelete.addEventListener('click', () => this.deleteProduct());
        }
        if (deleteModal) {
            deleteModal.addEventListener('click', (e) => {
                if (e.target === deleteModal) this.closeDeleteModal();
            });
        }

        // Validação em tempo real
        this.initFormValidation();
    },

    /**
     * Inicializa validação do formulário
     */
    initFormValidation: function() {
        const nameInput = document.getElementById('productName');
        const descInput = document.getElementById('productDescription');
        const priceInput = document.getElementById('productPrice');
        const categoryInput = document.getElementById('productCategory');

        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                this.validateField(nameInput, 'nameError', 'Nome é obrigatório');
            });
        }

        if (descInput) {
            descInput.addEventListener('blur', () => {
                this.validateField(descInput, 'descriptionError', 'Descrição é obrigatória');
            });
        }

        if (priceInput) {
            priceInput.addEventListener('blur', () => {
                const isValid = priceInput.value && parseFloat(priceInput.value) > 0;
                this.showFieldError(priceInput, 'priceError', isValid ? '' : 'Preço deve ser maior que zero');
            });
        }

        if (categoryInput) {
            categoryInput.addEventListener('blur', () => {
                this.validateField(categoryInput, 'categoryError', 'Categoria é obrigatória');
            });
        }
    },

    /**
     * Valida um campo
     */
    validateField: function(input, errorId, errorMessage) {
        const isValid = input.value.trim() !== '';
        this.showFieldError(input, errorId, isValid ? '' : errorMessage);
        return isValid;
    },

    /**
     * Mostra erro de campo
     */
    showFieldError: function(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.classList.toggle('error', message !== '');
    },

    /**
     * Valida todo o formulário
     */
    validateForm: function() {
        const nameInput = document.getElementById('productName');
        const descInput = document.getElementById('productDescription');
        const priceInput = document.getElementById('productPrice');
        const categoryInput = document.getElementById('productCategory');

        let isValid = true;

        if (!this.validateField(nameInput, 'nameError', 'Nome é obrigatório')) {
            isValid = false;
        }

        if (!this.validateField(descInput, 'descriptionError', 'Descrição é obrigatória')) {
            isValid = false;
        }

        if (!this.validateField(categoryInput, 'categoryError', 'Categoria é obrigatória')) {
            isValid = false;
        }

        if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
            this.showFieldError(priceInput, 'priceError', 'Preço deve ser maior que zero');
            isValid = false;
        } else {
            this.showFieldError(priceInput, 'priceError', '');
        }

        return isValid;
    },

    /**
     * Processa envio do formulário
     */
    handleFormSubmit: function() {
        if (!this.validateForm()) {
            return;
        }

        const formData = {
            nome: document.getElementById('productName').value.trim(),
            descricao: document.getElementById('productDescription').value.trim(),
            preco: parseFloat(document.getElementById('productPrice').value),
            categoria: document.getElementById('productCategory').value,
            imagem: document.getElementById('productImage').value.trim()
        };

        if (this.state.editingId) {
            // Atualiza produto existente
            ProductModel.update(this.state.editingId, formData);
            this.showToast('Doce atualizado com sucesso!', 'success');
        } else {
            // Cria novo produto
            ProductModel.create(formData);
            this.showToast('Doce adicionado com sucesso!', 'success');
        }

        this.resetForm();
        this.renderProductsTable();
        this.updateStats();
    },

    /**
     * Preenche formulário para edição
     */
    editProduct: function(id) {
        const product = ProductModel.getById(id);
        if (!product) return;

        this.state.editingId = id;

        // Preenche campos
        document.getElementById('productId').value = id;
        document.getElementById('productName').value = product.nome;
        document.getElementById('productDescription').value = product.descricao;
        document.getElementById('productPrice').value = product.preco;
        document.getElementById('productCategory').value = product.categoria;
        document.getElementById('productImage').value = product.imagem || '';

        // Atualiza UI
        document.getElementById('formTitle').textContent = 'Editar Doce';
        document.getElementById('submitBtn').innerHTML = '<span class="btn-icon">✓</span> Salvar Alterações';
        document.getElementById('resetFormBtn').style.display = 'block';

        // Scroll para o formulário
        document.querySelector('.admin-form-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    },

    /**
     * Reseta o formulário
     */
    resetForm: function() {
        this.state.editingId = null;

        // Limpa campos
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';

        // Reseta UI
        document.getElementById('formTitle').textContent = 'Adicionar Novo Doce';
        document.getElementById('submitBtn').innerHTML = '<span class="btn-icon">➕</span> Adicionar Doce';
        document.getElementById('resetFormBtn').style.display = 'none';

        // Limpa erros
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    },

    /**
     * Mostra modal de confirmação de exclusão
     */
    confirmDelete: function(id) {
        const product = ProductModel.getById(id);
        if (!product) return;

        this.state.deleteId = id;
        document.getElementById('deleteProductName').textContent = product.nome;
        document.getElementById('deleteModal').classList.add('active');
    },

    /**
     * Fecha modal de exclusão
     */
    closeDeleteModal: function() {
        document.getElementById('deleteModal').classList.remove('active');
        this.state.deleteId = null;
    },

    /**
     * Exclui o produto
     */
    deleteProduct: function() {
        if (!this.state.deleteId) return;

        ProductModel.delete(this.state.deleteId);
        this.closeDeleteModal();
        this.renderProductsTable();
        this.updateStats();
        this.showToast('Doce excluído com sucesso!', 'success');

        // Se estava editando o mesmo produto, reseta o form
        if (this.state.editingId === this.state.deleteId) {
            this.resetForm();
        }
    },

    /**
     * Exporta produtos para arquivo JSON
     */
    exportProducts: function() {
        const jsonData = ProductModel.exportToJSON();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'produtos_dona_maria.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Produtos exportados com sucesso!', 'success');
    },

    /**
     * Importa produtos de arquivo JSON
     */
    importProducts: function(file) {
        if (!file) return;

        const reader = new FileReader();
        
        reader.onload = (e) => {
            const result = ProductModel.importFromJSON(e.target.result);
            
            if (result) {
                this.renderProductsTable();
                this.updateStats();
                this.showToast('Produtos importados com sucesso!', 'success');
            } else {
                this.showToast('Erro ao importar. Verifique o formato do arquivo.', 'error');
            }
        };

        reader.onerror = () => {
            this.showToast('Erro ao ler o arquivo.', 'error');
        };

        reader.readAsText(file);
    },

    /**
     * Mostra notificação toast
     */
    showToast: function(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMessage = document.getElementById('toastMessage');

        if (!toast) return;

        // Configura a mensagem e tipo
        toastMessage.textContent = message;
        toastIcon.textContent = type === 'success' ? '✓' : '✕';
        toast.classList.toggle('error', type === 'error');

        // Mostra o toast
        toast.classList.add('active');

        // Esconde após 3 segundos
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
};

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    AdminApp.init();
});
