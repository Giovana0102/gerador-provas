# Gerador de Provas - API

Nome: Giovana Cardoso Silva

Projeto desenvolvido para gerenciamento de usuários, matérias e questões.

# Tecnologias utilizadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Neon

# Endpoints

# Usuários
GET /users

# Matérias
GET /subjects

# Questões
GET /questions

## Como executar o projeto

1. Instale as dependências:

npm install

2. Crie um arquivo `.env` baseado no `.env.example`.

3. Configure a variável `DATABASE_URL`.

4. Execute o servidor:

npm run dev

O servidor será iniciado na porta 3000.

## Testes

Os endpoints foram testados utilizando o Bruno, com retorno `200 OK`.

