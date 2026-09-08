# API Gerador de Provas

## Aluna

**Nome completo:** Giovana Cardoso Silva

---

## Sobre a atividade

Esta atividade teve como objetivo desenvolver e ampliar uma API para gerenciamento de um sistema de geração de provas, utilizando Node.js, Express, Prisma ORM e PostgreSQL.

Durante o desenvolvimento foi realizada a criação e configuração das entidades do sistema, seus relacionamentos no banco de dados e as rotas da API para gerenciamento de usuários, matérias e questões.

A API possui os seguintes recursos:

- Usuários;
- Matérias/disciplinas;
- Questões;
- Relacionamento entre professores e matérias;
- Relacionamento entre usuários e questões;
- Relacionamento entre matérias e questões.

Também foram implementadas validações dos dados, tratamento de erros e respostas HTTP adequadas para diferentes situações.

## Tecnologias utilizadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Neon
- Bruno

## Principais endpoints

### Usuários
GET  /users
GET  /users/:id
POST /users

## Matérias
GET  /subjects
GET  /subjects/:id
POST /subjects

## Questões
GET  /questions
GET  /questions/:id
POST /questions

## Health Check
GET /health 

## Como executar o projeto

Primeiro, entre na pasta do projeto:

cd gerador-provas

## Instale as dependências:

## npm install

Configure o arquivo .env com a variável DATABASE_URL.

## Execute as migrations do Prisma:

npx prisma migrate dev

## Gere o Prisma Client:

npx prisma generate

## Inicie a API:
 
npm run dev

## A API estará disponível em:

http://127.0.0.1:3000

## Créditos

Projeto desenvolvido com auxílio do ChatGPT (OpenAI) para tirar dúvidas, ajudar na configuração do projeto, corrigir erros e entender melhor as tecnologias utilizadas.
