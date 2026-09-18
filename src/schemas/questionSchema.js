import { z } from "zod";

import { numericInputSchema, positiveIdSchema } from "./idSchema.js";

const enunciadoSchema = z
  .string()
  .trim()
  .min(3, "Enunciado deve ter pelo menos 3 caracteres")
  .max(500, "Enunciado deve ter no máximo 500 caracteres");

const dificuldadeSchema = numericInputSchema.pipe(
  z.coerce
    .number()
    .int("Dificuldade deve ser um número inteiro")
    .min(1, "Dificuldade deve ser 1, 2 ou 3")
    .max(3, "Dificuldade deve ser 1, 2 ou 3"),
);

const respostaCorretaSchema = z.union([
  z
    .string()
    .trim()
    .min(1, "Resposta correta não pode ser vazia")
    .max(500, "Resposta correta deve ter no máximo 500 caracteres"),
  z.null(),
]);

/**
 * Schema para POST /questions.
 */
export const createQuestionSchema = z
  .object({
    enunciado: enunciadoSchema,
    dificuldade: dificuldadeSchema,
    respostaCorreta: respostaCorretaSchema.optional(),
    subjectId: positiveIdSchema,
    authorId: positiveIdSchema,
    ativa: z.boolean().optional(),
  })
  .strict();

/**
 * Schema para PATCH /questions/:id.
 */
export const updateQuestionSchema = z
  .object({
    enunciado: enunciadoSchema.optional(),
    dificuldade: dificuldadeSchema.optional(),
    respostaCorreta: respostaCorretaSchema.optional(),
    subjectId: positiveIdSchema.optional(),
    authorId: positiveIdSchema.optional(),
    ativa: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualizar",
  });

/**
 * Schema para o parâmetro :id de /questions/:id.
 */
export const questionIdParamSchema = z.object({
  id: positiveIdSchema,
});
