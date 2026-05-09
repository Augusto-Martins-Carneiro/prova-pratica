class AdminController {
    constructor() {
        this.doceModel = new DoceModel();
        this.form = document.getElementById('form-doce');
        this.editandoId = null; // Para saber se está editando

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.salvarDoce(e));
        document.getElementById('btn-limpar').addEventListener('click', () => this.limparFormulario());
        this.renderizarLista();
    }

    salvarDoce(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const categoria = document.getElementById('categoria').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const imagem = document.getElementById('imagem').value;
        const descricao = document.getElementById('descricao').value;

        const doce = { nome, categoria, preco, imagem, descricao };

        if (this.editandoId) {
            // Editando
            this.atualizarDoce(this.editandoId, doce);
        } else {
            // Novo
            this.doceModel.adicionar(doce);
        }

        this.limparFormulario();
        this.renderizarLista();
    }

    atualizarDoce(id, dadosAtualizados) {
        const doces = this.doceModel.obterTodos();
        const index = doces.findIndex(d => d.id === id);
        if (index !== -1) {
            doces[index] = { ...doces[index], ...dadosAtualizados };
            this.doceModel.salvarDados(doces);
        }
    }

    deletarDoce(id) {
        if (confirm('Tem certeza que deseja deletar este doce?')) {
            this.doceModel.deletar(id);
            this.renderizarLista();
        }
    }

    editarDoce(id) {
        const doces = this.doceModel.obterTodos();
        const doce = doces.find(d => d.id === id);
        if (doce) {
            document.getElementById('nome').value = doce.nome;
            document.getElementById('categoria').value = doce.categoria;
            document.getElementById('preco').value = doce.preco;
            document.getElementById('imagem').value = doce.imagem;
            document.getElementById('descricao').value = doce.descricao;

            this.editandoId = id;
            document.querySelector('button[type="submit"]').textContent = 'Atualizar Doce';
        }
    }

    limparFormulario() {
        this.form.reset();
        this.editandoId = null;
        document.querySelector('button[type="submit"]').textContent = 'Salvar Doce';
    }

    renderizarLista() {
        const doces = this.doceModel.obterTodos();
        const tbody = document.querySelector('#tabela-doces-admin tbody');
        tbody.innerHTML = '';

        doces.forEach(doce => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${doce.imagem}" alt="${doce.nome}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${doce.nome}</td>
                <td>${doce.categoria}</td>
                <td>R$ ${doce.preco.toFixed(2)}</td>
                <td>${doce.descricao}</td>
                <td>
                    <button onclick="adminController.editarDoce(${doce.id})" class="btn-editar">Editar</button>
                    <button onclick="adminController.deletarDoce(${doce.id})" class="btn-deletar">Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Inicializar o controlador quando a página carregar
let adminController;
document.addEventListener('DOMContentLoaded', () => {
    adminController = new AdminController();
});