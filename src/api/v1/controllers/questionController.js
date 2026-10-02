import * as questionService from "../services/questionService.js";

/**
 * Cria uma nova questão vinculada a uma matéria e a um autor.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const create = async (req, res, next) => {
  try {
    const questao = await questionService.createQuestion(req.body);
    return res.status(201).json({
      success: true,
      message: "Questão criada com sucesso",
      data: questao,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Lista todas as questões com matéria e autor.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const getAll = async (req, res, next) => {
  try {
    const questoes = await questionService.getAllQuestions();
    return res.status(200).json({
      success: true,
      data: questoes,
      total: questoes.length,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Busca uma questão pelo ID.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const getById = async (req, res, next) => {
  try {
    const questao = await questionService.getQuestionById(req.params.id);

    if (!questao) {
      return res.status(404).json({
        success: false,
        message: `Questão com ID ${req.params.id} não encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      data: questao,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Atualiza parcialmente uma questão.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const update = async (req, res, next) => {
  try {
    const questao = await questionService.updateQuestion(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Questão atualizada com sucesso",
      data: questao,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Exclui uma questão.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const remove = async (req, res, next) => {
  try {
    const resultado = await questionService.deleteQuestion(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Questão excluída com sucesso",
      data: resultado.data,
    });
  } catch (error) {
    return next(error);
  }
};
