import { z } from "zod";
import { positiveIdSchema } from "../../../schemas/idSchema.js";

export const idParamSchema = z.object({
  id: positiveIdSchema,
});

export const createQuestionSchema = z
  .object({
    enunciado: z
      .string()
      .trim()
      .min(3, "O enunciado deve ter pelo menos 3 caracteres")
      .max(500, "O enunciado deve ter no máximo 500 caracteres"),

    dificuldade: z
      .number()
      .int("A dificuldade deve ser um número inteiro")
      .min(1, "A dificuldade mínima é 1")
      .max(3, "A dificuldade máxima é 3"),

    subjectId: positiveIdSchema,
    authorId: positiveIdSchema,

    respostaCorreta: z
      .string()
      .trim()
      .min(1, "A resposta correta não pode ser vazia")
      .max(500, "A resposta correta deve ter no máximo 500 caracteres")
      .nullable()
      .optional(),

    ativa: z.boolean().optional(),
  })
  .strict();

export const updateQuestionSchema = z
  .object({
    enunciado: z
      .string()
      .trim()
      .min(3, "O enunciado deve ter pelo menos 3 caracteres")
      .max(500, "O enunciado deve ter no máximo 500 caracteres")
      .optional(),

    dificuldade: z
      .number()
      .int("A dificuldade deve ser um número inteiro")
      .min(1, "A dificuldade mínima é 1")
      .max(3, "A dificuldade máxima é 3")
      .optional(),

    subjectId: positiveIdSchema.optional(),
    authorId: positiveIdSchema.optional(),

    respostaCorreta: z
      .string()
      .trim()
      .min(1, "A resposta correta não pode ser vazia")
      .max(500, "A resposta correta deve ter no máximo 500 caracteres")
      .nullable()
      .optional(),

    ativa: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualizar",
  });