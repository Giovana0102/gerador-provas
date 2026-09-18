import express from "express";
import * as subjectController from "../controllers/subjectController.js";
import validate from "../middlewares/validate.js";
import {
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
} from "../schemas/subjectSchema.js";

const router = express.Router();

/**
 * Rotas de Matérias
 * Base URL: /subjects
 */

// CREATE - Criar nova matéria
router.post("/", validate(createSubjectSchema), subjectController.create);

// READ - Listar todas as matérias
router.get("/", subjectController.getAll);

// READ - Buscar matéria por ID
router.get(
  "/:id",
  validate(subjectIdParamSchema, "params"),
  subjectController.getById,
);

// UPDATE - Atualizar parcialmente uma matéria
router.patch(
  "/:id",
  validate(subjectIdParamSchema, "params"),
  validate(updateSubjectSchema),
  subjectController.update,
);

// DELETE - Excluir uma matéria
router.delete(
  "/:id",
  validate(subjectIdParamSchema, "params"),
  subjectController.remove,
);

export default router;
