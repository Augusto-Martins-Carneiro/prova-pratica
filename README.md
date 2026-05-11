Sistema de Doces da Dona Maria

Projeto com o intuito de ajudar dona Maria a vender seus doces caseiros e expandir sua clientela.

- Estruturação do Projeto:

📁 PROVA-PRATICA/
│
├── 📁 css/
│   ├── admin.css
│   ├── global.css
│   └── style.css
│
├── 📁 images/
│   ├── bemcasado.jpg
│   ├── bolocenoura.jpg
│   ├── bolochocolate.jpg
│   ├── boloredvelvet.jpg
│   ├── brigadeirogourmet.jpg
│   ├── brigadeironinh.jpg
│   ├── brigadeiropistache.jpg
│   ├── cajuzinho.jpg
│   ├── tortalimao.jpg
│   ├── tortamorango.jpg
│   ├── trufachocolate.jpg
│   └── trufamaracuja.jpg
│
├── 📁 js/
│   ├── admin.js
│   ├── app.js
│   ├── app,js
│   ├── cart.js
│   └── storage.js
│
├── admin.html
├── index.html
├── package.json
├── products.json
└── README.md

Uma breve descrição dos arquivos:

index.html: o principal, onde os clientes visualizam o catálogo dos produtos de dona Maria.

admin.html: área administrativa, onde o CRUD permite cadastrar, editar e remover os produtos do sistema.

style.css: responsável pelo estilo do projeto, e inclui responsividade para dispositivos móveis.

global.css: base que pode ser usado em todo o projeto, fundamento pro resto dos CSS

admin.css: CSS específico pro admin.html, customiza o admin pra ser prática de usar

app.js: controla a página inicial, carrega os produtos nos cards, contorla carrinho de compras e lida com eventos

storage.js: cuida de salvar, carregar dados usando localstorage do navegador e arquivos JSON

cart.js: específico pro carrinho, mas é integrado no storage.js, ele cuida de adicionar e remover produtos do carrinho e calcular total

admin.js: controla a página do admin, onde dona Maria gerencia seus produtos

products.json: lista os produtos, e serve como fonte de dados inicialmente carregado pelo JS para popular o catálogo

paackage.json: metadados e scripts do node.js, gerencia as dependencias e comandos


-- Tecnologias utilizadas:

HTML5
CSS3
JS ES6+
LOCALSTORAGER
JSON    

Funcionalidades do sistema:

Catálogo: exibe os produtos em formato de cards, nome, categoria, descrição, preço e imagem. Além de um botão de pedir via Whatsapp

Área do admin: cadastro de produtos, edição, e exclusão de produtos, e dados utilizando o localstorage

Organização do projeto:

Foi utilizado um padrão MVC simplificado para deixar os códigos mais organizados

Model: responsável pelos dados da aplicação
View

