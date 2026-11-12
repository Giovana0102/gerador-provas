// ADICIONADO: módulo V2 de questões; não altera arquivos ou regras da V1.
import express from "express";
import stableQuestionRoutes from "../../v1/routes/questionRoutes.js";
import authenticate from "../../../middlewares/auth.js";
import { isAdmin } from "../../../middlewares/authorize.js";

const router = express.Router();

// Escritas exigem autenticação; exclusões são exclusivas de ADMIN.
router.post("/", authenticate);
router.patch("/:id", authenticate);
router.delete("/:id", authenticate, isAdmin);

// ADICIONADO: reaproveita integralmente o contrato estável de Question.
router.use("/", stableQuestionRoutes);

export default router;
