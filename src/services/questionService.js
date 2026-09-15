import prisma from "../config/database.js";

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

export const getAllQuestions = async () => {
  return prisma.question.findMany({
    select: publicQuestionSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getQuestionById = async (questionId) => {
  return prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: publicQuestionSelect,
  });
};

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
    return {
      ok: false,
      reason: "SUBJECT_NOT_FOUND",
    };
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
    return {
      ok: false,
      reason: "AUTHOR_NOT_FOUND",
    };
  }

  const question = await prisma.question.create({
    data: {
      enunciado: questionData.enunciado.trim(),
      dificuldade: questionData.dificuldade,
      respostaCorreta: questionData.respostaCorreta ?? null,
      subjectId: questionData.subjectId,
      authorId: questionData.authorId,
      ativa: questionData.ativa ?? true,
    },
    select: publicQuestionSelect,
  });

  return {
    ok: true,
    data: question,
  };
};

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
    return {
      ok: false,
      reason: "QUESTION_NOT_FOUND",
    };
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
      return {
        ok: false,
        reason: "SUBJECT_NOT_FOUND",
      };
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
      return {
        ok: false,
        reason: "AUTHOR_NOT_FOUND",
      };
    }
  }

  const updatedQuestion = await prisma.question.update({
    where: {
      id: questionId,
    },
    data: questionData,
    select: publicQuestionSelect,
  });

  return {
    ok: true,
    data: updatedQuestion,
  };
};

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
    return {
      ok: false,
      reason: "QUESTION_NOT_FOUND",
    };
  }

  await prisma.question.delete({
    where: {
      id: questionId,
    },
  });

  return {
    ok: true,
  };
};
