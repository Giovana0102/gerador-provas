import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

let professorId;
let subjectId;
let questionId;

describe("Subjects", () => {
  it("deve criar uma matéria", async () => {
    const professor = await prisma.user.create({
      data: {
        nome: "Professor Teste",
        email: `professor-${Date.now()}@teste.com`,
      },
    });

    professorId = professor.id;

    const response = await request(app).post("/subjects").send({
      nome: "Matemática Teste",
      professorId: professor.id,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.nome).toBe("Matemática Teste");
    expect(response.body.data.ativa).toBe(true);
    expect(response.body.data.professor.id).toBe(professor.id);

    subjectId = response.body.data.id;
  });

  it("deve listar as matérias", async () => {
    const response = await request(app).get("/subjects");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.total).toBeGreaterThan(0);
  });

  it("deve buscar uma matéria pelo ID", async () => {
    const response = await request(app).get(`/subjects/${subjectId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(subjectId);
  });

  it("deve atualizar parcialmente uma matéria", async () => {
    const response = await request(app).patch(`/subjects/${subjectId}`).send({
      nome: "Matemática Atualizada",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.nome).toBe("Matemática Atualizada");
    expect(response.body.data.ativa).toBe(true);
    expect(response.body.data.professor.id).toBe(professorId);
  });

  it("deve rejeitar ID inválido ao buscar uma matéria", async () => {
    const response = await request(app).get("/subjects/abc");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar nome inválido ao criar uma matéria", async () => {
    const response = await request(app).post("/subjects").send({
      nome: "",
      professorId,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar ativa inválida ao criar uma matéria", async () => {
    const response = await request(app).post("/subjects").send({
      nome: "Matéria Inválida",
      professorId,
      ativa: "sim",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar professorId inválido", async () => {
    const response = await request(app).post("/subjects").send({
      nome: "Matéria Inválida",
      professorId: "abc",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve retornar 404 para professor inexistente", async () => {
    const response = await request(app).post("/subjects").send({
      nome: "Matéria com Professor Inexistente",
      professorId: 999999,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar PATCH sem campos para atualizar", async () => {
    const response = await request(app)
      .patch(`/subjects/${subjectId}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve retornar 404 ao atualizar matéria inexistente", async () => {
    const response = await request(app).patch("/subjects/999999").send({
      nome: "Matéria Inexistente",
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve retornar 404 ao atualizar com professor inexistente", async () => {
    const response = await request(app).patch(`/subjects/${subjectId}`).send({
      professorId: 999999,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("não deve excluir uma matéria que possui questões", async () => {
    const question = await prisma.question.create({
      data: {
        enunciado: "Questão para testar exclusão",
        dificuldade: 1,
        respostaCorreta: "Resposta",
        subjectId,
        authorId: professorId,
      },
    });

    const response = await request(app).delete(`/subjects/${subjectId}`);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);

    await prisma.question.delete({
      where: {
        id: question.id,
      },
    });
  });

  it("deve rejeitar ID inválido ao excluir uma matéria", async () => {
    const response = await request(app).delete("/subjects/abc");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe("Questions", () => {
  it("deve criar uma questão", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Quanto é 2 + 2?",
      dificuldade: 1,
      respostaCorreta: "4",
      subjectId,
      authorId: professorId,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.enunciado).toBe("Quanto é 2 + 2?");
    expect(response.body.data.dificuldade).toBe(1);
    expect(response.body.data.respostaCorreta).toBe("4");
    expect(response.body.data.subject.id).toBe(subjectId);
    expect(response.body.data.author.id).toBe(professorId);

    questionId = response.body.data.id;
  });

  it("deve listar as questões", async () => {
    const response = await request(app).get("/questions");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.total).toBeGreaterThan(0);
  });

  it("deve buscar uma questão pelo ID", async () => {
    const response = await request(app).get(`/questions/${questionId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(questionId);
  });

  it("deve atualizar parcialmente uma questão", async () => {
    const response = await request(app).patch(`/questions/${questionId}`).send({
      enunciado: "Quanto é 3 + 3?",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.enunciado).toBe("Quanto é 3 + 3?");
    expect(response.body.data.dificuldade).toBe(1);
    expect(response.body.data.respostaCorreta).toBe("4");
    expect(response.body.data.subject.id).toBe(subjectId);
    expect(response.body.data.author.id).toBe(professorId);
  });

  it("deve rejeitar ID inválido ao buscar uma questão", async () => {
    const response = await request(app).get("/questions/abc");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar enunciado vazio ao criar uma questão", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "",
      dificuldade: 1,
      subjectId,
      authorId: professorId,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar dificuldade inválida", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Questão com dificuldade inválida",
      dificuldade: 4,
      subjectId,
      authorId: professorId,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar subjectId inválido", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Questão com matéria inválida",
      dificuldade: 1,
      subjectId: "abc",
      authorId: professorId,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar authorId inválido", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Questão com autor inválido",
      dificuldade: 1,
      subjectId,
      authorId: "abc",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve retornar 404 para matéria inexistente", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Questão com matéria inexistente",
      dificuldade: 1,
      subjectId: 999999,
      authorId: professorId,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve retornar 404 para autor inexistente", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Questão com autor inexistente",
      dificuldade: 1,
      subjectId,
      authorId: 999999,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar PATCH sem campos para atualizar", async () => {
    const response = await request(app)
      .patch(`/questions/${questionId}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve retornar 404 ao atualizar questão inexistente", async () => {
    const response = await request(app).patch("/questions/999999").send({
      enunciado: "Questão Inexistente",
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve retornar 404 ao atualizar com matéria inexistente", async () => {
    const response = await request(app).patch(`/questions/${questionId}`).send({
      subjectId: 999999,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve retornar 404 ao atualizar com autor inexistente", async () => {
    const response = await request(app).patch(`/questions/${questionId}`).send({
      authorId: 999999,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar ID inválido ao excluir uma questão", async () => {
    const response = await request(app).delete("/questions/abc");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve excluir uma questão", async () => {
    const response = await request(app).delete(`/questions/${questionId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const getResponse = await request(app).get(`/questions/${questionId}`);

    expect(getResponse.status).toBe(404);
    expect(getResponse.body.success).toBe(false);
  });
});

describe("Finalização", () => {
  it("deve excluir a matéria", async () => {
    const response = await request(app).delete(`/subjects/${subjectId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const getResponse = await request(app).get(`/subjects/${subjectId}`);

    expect(getResponse.status).toBe(404);
    expect(getResponse.body.success).toBe(false);
  });
});

afterAll(async () => {
  if (questionId) {
    await prisma.question.deleteMany({
      where: {
        id: questionId,
      },
    });
  }

  if (subjectId) {
    await prisma.question.deleteMany({
      where: {
        subjectId,
      },
    });

    await prisma.subject.deleteMany({
      where: {
        id: subjectId,
      },
    });
  }

  if (professorId) {
    await prisma.user.deleteMany({
      where: {
        id: professorId,
      },
    });
  }
});
