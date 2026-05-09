class DoceModel {
    constructor() {
        this.chaveStorage = 'doces_dona_maria';
        this.iniciarDadosPadrao();
    }

    // Retorna todos os doces usando JSON.parse
    obterTodos() {
        const dados = localStorage.getItem(this.chaveStorage);
        return dados ? JSON.parse(dados) : [];
    }

    // Salva o array de doces no localStorage usando JSON.stringify
    salvarDados(arrayDeDoces) {
        localStorage.setItem(this.chaveStorage, JSON.stringify(arrayDeDoces));
    }

    // Adiciona um novo doce gerando um ID único
    adicionar(novoDoce) {
        const doces = this.obterTodos();
        novoDoce.id = Date.now(); // Gera um ID baseado na data atual
        doces.push(novoDoce);
        this.salvarDados(doces);
    }

    // Deleta um doce pelo ID
    deletar(id) {
        let doces = this.obterTodos();
        doces = doces.filter(doce => doce.id !== id);
        this.salvarDados(doces);
    }

    // Garante que o projeto já inicie com alguns dados em JSON
    iniciarDadosPadrao() {
        if (!localStorage.getItem(this.chaveStorage)) {
            const docesIniciais = [
                { id: 1, nome: "Bolo de Pote", categoria: "Bolos", preco: 12.50, descricao: "Bolo de chocolate.", imagem: "https://via.placeholder.com/150" },
                { id: 2, nome: "Brigadeiro", categoria: "Docinhos", preco: 4.00, descricao: "Brigadeiro tradicional.", imagem: "https://via.placeholder.com/150" }
            ];
            this.salvarDados(docesIniciais);
        }
    }
}