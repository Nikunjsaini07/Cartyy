import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import { prisma } from "./lib/prisma.js";
import { productsRouter } from "./routes/products.js";

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: config.CLIENT_URL }));
app.use(express.json({ limit: "100kb" }));
app.use(morgan(config.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", async (_request, response, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/products", productsRouter);

app.use((_request, response) => {
  response.status(404).json({ error: { message: "Route not found" } });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response
    .status(500)
    .json({
      error: { message: "Something went wrong while loading the catalogue." },
    });
});
