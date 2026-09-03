import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { serializeDecimals } from "../utils/serialize.js";

export const productsRouter = Router();

productsRouter.get("/", async (_request, response, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
      include: {
        variants: {
          orderBy: [{ isDefault: "desc" }, { sellingPrice: "asc" }],
          include: { emiPlans: { orderBy: { tenureMonths: "asc" } } },
        },
      },
    });
    response.json({ data: serializeDecimals(products) });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:slug", async (request, response, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: request.params.slug },
      include: {
        variants: {
          orderBy: [{ isDefault: "desc" }, { sellingPrice: "asc" }],
          include: { emiPlans: { orderBy: { tenureMonths: "asc" } } },
        },
      },
    });

    if (!product) {
      response.status(404).json({ error: { message: "Product not found" } });
      return;
    }

    response.json({ data: serializeDecimals(product) });
  } catch (error) {
    next(error);
  }
});
