import prisma from "../../../config/database.js";
import { ConflictError, NotFoundError } from "../../../errors/AppError.js";

const subjectSelect = {
  id: true,
  nome: true,
  ativa: true,
  professorId: true,
  createdAt: true,
  updatedAt: true,
  professor: {
    select: {
      id: true,
      nome: true,
      email: true,
    },
  },
};

async function ensureProfessorExists(professorId) {
  const professor = await prisma.user.findUnique({
    where: { id: professorId },
    select: { id: true },
  });

  if (!professor) {
    throw new NotFoundError(
      `Professor com ID ${professorId} não encontrado`,
    );
  }
}

export async function getAllSubjects() {
  return prisma.subject.findMany({
    select: subjectSelect,
    orderBy: { id: "asc" },
  });
}

export async function getSubjectById(subjectId) {
  const id = Number(subjectId);

  const subject = await prisma.subject.findUnique({
    where: { id },
    select: subjectSelect,
  });

  if (!subject) {
    throw new NotFoundError(
      `Matéria com ID ${subjectId} não encontrada`,
    );
  }

  return subject;
}

export async function createSubject(data) {
  await ensureProfessorExists(data.professorId);

  return prisma.subject.create({
    data: {
      nome: data.nome,
      professorId: data.professorId,
      ativa: data.ativa ?? true,
    },
    select: subjectSelect,
  });
}

export async function updateSubject(subjectId, data) {
  const id = Number(subjectId);

  const existing = await prisma.subject.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError(
      `Matéria com ID ${subjectId} não encontrada`,
    );
  }

  if (data.professorId !== undefined) {
    await ensureProfessorExists(data.professorId);
  }

  return prisma.subject.update({
    where: { id },
    data,
    select: subjectSelect,
  });
}

export async function deleteSubject(subjectId) {
  const id = Number(subjectId);

  const subject = await prisma.subject.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: { questions: true },
      },
    },
  });

  if (!subject) {
    throw new NotFoundError(
      `Matéria com ID ${subjectId} não encontrada`,
    );
  }

  if (subject._count.questions > 0) {
    throw new ConflictError(
      "Não é possível remover uma matéria que possui questões vinculadas",
    );
  }

  return prisma.subject.delete({
    where: { id },
    select: subjectSelect,
  });
}
