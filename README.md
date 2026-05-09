# Sistema de Doces da Dona Maria

Este é um sistema frontend para a venda de doces pela internet, desenvolvido com HTML, CSS e JavaScript.

## Estrutura do Projeto

- `index.html`: Página pública do catálogo de doces.
- `admin.html`: Página administrativa para gerenciamento de doces (CRUD).
- `css/style.css`: Estilos CSS com responsividade.
- `js/models/DoceModel.js`: Modelo para manipulação dos dados dos doces, utilizando LocalStorage e JSON.
- `js/controllers/CatalogoController.js`: Controlador para a visualização do catálogo.
- `js/controllers/AdminController.js`: Controlador para o CRUD administrativo.

## Organização das Pastas

- `css/`: Contém os arquivos de estilo.
- `js/`: Contém os arquivos JavaScript organizados em:
  - `models/`: Modelos de dados.
  - `controllers/`: Controladores para lógica de negócio.

## Decisões Tomadas

- Utilização de padrão MVC simplificado: Model (DoceModel), View (HTML), Controller (CatalogoController e AdminController).
- Persistência de dados simulada com LocalStorage e JSON.
- Responsividade implementada com CSS Grid e Media Queries.
- Separação de responsabilidades: Model cuida dos dados, Controllers cuidam da lógica e interação com DOM.

## Funcionamento da Aplicação

### Catálogo (index.html)
- Exibe os doces cadastrados em um grid responsivo.
- Cada card mostra nome, categoria, descrição, preço e imagem.
- Botão "Pedir pelo WhatsApp" para contato direto.

### Área Administrativa (admin.html)
- Formulário para cadastrar novos doces.
- Listagem dos doces com opções de editar e deletar.
- Dados salvos no LocalStorage.

## Padrão Utilizado

MVC Simplificado:
- **Model**: Gerencia os dados (DoceModel.js).
- **View**: HTML das páginas.
- **Controller**: Lógica de interação (CatalogoController.js e AdminController.js).

## Como Executar

1. Abra o `index.html` em um navegador para visualizar o catálogo.
2. Abra o `admin.html` para gerenciar os doces.
3. Os dados são persistidos localmente no navegador via LocalStorage.

## Tecnologias Utilizadas

- HTML5
- CSS3 (com Media Queries para responsividade)
- JavaScript (ES6+)
- LocalStorage para persistência
- JSON para manipulação de dados
