import * as questionService from "../services/questionService.js";

/**
 * Controller de Questões
 * Responsável pelas operações de criação e leitura de questões.
 */

/**
 * Cria uma nova questão vinculada a uma matéria e a um autor.
 */
export const create = async (req, res) => {
  try {
    const {
      enunciado,
      dificuldade,
      respostaCorreta,
      subjectId,
      authorId,
      ativa,
    } = req.body;

    // Validação dos campos obrigatórios
    if (
      enunciado === undefined ||
      dificuldade === undefined ||
      subjectId === undefined ||
      authorId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enunciado, dificuldade, subjectId e authorId são obrigatórios",
      });
    }

    // Validação do enunciado
    if (typeof enunciado !== "string" || !enunciado.trim()) {
      return res.status(400).json({
        success: false,
        message: "enunciado deve ser um texto não vazio",
      });
    }

    // Converte os IDs e dificuldade para números
    const idSubject = Number(subjectId);
    const idAuthor = Number(authorId);
    const nivelDificuldade = Number(dificuldade);

    // Validação dos IDs
    if (
      !Number.isInteger(idSubject) ||
      idSubject <= 0 ||
      !Number.isInteger(idAuthor) ||
      idAuthor <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "subjectId e authorId devem ser números inteiros positivos",
      });
    }

    // Validação da dificuldade
    if (![1, 2, 3].includes(nivelDificuldade)) {
      return res.status(400).json({
        success: false,
        message: "Dificuldade deve ser 1, 2 ou 3",
      });
    }

    // Validação da resposta correta
    if (
      respostaCorreta !== undefined &&
      respostaCorreta !== null &&
      typeof respostaCorreta !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "respostaCorreta deve ser um texto ou null",
      });
    }

    // Validação da ativa
    if (ativa !== undefined && typeof ativa !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ativa deve ser um booleano",
      });
    }

    // Cria a questão através do service
    const resultado = await questionService.createQuestion({
      enunciado,
      dificuldade: nivelDificuldade,
      respostaCorreta,
      subjectId: idSubject,
      authorId: idAuthor,
      ativa,
    });

    // Matéria não encontrada
    if (!resultado.ok && resultado.reason === "SUBJECT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    // Autor não encontrado
    if (!resultado.ok && resultado.reason === "AUTHOR_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Autor não encontrado",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Questão criada com sucesso",
      data: resultado.data,
    });
  } catch (error) {
    console.error("Erro ao criar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao criar questão",
    });
  }
};

/**
 * Lista todas as questões com matéria e autor.
 */
export const getAll = async (req, res) => {
  try {
    const questoes = await questionService.getAllQuestions();

    return res.status(200).json({
      success: true,
      data: questoes,
      total: questoes.length,
    });
  } catch (error) {
    console.error("Erro ao listar questões:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao listar questões",
    });
  }
};

/**
 * Busca uma questão pelo ID.
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const questionId = Number(id);

    // Validação do ID
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const questao = await questionService.getQuestionById(questionId);

    if (!questao) {
      return res.status(404).json({
        success: false,
        message: `Questão com ID ${questionId} não encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      data: questao,
    });
  } catch (error) {
    console.error("Erro ao buscar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar questão",
    });
  }
};

/**
 * Atualiza parcialmente uma questão.
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const questionId = Number(id);

    // Validação do ID
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const {
      enunciado,
      dificuldade,
      respostaCorreta,
      subjectId,
      authorId,
      ativa,
    } = req.body;

    // Verifica se pelo menos um campo foi enviado
    if (
      enunciado === undefined &&
      dificuldade === undefined &&
      respostaCorreta === undefined &&
      subjectId === undefined &&
      authorId === undefined &&
      ativa === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Envie pelo menos um campo para atualizar",
      });
    }

    // Validação do enunciado
    if (enunciado !== undefined) {
      if (typeof enunciado !== "string" || !enunciado.trim()) {
        return res.status(400).json({
          success: false,
          message: "enunciado deve ser um texto não vazio",
        });
      }
    }

    // Validação da dificuldade
    let nivelDificuldade;

    if (dificuldade !== undefined) {
      nivelDificuldade = Number(dificuldade);

      if (
        !Number.isInteger(nivelDificuldade) ||
        ![1, 2, 3].includes(nivelDificuldade)
      ) {
        return res.status(400).json({
          success: false,
          message: "Dificuldade deve ser um número inteiro entre 1 e 3",
        });
      }
    }

    // Validação da resposta correta
    if (
      respostaCorreta !== undefined &&
      respostaCorreta !== null &&
      typeof respostaCorreta !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "respostaCorreta deve ser um texto ou null",
      });
    }

    // Validação do subjectId
    let idSubject;

    if (subjectId !== undefined) {
      idSubject = Number(subjectId);

      if (!Number.isInteger(idSubject) || idSubject <= 0) {
        return res.status(400).json({
          success: false,
          message: "subjectId deve ser um número inteiro positivo",
        });
      }
    }

    // Validação do authorId
    let idAuthor;

    if (authorId !== undefined) {
      idAuthor = Number(authorId);

      if (!Number.isInteger(idAuthor) || idAuthor <= 0) {
        return res.status(400).json({
          success: false,
          message: "authorId deve ser um número inteiro positivo",
        });
      }
    }

    // Validação da ativa
    if (ativa !== undefined && typeof ativa !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ativa deve ser um booleano",
      });
    }

    const resultado = await questionService.updateQuestion(questionId, {
      ...(enunciado !== undefined && { enunciado: enunciado.trim() }),
      ...(nivelDificuldade !== undefined && {
        dificuldade: nivelDificuldade,
      }),
      ...(respostaCorreta !== undefined && { respostaCorreta }),
      ...(idSubject !== undefined && { subjectId: idSubject }),
      ...(idAuthor !== undefined && { authorId: idAuthor }),
      ...(ativa !== undefined && { ativa }),
    });

    if (!resultado.ok) {
      if (resultado.reason === "QUESTION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: `Questão com ID ${questionId} não encontrada`,
        });
      }

      if (resultado.reason === "SUBJECT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Matéria não encontrada",
        });
      }

      if (resultado.reason === "AUTHOR_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Autor não encontrado",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Questão atualizada com sucesso",
      data: resultado.data,
    });
  } catch (error) {
    console.error("Erro ao atualizar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar questão",
    });
  }
};

/**
 * Exclui uma questão.
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const questionId = Number(id);

    // Validação do ID
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const resultado = await questionService.deleteQuestion(questionId);

    if (!resultado.ok) {
      return res.status(404).json({
        success: false,
        message: `Questão com ID ${questionId} não encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Questão excluída com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao excluir questão",
    });
  }
};
