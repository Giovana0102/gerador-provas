import { z } from "zod";
import { positiveIdSchema } from "../../../schemas/idSchema.js";

export const idParamSchema = z.object({
id: positiveIdSchema,
});

export const createSubjectSchema = z
.object({
nome: z
.string()
.trim()
.min(3, "Nome deve ter pelo menos 3 caracteres")
.max(100, "Nome deve ter no máximo 100 caracteres"),
professorId: positiveIdSchema,
ativa: z.boolean().optional(),
})
.strict();

export const updateSubjectSchema = z
.object({
nome: z
.string()
.trim()
.min(3, "Nome deve ter pelo menos 3 caracteres")
.max(100, "Nome deve ter no máximo 100 caracteres")
.optional(),
professorId: positiveIdSchema.optional(),
ativa: z.boolean().optional(),
})
.strict()
.refine((data) => Object.keys(data).length > 0, {
message: "Informe pelo menos um campo para atualizar",
});
