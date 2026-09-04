import express from "express";
import prisma from "./config/database.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando",
  });
});

app.get("/subjects", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      select: {
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
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: subjects,
      total: subjects.length,
    });
  } catch (error) {
    console.error("Erro ao buscar matérias:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar matérias",
    });
  }
});

app.get("/questions", async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      select: {
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
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: questions,
      total: questions.length,
    });
  } catch (error) {
    console.error("Erro ao buscar questões:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar questões",
    });
  }
});

export default app;