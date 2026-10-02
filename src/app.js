import express from "express";

import prisma from "./config/database.js";

import v1Routes from "./api/v1/routes/index.js";

import errorHandler, { notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json({ limit: "100kb" }));

/**
 * Verifica se a API e o banco de dados estão funcionando.
 */
app.get("/health", async (_req, res) => {
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
    availableVersions: ["v1"],
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
app.use("/v1", v1Routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
