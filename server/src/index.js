import { app } from "./app.js";
import { config } from "./config.js";
import { prisma } from "./lib/prisma.js";

const server = app.listen(config.PORT, () => {
  console.log(`Cartyy API listening on http://localhost:${config.PORT}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
