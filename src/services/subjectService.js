import prisma from "../config/database.js";

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

export const getAllSubjects = async () => {
  return prisma.subject.findMany({
    select: publicSubjectSelect,
    orderBy: {
      id: "asc",
    },
  });
};

export const getSubjectById = async (subjectId) => {
  return prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: publicSubjectSelect,
  });
};

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
    return {
      ok: false,
      reason: "PROFESSOR_NOT_FOUND",
    };
  }

  const subject = await prisma.subject.create({
    data: {
      nome: subjectData.nome.trim(),
      ativa: subjectData.ativa ?? true,
      professorId: subjectData.professorId,
    },
    select: publicSubjectSelect,
  });

  return {
    ok: true,
    data: subject,
  };
};

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
    return {
      ok: false,
      reason: "SUBJECT_NOT_FOUND",
    };
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
      return {
        ok: false,
        reason: "PROFESSOR_NOT_FOUND",
      };
    }
  }

  const updatedSubject = await prisma.subject.update({
    where: {
      id: subjectId,
    },
    data: subjectData,
    select: publicSubjectSelect,
  });

  return {
    ok: true,
    data: updatedSubject,
  };
};

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
    return {
      ok: false,
      reason: "SUBJECT_NOT_FOUND",
    };
  }

  if (subject._count.questions > 0) {
    return {
      ok: false,
      reason: "SUBJECT_HAS_QUESTIONS",
    };
  }

  await prisma.subject.delete({
    where: {
      id: subjectId,
    },
  });

  return {
    ok: true,
  };
};
