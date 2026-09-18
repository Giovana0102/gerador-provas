import express from "express";
import * as questionController from "../controllers/questionController.js";
import validate from "../middlewares/validate.js";
import {
  createQuestionSchema,
  updateQuestionSchema,
  questionIdParamSchema,
} from "../schemas/questionSchema.js";

const router = express.Router();

/**
 * Rotas de Questões
 * Base URL: /questions
 */

// CREATE - Criar nova questão
router.post("/", validate(createQuestionSchema), questionController.create);

// READ - Listar todas as questões
router.get("/", questionController.getAll);

// READ - Buscar questão por ID
router.get(
  "/:id",
  validate(questionIdParamSchema, "params"),
  questionController.getById,
);

// UPDATE - Atualizar parcialmente uma questão
router.patch(
  "/:id",
  validate(questionIdParamSchema, "params"),
  validate(updateQuestionSchema),
  questionController.update,
);

// DELETE - Excluir uma questão
router.delete(
  "/:id",
  validate(questionIdParamSchema, "params"),
  questionController.remove,
);

export default router;
