# Loja La Luz - Backend API

API REST para o e-commerce Loja La Luz, desenvolvida com Spring Boot 3.

## 🚀 Tecnologias

- Java 17
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL (produção) / H2 (desenvolvimento)
- Mercado Pago SDK

## 📋 Pré-requisitos

- Java 17+
- Maven 3.8+

## 🔧 Instalação

```bash
# Clone o repositório
cd backend

# Instale as dependências
./mvnw clean install

# Execute em modo desenvolvimento
./mvnw spring-boot:run
```

## 🌐 Endpoints

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login

### Produtos

- `GET /api/products` - Listar produtos
- `GET /api/products/{id}` - Detalhes do produto
- `GET /api/products/slug/{slug}` - Produto por slug
- `GET /api/products/search?q=termo` - Buscar produtos
- `GET /api/products/featured` - Produtos em destaque
- `GET /api/products/sale` - Produtos em promoção

### Categorias

- `GET /api/categories` - Listar categorias
- `GET /api/categories/tree` - Árvore de categorias

### Carrinho

- `GET /api/cart` - Ver carrinho
- `POST /api/cart/items` - Adicionar item
- `PATCH /api/cart/items/{id}?quantity=X` - Atualizar quantidade
- `DELETE /api/cart/items/{id}` - Remover item

### Pedidos (autenticado)

- `GET /api/orders` - Meus pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/{id}` - Detalhes do pedido

### Admin (requer role ADMIN)

- `GET /api/admin/dashboard` - Dashboard
- `POST /api/products` - Criar produto
- `PUT /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}` - Excluir produto

## 🔐 Usuários de Teste

| Email               | Senha      | Role     |
| ------------------- | ---------- | -------- |
| admin@lojalaluz.com | admin123   | ADMIN    |
| cliente@teste.com   | cliente123 | CUSTOMER |

## 🚀 Deploy no Heroku

```bash
# Login no Heroku
heroku login

# Criar app
heroku create loja-la-luz-api

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis
heroku config:set JWT_SECRET="sua-chave-secreta-muito-grande"
heroku config:set MERCADOPAGO_ACCESS_TOKEN="seu-token"
heroku config:set CORS_ORIGINS="https://seu-frontend.vercel.app"

# Deploy
git push heroku main
```

## 📝 Variáveis de Ambiente

| Variável                 | Descrição                 |
| ------------------------ | ------------------------- |
| DATABASE_URL             | URL do PostgreSQL         |
| JWT_SECRET               | Chave secreta para JWT    |
| MERCADOPAGO_ACCESS_TOKEN | Token do Mercado Pago     |
| CORS_ORIGINS             | URLs permitidas para CORS |
