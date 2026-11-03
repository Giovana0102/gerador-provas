\# Registro da Atividade — Upload de Foto no PATCH V2



\## Identificação



\- \*\*Projeto:\*\* Gerador de Provas

\- \*\*Branch:\*\* `atividade-patch-upload`

\- \*\*Commit:\*\* `7a055dc`

\- \*\*Objetivo:\*\* Implementar o upload opcional de foto na atualização de usuários pela rota PATCH V2.



\## Arquivos alterados



\- `src/api/v2/controllers/userController.js`

\- `src/api/v2/routes/userRoutes.js`

\- `src/api/v2/schemas/userSchema.js`



\## Implementações realizadas



\- Validação do ID antes do processamento do arquivo.

\- Inclusão do middleware de upload na rota PATCH V2.

\- Permissão para atualizar o usuário enviando somente uma foto.

\- Rejeição de atualização sem campos e sem arquivo.

\- Encaminhamento do arquivo recebido pelo controller ao serviço existente.

\- Manutenção da validação dos campos textuais.



\## Comandos e resultados



| Comando | Resultado |

|---|---|

| `npm run lint` | Aprovado |

| `npx prettier --check` nos três arquivos alterados | Aprovado |

| `npx prisma validate` | Aprovado |

| `npx prisma migrate status` | Migrações atualizadas |

| `npm run test:pratica` | 18 testes aprovados |

| `npm run test:atividade` | 18 testes aprovados |

| `npm test` | 204 testes aprovados |



\## Entrega



Branch publicada no repositório:



https://github.com/Giovana0102/gerador-provas/tree/atividade-patch-upload



Commit: `7a055dc feat: adiciona upload de foto no PATCH de usuarios V2`



\## Verificação pendente



\- Conclusão da execução da coleção completa do Bruno no ambiente de avaliação.

