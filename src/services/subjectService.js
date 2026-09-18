import prisma from "../config/database.js";

import { ConflictError, NotFoundError } from "../errors/AppError.js";

const publicSubjectSelect = {
  id: true,
  nome: true,
  ativa: true,
  createdAt: true,
  updatedAt: true,
  professor: {
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
 * Lista todas as matérias.
 * @returns {Promise<Array>} Matérias encontradas.
 */
export const getAllSubjects = async () => {
  return prisma.subject.findMany({
    select: publicSubjectSelect,
    orderBy: {
      id: "asc",
    },
  });
};

/**
 * Busca uma matéria pelo ID.
 * @param {number} subjectId - ID da matéria.
 * @returns {Promise<Object>} Matéria encontrada.
 * @throws {NotFoundError} Quando a matéria não existe.
 */
export const getSubjectById = async (subjectId) => {
  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: publicSubjectSelect,
  });

  if (!subject) {
    throw new NotFoundError(`Matéria com ID ${subjectId} não encontrada`);
  }

  return subject;
};

/**
 * Cria uma nova matéria.
 * @param {Object} subjectData - Dados da matéria.
 * @returns {Promise<Object>} Matéria criada.
 * @throws {NotFoundError} Quando o professor não existe.
 */
export const createSubject = async (subjectData) => {
  const professor = await prisma.user.findUnique({
    where: {
      id: subjectData.professorId,
    },
    select: {
      id: true,
    },
  });

  if (!professor) {
    throw new NotFoundError(
      `Professor com ID ${subjectData.professorId} não encontrado`,
    );
  }

  return prisma.subject.create({
    data: {
      nome: subjectData.nome,
      ativa: subjectData.ativa ?? true,
      professorId: subjectData.professorId,
    },
    select: publicSubjectSelect,
  });
};

/**
 * Atualiza parcialmente uma matéria.
 * @param {number} subjectId - ID da matéria.
 * @param {Object} subjectData - Campos a atualizar.
 * @returns {Promise<Object>} Matéria atualizada.
 * @throws {NotFoundError} Quando a matéria ou professor não existe.
 */
export const updateSubject = async (subjectId, subjectData) => {
  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: {
      id: true,
    },
  });

  if (!subject) {
    throw new NotFoundError(`Matéria com ID ${subjectId} não encontrada`);
  }

  if (subjectData.professorId !== undefined) {
    const professor = await prisma.user.findUnique({
      where: {
        id: subjectData.professorId,
      },
      select: {
        id: true,
      },
    });

    if (!professor) {
      throw new NotFoundError(
        `Professor com ID ${subjectData.professorId} não encontrado`,
      );
    }
  }

  return prisma.subject.update({
    where: {
      id: subjectId,
    },
    data: subjectData,
    select: publicSubjectSelect,
  });
};

/**
 * Remove uma matéria.
 * @param {number} subjectId - ID da matéria.
 * @returns {Promise<Object>} Resultado da exclusão.
 * @throws {NotFoundError} Quando a matéria não existe.
 * @throws {ConflictError} Quando existem questões vinculadas.
 */
export const deleteSubject = async (subjectId) => {
  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: {
      id: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  if (!subject) {
    throw new NotFoundError(`Matéria com ID ${subjectId} não encontrada`);
  }

  if (subject._count.questions > 0) {
    throw new ConflictError("Matéria possui questões vinculadas");
  }

  try {
    await prisma.subject.delete({
      where: {
        id: subjectId,
      },
    });
  } catch (error) {
    if (error?.code === "P2003" || error?.code === "P2014") {
      throw new ConflictError("Matéria possui questões vinculadas");
    }

    if (error?.code === "P2025") {
      throw new NotFoundError(`Matéria com ID ${subjectId} não encontrada`);
    }

    throw error;
  }

  return {
    success: true,
    data: subject,
  };
};
