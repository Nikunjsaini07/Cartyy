import { PrismaClient } from "@prisma/client";
import { config } from "../config.js";

const databaseUrl = new URL(config.DATABASE_URL);

if (!databaseUrl.searchParams.has("connection_limit")) {
  databaseUrl.searchParams.set("connection_limit", "3");
}

if (!databaseUrl.searchParams.has("pool_timeout")) {
  databaseUrl.searchParams.set("pool_timeout", "20");
}

if (!databaseUrl.searchParams.has("connect_timeout")) {
  databaseUrl.searchParams.set("connect_timeout", "15");
}

export const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl.toString() } },
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
