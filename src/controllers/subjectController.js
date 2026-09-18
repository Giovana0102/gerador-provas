import * as subjectService from "../services/subjectService.js";

/**
 * Cria uma nova matéria vinculada a um professor.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const create = async (req, res, next) => {
  try {
    const materia = await subjectService.createSubject(req.body);
    return res.status(201).json({
      success: true,
      message: "Matéria criada com sucesso",
      data: materia,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Lista todas as matérias com os dados públicos do professor.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const getAll = async (req, res, next) => {
  try {
    const materias = await subjectService.getAllSubjects();
    return res.status(200).json({
      success: true,
      data: materias,
      total: materias.length,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Busca uma matéria pelo ID.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const getById = async (req, res, next) => {
  try {
    const materia = await subjectService.getSubjectById(req.params.id);

    if (!materia) {
      return res.status(404).json({
        success: false,
        message: `Matéria com ID ${req.params.id} não encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      data: materia,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Atualiza parcialmente uma matéria.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const update = async (req, res, next) => {
  try {
    const materia = await subjectService.updateSubject(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Matéria atualizada com sucesso",
      data: materia,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Exclui uma matéria sem questões vinculadas.
 * @param {import("express").Request} req - Requisição HTTP.
 * @param {import("express").Response} res - Resposta HTTP.
 * @param {import("express").NextFunction} next - Próximo middleware.
 * @returns {Promise<void>}
 */
export const remove = async (req, res, next) => {
  try {
    const resultado = await subjectService.deleteSubject(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Matéria excluída com sucesso",
      data: resultado.data,
    });
  } catch (error) {
    return next(error);
  }
};
