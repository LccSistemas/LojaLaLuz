# 🌟 Loja La Luz - E-commerce de Moda

Sistema de e-commerce completo para loja de roupas, desenvolvido com **Angular 19** e **Spring Boot 3**.

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql)

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Deploy](#-deploy)
- [Credenciais de Teste](#-credenciais-de-teste)

## ✨ Funcionalidades

### Para Clientes

- 🛍️ Catálogo de produtos com filtros e busca
- 🛒 Carrinho de compras persistente
- 💳 Checkout com múltiplas formas de pagamento
- 👤 Área do cliente (pedidos, perfil, endereços)
- 📦 Rastreamento de pedidos

### Para Administradores

- 📊 Dashboard administrativo
- 📦 Gestão de produtos e categorias
- 📋 Gestão de pedidos
- 👥 Gestão de usuários

### Pagamentos (Mercado Pago)

- PIX (5% de desconto)
- Cartão de crédito (até 6x sem juros)
- Boleto bancário

## 🛠️ Tecnologias

### Backend

- Java 17
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL / H2 (dev)
- Mercado Pago SDK

### Frontend

- Angular 19 (Standalone Components)
- Tailwind CSS 3.4
- RxJS
- Angular Signals

## 📁 Estrutura do Projeto

```
LojaLaLuz/
├── backend/                    # API REST Spring Boot
│   ├── src/main/java/
│   │   └── com/lojalaluz/api/
│   │       ├── controller/     # Endpoints REST
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── model/          # Entidades JPA
│   │       ├── repository/     # Repositórios
│   │       ├── security/       # JWT, Spring Security
│   │       ├── service/        # Lógica de negócio
│   │       └── config/         # Configurações
│   ├── src/main/resources/
│   │   └── application.yml     # Configurações
│   └── pom.xml
│
├── frontend/                   # SPA Angular
│   ├── src/app/
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── services/           # Serviços HTTP
│   │   ├── models/             # Interfaces TypeScript
│   │   └── core/               # Interceptors, guards
│   ├── src/environments/       # Configurações de ambiente
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## ⚙️ Configuração

### Pré-requisitos

- Java 17+
- Node.js 18+
- PostgreSQL (para produção)

### Backend

```bash
cd backend

# Rodar com H2 (desenvolvimento)
./mvnw spring-boot:run -Dspring.profiles.active=dev

# Rodar com PostgreSQL (produção)
export DATABASE_URL=postgres://user:pass@host:5432/db
export JWT_SECRET=sua-chave-secreta
export MERCADO_PAGO_ACCESS_TOKEN=seu-token
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Desenvolvimento
npm start

# Build para produção
npm run build:prod
```

## 🚀 Deploy

### Backend (Heroku)

```bash
cd backend

# Criar app no Heroku
heroku create loja-la-luz-api

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis
heroku config:set JWT_SECRET=sua-chave-secreta
heroku config:set MERCADO_PAGO_ACCESS_TOKEN=seu-token

# Deploy
git push heroku main
```

### Frontend (Vercel)

```bash
cd frontend

# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔑 Credenciais de Teste

| Tipo    | Email               | Senha      |
| ------- | ------------------- | ---------- |
| Admin   | admin@lojalaluz.com | admin123   |
| Cliente | cliente@teste.com   | cliente123 |

## 📱 Screenshots

### Home

![Home](docs/screenshots/home.png)

### Produtos

![Produtos](docs/screenshots/products.png)

### Carrinho

![Carrinho](docs/screenshots/cart.png)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ para Loja La Luz
