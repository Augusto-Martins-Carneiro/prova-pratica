class CatalogoController {
    constructor() {
        this.doceModel = new DoceModel();
        this.init();
    }

    init() {
        this.renderizarCatalogo();
    }

    renderizarCatalogo() {
        const doces = this.doceModel.obterTodos();
        const grid = document.getElementById('grid-produtos');
        grid.innerHTML = '';

        doces.forEach(doce => {
            const card = this.criarCardDoce(doce);
            grid.appendChild(card);
        });
    }

    criarCardDoce(doce) {
        const card = document.createElement('div');
        card.className = 'card-doce';

        card.innerHTML = `
            <img src="${doce.imagem}" alt="${doce.nome}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;">
            <h3>${doce.nome}</h3>
            <p><strong>Categoria:</strong> ${doce.categoria}</p>
            <p>${doce.descricao}</p>
            <p><strong>Preço:</strong> R$ ${doce.preco.toFixed(2)}</p>
            <a href="https://wa.me/5511999999999?text=Olá, gostaria de pedir o doce: ${encodeURIComponent(doce.nome)} - R$ ${doce.preco.toFixed(2)}" class="btn-pedir" target="_blank">Pedir pelo WhatsApp</a>
        `;

        return card;
    }
}

// Inicializar o controlador quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CatalogoController();
});