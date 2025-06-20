# API de Avaliação de Filmes

![Node.js CI](https://img.shields.io/badge/Node.js-%3E%3D14-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-%3E%3D4.5-blue)
![License](https://img.shields.io/badge/License-MIT-blue)

**Uma API RESTful em Node.js + Express + TypeScript** para cadastro de usuários, autenticação, integração com o TMDb, e avaliações/reviews de filmes.

---

## 🔍 Sumário

- [Funcionalidades](#-funcionalidades)  
- [Pré‑requisitos](#-pré‑requisitos)  
- [Instalação](#-instalação)  
- [Variáveis de Ambiente](#-variáveis-de-ambiente)  
- [Rodando a API](#-rodando-a-api)  
- [Documentação Swagger](#-documentação-swagger)  
- [Testes](#-testes)    
- [Licença](#-licença)  

---

## 🚀 Funcionalidades

- **Auth**: signup, signin, forgot/reset password (JWT + Bcrypt)  
- **Movies**: busca via TMDb (detalhes, descoberta por gênero/ano, pesquisa por título)  
- **Reviews**: criar, listar, atualizar, deletar reviews de filmes
- **Rating Stats**: média e total de avaliações por filme  
- **Validação**: Zod para request schema  
- **Documentação**: OpenAPI 3.0 via Swagger UI  
- **Testes**: Jest unitários e integração com Supertest  
- **CI**: GitHub Actions

---

## 💻 Pré‑requisitos

- Node.js ≥ 14  
- npm ou yarn  
- MongoDB (local ou Atlas)  

---

## ⚙️ Instalação

```bash
git clone https://github.com/Arthur-7Melo/AvaliaFilmes-app.git
cd seu-repo/backend
npm install
```

## 🛠️ Variáveis de Ambiente
Crie um arquivo `.env` e preencha/modifique com as variáveis abaixo:

```dotenv
PORT=3333
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/dbname
JWT_SECRET=sua_chave_secreta
TMDB_API_KEY=seu_token_tmdb
TMDB_URL=https://api.themoviedb.org/3
```

## ▶️ Rodando a API

```bash
# Desenvolvimento
npm run dev

# Build + produção
npm run build
npm start
```
Servidor rodando em `http://localhost:3333`

## 📄 Documentação Swagger
Depois de iniciar a API, abra:

```bash
http://localhost:3333/api/docs
```
Lá você encontra todos os endpoints descritos em `openapi.yaml`, com schemas e exemplos

## ✅ Testes

```bash
# Testes unitários e de integração
npm test

# Cobertura
npm run test:coverage
```

## 📜 Licença
Este projeto está licenciado sob a [MIT License](https://opensource.org/license/mit)