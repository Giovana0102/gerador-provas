// ADICIONADO: rotas relativas V2 com schemas próprios e middleware compartilhado.
import express from "express";
import uploadPhoto from "../../../config/multer.js";
import { ValidationError } from "../../../errors/AppError.js";
import * as userController from "../controllers/userController.js";
import validate from "../../../middlewares/validate.js";
import {
  createUserV2Schema,
  idParamSchema,
  updateUserV2Schema,
} from "../schemas/userSchema.js";

const router = express.Router();

/**
 * Exige ao menos um campo ou um arquivo na atualização.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 */
function requireUpdatePayload(req, _res, next) {
  const hasFields = Object.keys(req.body ?? {}).length > 0;

  if (!hasFields && !req.file) {
    return next(
      new ValidationError(
        "Envie pelo menos um campo ou uma foto para atualização",
      ),
    );
  }

  return next();
}

router.post(
  "/",
  uploadPhoto,
  validate(createUserV2Schema),
  userController.create,
);
router.get("/", userController.getAll);
router.get("/:id", validate(idParamSchema, "params"), userController.getById);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  uploadPhoto,
  requireUpdatePayload,
  validate(updateUserV2Schema),
  userController.update,
);
router.delete("/:id", validate(idParamSchema, "params"), userController.remove);

export default router;
