import prisma from "../config/database.js";

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
      !enunciado ||
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

    // Converte os IDs e dificuldade para números
    const idSubject = Number(subjectId);
    const idAuthor = Number(authorId);
    const nivelDificuldade = Number(dificuldade);

    // Valida os IDs
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

    // Valida a dificuldade
    if (![1, 2, 3].includes(nivelDificuldade)) {
      return res.status(400).json({
        success: false,
        message: "Dificuldade deve ser 1, 2 ou 3",
      });
    }

    // Verifica se a matéria existe
    const materia = await prisma.subject.findUnique({
      where: {
        id: idSubject,
      },
    });

    if (!materia) {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    // Verifica se o autor existe
    const autor = await prisma.user.findUnique({
      where: {
        id: idAuthor,
      },
    });

    if (!autor) {
      return res.status(404).json({
        success: false,
        message: "Autor não encontrado",
      });
    }

    // Cria a questão
    const novaQuestao = await prisma.question.create({
      data: {
        enunciado,
        dificuldade: nivelDificuldade,
        respostaCorreta: respostaCorreta || null,
        subjectId: idSubject,
        authorId: idAuthor,
        ativa: ativa ?? true,
      },
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
    });

    return res.status(201).json({
      success: true,
      message: "Questão criada com sucesso",
      data: novaQuestao,
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
    const questoes = await prisma.question.findMany({
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
        createdAt: "desc",
      },
    });

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

    const questao = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
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
    });

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