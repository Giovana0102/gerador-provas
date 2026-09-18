import prisma from "../config/database.js";

import { NotFoundError } from "../errors/AppError.js";

const publicQuestionSelect = {
  id: true,
  enunciado: true,
  dificuldade: true,
  respostaCorreta: true,
  ativa: true,
  createdAt: true,
  updatedAt: true,
  subject: {
    select: {
      id: true,
      nome: true,
      ativa: true,
    },
  },
  author: {
    select: {
      id: true,
      nome: true,
      email: true,
      foto: true,
      papel: true,
    },
  },
};

/**
 * Lista todas as questões.
 * @returns {Promise<Array>} Questões encontradas.
 */
export const getAllQuestions = async () => {
  return prisma.question.findMany({
    select: publicQuestionSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Busca uma questão pelo ID.
 * @param {number} questionId - ID da questão.
 * @returns {Promise<Object>} Questão encontrada.
 * @throws {NotFoundError} Quando a questão não existe.
 */
export const getQuestionById = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: publicQuestionSelect,
  });

  if (!question) {
    throw new NotFoundError(`Questão com ID ${questionId} não encontrada`);
  }

  return question;
};

/**
 * Cria uma nova questão.
 * @param {Object} questionData - Dados da questão.
 * @returns {Promise<Object>} Questão criada.
 * @throws {NotFoundError} Quando o subject ou autor não existe.
 */
export const createQuestion = async (questionData) => {
  const subject = await prisma.subject.findUnique({
    where: {
      id: questionData.subjectId,
    },
    select: {
      id: true,
    },
  });

  if (!subject) {
    throw new NotFoundError(
      `Matéria com ID ${questionData.subjectId} não encontrada`,
    );
  }

  const author = await prisma.user.findUnique({
    where: {
      id: questionData.authorId,
    },
    select: {
      id: true,
    },
  });

  if (!author) {
    throw new NotFoundError(
      `Usuário com ID ${questionData.authorId} não encontrado`,
    );
  }

  return prisma.question.create({
    data: {
      enunciado: questionData.enunciado,
      dificuldade: questionData.dificuldade,
      respostaCorreta: questionData.respostaCorreta ?? null,
      subjectId: questionData.subjectId,
      authorId: questionData.authorId,
      ativa: questionData.ativa ?? true,
    },
    select: publicQuestionSelect,
  });
};

/**
 * Atualiza parcialmente uma questão.
 * @param {number} questionId - ID da questão.
 * @param {Object} questionData - Campos a atualizar.
 * @returns {Promise<Object>} Questão atualizada.
 * @throws {NotFoundError} Quando a questão, subject ou autor não existe.
 */
export const updateQuestion = async (questionId, questionData) => {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      id: true,
    },
  });

  if (!question) {
    throw new NotFoundError(`Questão com ID ${questionId} não encontrada`);
  }

  if (questionData.subjectId !== undefined) {
    const subject = await prisma.subject.findUnique({
      where: {
        id: questionData.subjectId,
      },
      select: {
        id: true,
      },
    });

    if (!subject) {
      throw new NotFoundError(
        `Matéria com ID ${questionData.subjectId} não encontrada`,
      );
    }
  }

  if (questionData.authorId !== undefined) {
    const author = await prisma.user.findUnique({
      where: {
        id: questionData.authorId,
      },
      select: {
        id: true,
      },
    });

    if (!author) {
      throw new NotFoundError(
        `Usuário com ID ${questionData.authorId} não encontrado`,
      );
    }
  }

  return prisma.question.update({
    where: {
      id: questionId,
    },
    data: questionData,
    select: publicQuestionSelect,
  });
};

/**
 * Remove uma questão.
 * @param {number} questionId - ID da questão.
 * @returns {Promise<Object>} Resultado da exclusão.
 * @throws {NotFoundError} Quando a questão não existe.
 */
export const deleteQuestion = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      id: true,
    },
  });

  if (!question) {
    throw new NotFoundError(`Questão com ID ${questionId} não encontrada`);
  }

  await prisma.question.delete({
    where: {
      id: questionId,
    },
  });

  return {
    success: true,
    data: question,
  };
};
