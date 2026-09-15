import * as subjectService from "../services/subjectService.js";

/**
 * Controller de Matérias
 * Responsável pelas operações de criação e leitura de matérias.
 */

/**
 * Cria uma nova matéria vinculada a um professor.
 */
export const create = async (req, res) => {
  try {
    const { nome, professorId, ativa } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || professorId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Nome e professorId são obrigatórios",
      });
    }

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({
        success: false,
        message: "nome deve ser um texto não vazio",
      });
    }

    if (ativa !== undefined && typeof ativa !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ativa deve ser um booleano",
      });
    }

    // Validação do ID do professor
    const idProfessor = Number(professorId);

    if (!Number.isInteger(idProfessor) || idProfessor <= 0) {
      return res.status(400).json({
        success: false,
        message: "professorId inválido. Deve ser um número inteiro positivo",
      });
    }

    // Cria a matéria através do service
    const resultado = await subjectService.createSubject({
      nome,
      professorId: idProfessor,
      ativa,
    });

    if (!resultado.ok) {
      return res.status(404).json({
        success: false,
        message: "Professor não encontrado",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Matéria criada com sucesso",
      data: resultado.data,
    });
  } catch (error) {
    console.error("Erro ao criar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao criar matéria",
    });
  }
};

/**
 * Lista todas as matérias com os dados públicos do professor.
 */
export const getAll = async (req, res) => {
  try {
    const materias = await subjectService.getAllSubjects();

    return res.status(200).json({
      success: true,
      data: materias,
      total: materias.length,
    });
  } catch (error) {
    console.error("Erro ao listar matérias:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao listar matérias",
    });
  }
};

/**
 * Busca uma matéria pelo ID.
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const subjectId = Number(id);

    // Validação do ID
    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const materia = await subjectService.getSubjectById(subjectId);

    if (!materia) {
      return res.status(404).json({
        success: false,
        message: `Matéria com ID ${subjectId} não encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      data: materia,
    });
  } catch (error) {
    console.error("Erro ao buscar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar matéria",
    });
  }
};

/**
 * Atualiza parcialmente uma matéria.
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const subjectId = Number(id);

    // Validação do ID
    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const { nome, ativa, professorId } = req.body;

    // Verifica se pelo menos um campo foi enviado
    if (
      nome === undefined &&
      ativa === undefined &&
      professorId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Envie pelo menos um campo para atualizar",
      });
    }

    // Validação do nome
    if (nome !== undefined && (typeof nome !== "string" || !nome.trim())) {
      return res.status(400).json({
        success: false,
        message: "nome deve ser um texto não vazio",
      });
    }

    // Validação da ativa
    if (ativa !== undefined && typeof ativa !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ativa deve ser um booleano",
      });
    }

    // Validação do professorId
    let idProfessor;

    if (professorId !== undefined) {
      idProfessor = Number(professorId);

      if (!Number.isInteger(idProfessor) || idProfessor <= 0) {
        return res.status(400).json({
          success: false,
          message: "professorId inválido. Deve ser um número inteiro positivo",
        });
      }
    }

    const resultado = await subjectService.updateSubject(subjectId, {
      ...(nome !== undefined && { nome: nome.trim() }),
      ...(ativa !== undefined && { ativa }),
      ...(idProfessor !== undefined && { professorId: idProfessor }),
    });

    if (!resultado.ok) {
      if (resultado.reason === "SUBJECT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: `Matéria com ID ${subjectId} não encontrada`,
        });
      }

      if (resultado.reason === "PROFESSOR_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Professor não encontrado",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Matéria atualizada com sucesso",
      data: resultado.data,
    });
  } catch (error) {
    console.error("Erro ao atualizar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar matéria",
    });
  }
};

/**
 * Exclui uma matéria sem questões vinculadas.
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const subjectId = Number(id);

    // Validação do ID
    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const resultado = await subjectService.deleteSubject(subjectId);

    if (!resultado.ok) {
      if (resultado.reason === "SUBJECT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: `Matéria com ID ${subjectId} não encontrada`,
        });
      }

      if (resultado.reason === "SUBJECT_HAS_QUESTIONS") {
        return res.status(409).json({
          success: false,
          message: "Não é possível excluir uma matéria que possui questões",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Matéria excluída com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao excluir matéria",
    });
  }
};
