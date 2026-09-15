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
- Vitest
- Supertest

## Principais endpoints

### Usuários

GET `/users`

GET `/users/:id`

POST `/users`

### Matérias

GET `/subjects`

GET `/subjects/:id`

POST `/subjects`

PATCH `/subjects/:id`

DELETE `/subjects/:id`

### Questões

GET `/questions`

GET `/questions/:id`

POST `/questions`

PATCH `/questions/:id`

DELETE `/questions/:id`

### Health Check

GET `/health`

## Como executar o projeto

Primeiro, entre na pasta do projeto:

```bash
cd gerador-provas

