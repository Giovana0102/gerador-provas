import express from "express";

import prisma from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

const app = express();

app.use(express.json());

/**
 * Verifica se a API e o banco de dados estão funcionando.
 */
app.get("/health", async (req, res) => {
  let databaseStatus = "OK";
  let databaseMessage = "Conexão com banco de dados funcionando";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    databaseStatus = "ERROR";
    databaseMessage = "Falha na conexão com banco de dados";
    console.error("Erro na verificação do banco:", error);
  }

  const httpStatus = databaseStatus === "OK" ? 200 : 503;

  res.status(httpStatus).json({
    status: databaseStatus === "OK" ? "OK" : "DEGRADED",
    message: "API do Gerador de Provas",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      api: "OK",
      database: {
        status: databaseStatus,
        message: databaseMessage,
      },
    },
  });
});

// Rotas da API
app.use("/users", userRoutes);
app.use("/subjects", subjectRoutes);
app.use("/questions", questionRoutes);

/**
 * Trata requisições que não correspondem a nenhuma rota.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
  });
});

export default app;