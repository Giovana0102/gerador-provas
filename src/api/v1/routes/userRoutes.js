import express from "express";
import * as userController from "../controllers/userController.js";
import validate from "../../../middlewares/validate.js";
import {
  createUserSchema,
  idParamSchema,
  updateUserSchema,
} from "../schemas/userSchema.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserV1:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - email
 *         - papel
 *         - foto
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Grace Hopper
 *         email:
 *           type: string
 *           format: email
 *           example: grace@example.com
 *         papel:
 *           type: string
 *           enum: [PROFESSOR, ADMIN]
 *           example: PROFESSOR
 *         foto:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserV1Response:
 *       type: object
 *       required:
 *         - success
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Usuário criado com sucesso
 *         data:
 *           $ref: '#/components/schemas/UserV1'
 *
 *     UserV1ListResponse:
 *       type: object
 *       required:
 *         - success
 *         - data
 *         - total
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserV1'
 *         total:
 *           type: integer
 *           example: 10
 *
 *     CreateUserV1:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - nome
 *         - email
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: Grace Hopper
 *         email:
 *           type: string
 *           format: email
 *           example: grace@example.com
 *         papel:
 *           type: string
 *           enum: [PROFESSOR, ADMIN]
 *           example: PROFESSOR
 *         foto:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: null
 *
 *     UpdateUserV1:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: Grace Hopper
 *         email:
 *           type: string
 *           format: email
 *           example: grace@example.com
 *         papel:
 *           type: string
 *           enum: [PROFESSOR, ADMIN]
 *           example: ADMIN
 *         foto:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: null
 */

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Criar usuário V1
 *     description: Cadastra um usuário com nome, e-mail e campos opcionais.
 *     tags: [Usuários V1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserV1'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserV1Response'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post("/", validate(createUserSchema), userController.create);

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Listar usuários V1
 *     description: Retorna todos os usuários cadastrados.
 *     tags: [Usuários V1]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserV1ListResponse'
 */
router.get("/", userController.getAll);

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Buscar usuário V1 por ID
 *     description: Retorna os dados de um usuário específico.
 *     tags: [Usuários V1]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserV1Response'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", validate(idParamSchema, "params"), userController.getById);

/**
 * @swagger
 * /v1/users/{id}:
 *   patch:
 *     summary: Atualizar usuário V1
 *     description: Atualiza um ou mais campos do usuário informado.
 *     tags: [Usuários V1]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserV1'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserV1Response'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateUserSchema),
  userController.update,
);

/**
 * @swagger
 * /v1/users/{id}:
 *   delete:
 *     summary: Remover usuário V1
 *     description: Remove o usuário informado pelo ID.
 *     tags: [Usuários V1]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserV1Response'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.delete("/:id", validate(idParamSchema, "params"), userController.remove);

export default router;
