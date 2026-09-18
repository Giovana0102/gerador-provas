import * as userService from "../services/userService.js";

/**
 * Cria um novo usuário.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const create = async (req, res, next) => {
  try {
    const usuario = await userService.createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: usuario,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Lista todos os usuários.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const getAll = async (req, res, next) => {
  try {
    const usuarios = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      data: usuarios,
      total: usuarios.length,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Busca um usuário pelo ID.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const getById = async (req, res, next) => {
  try {
    const usuario = await userService.getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Atualiza parcialmente um usuário.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const update = async (req, res, next) => {
  try {
    const usuario = await userService.updateUser(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso",
      data: usuario,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Exclui um usuário.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const remove = async (req, res, next) => {
  try {
    const usuario = await userService.deleteUser(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Usuário excluído com sucesso",
      data: usuario,
    });
  } catch (error) {
    return next(error);
  }
};
