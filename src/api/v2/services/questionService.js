import prisma from "../../../config/database.js";
import { ConflictError, NotFoundError } from "../../../errors/AppError.js";

const publicQuestionSelect = {
  id: true,
  enunciado: true,
  dificuldade: true,
  respostaCorreta: true,
  subjectId: true,
  authorId: true,
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
    },
  },
};

export async function getAllQuestions() {
  return prisma.question.findMany({
    select: publicQuestionSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getQuestionById(questionId) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: publicQuestionSelect,
  });

  if (!question) {
    throw new NotFoundError(
      `Questão com ID ${questionId} não encontrada`,
    );
  }

  return question;
}

export async function createQuestion(data) {
  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
    select: { id: true },
  });

  if (!subject) {
    throw new NotFoundError(
      `Matéria com ID ${data.subjectId} não encontrada`,
    );
  }

  const author = await prisma.user.findUnique({
    where: { id: data.authorId },
    select: { id: true },
  });

  if (!author) {
    throw new NotFoundError(
      `Autor com ID ${data.authorId} não encontrado`,
    );
  }

  return prisma.question.create({
    data: {
      ...data,
      ativa: data.ativa ?? true,
    },
    select: publicQuestionSelect,
  });
}

export async function updateQuestion(questionId, data) {
  await getQuestionById(questionId);

  if (data.subjectId !== undefined) {
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId },
      select: { id: true },
    });

    if (!subject) {
      throw new NotFoundError(
        `Matéria com ID ${data.subjectId} não encontrada`,
      );
    }
  }

  if (data.authorId !== undefined) {
    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
      select: { id: true },
    });

    if (!author) {
      throw new NotFoundError(
        `Autor com ID ${data.authorId} não encontrado`,
      );
    }
  }

  return prisma.question.update({
    where: { id: questionId },
    data,
    select: publicQuestionSelect,
  });
}

export async function deleteQuestion(questionId) {
  await getQuestionById(questionId);

  return prisma.question.delete({
    where: { id: questionId },
    select: publicQuestionSelect,
  });
}