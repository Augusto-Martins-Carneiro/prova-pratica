# Sistema de Doces da Dona Maria

Ei, pessoal! Sou um aluno do curso técnico e criei esse sistema maneiro pra vender doces online da Dona Maria. É um site simples feito com HTML, CSS e JavaScript, tipo um e-commerce básico pra doces. 😋

## Como tá organizado o projeto

- `index.html`: A página principal onde os clientes veem o catálogo dos doces.
- `admin.html`: A área do admin pra gerenciar os doces, tipo adicionar, editar ou deletar.
- `css/style.css`: Os estilos CSS, com tudo responsivo pra funcionar no celular também.
- `js/models/DoceModel.js`: Aqui cuido dos dados dos doces, usando LocalStorage e JSON pra salvar tudo.
- `js/controllers/CatalogoController.js`: Controla como o catálogo aparece pros clientes.
- `js/controllers/AdminController.js`: Controla as ações do admin, tipo CRUD (criar, ler, atualizar, deletar).

## Pastas do projeto

- `css/`: Tudo de estilo fica aqui.
- `js/`: Os arquivos JavaScript, separados em:
  - `models/`: Pra lidar com os dados.
  - `controllers/`: Pra lógica e interação com a página.

## Decisões que tomei

- Usei um MVC simplificado: Model pra dados, View pro HTML, Controller pra lógica. É bem básico, mas funciona.
- Pra salvar os dados, usei LocalStorage e JSON, já que não tem banco de dados de verdade.
- Deixei responsivo com CSS Grid e Media Queries, pra ficar bom no PC e no celular.
- Separei as responsabilidades: Model cuida dos dados, Controllers cuidam da interação.

## Como funciona o app

### Catálogo (index.html)
- Mostra os doces em um grid legal, cada um com nome, categoria, descrição, preço e foto.
- Tem um botão "Pedir pelo WhatsApp" pra mandar mensagem direto.

### Área Admin (admin.html)
- Formulário pra cadastrar novos doces.
- Lista todos os doces com opções pra editar ou deletar.
- Tudo fica salvo no LocalStorage do navegador.

## Padrão que usei

MVC Simplificado:
- **Model**: Gerencia os dados (DoceModel.js).
- **View**: As páginas HTML.
- **Controller**: A lógica de interação (CatalogoController.js e AdminController.js).

## Como rodar

1. Abre o `index.html` no navegador pra ver o catálogo.
2. Abre o `admin.html` pra gerenciar os doces.
3. Os dados ficam salvos localmente no navegador, tipo no cache.

## Tecnologias que usei

- HTML5
- CSS3 (com Media Queries pra responsividade)
- JavaScript (ES6+)
- LocalStorage pra persistência
- JSON pra manipular os dados

Foi um projeto legal pra aprender sobre frontend e organização de código! Se tiver dúvidas, pergunta aí. 🚀
