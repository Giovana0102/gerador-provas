// ADICIONADO: módulo V2 de matérias; reutiliza contrato estável sem editar a V1.
import express from "express";
import stableSubjectRoutes from "../../v1/routes/subjectRoutes.js";
import authenticate from "../../../middlewares/auth.js";
import { isAdmin } from "../../../middlewares/authorize.js";

const router = express.Router();

// Escritas exigem autenticação; exclusões são exclusivas de ADMIN.
router.post("/", authenticate);
router.patch("/:id", authenticate);
router.delete("/:id", authenticate, isAdmin);

// ADICIONADO: compõe validação, controller e service existentes de Subject.
router.use("/", stableSubjectRoutes);

export default router;
