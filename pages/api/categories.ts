import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Category, CreateCategorySchema } from "@/types/Category";

const prisma = new PrismaClient();

async function createCategory(
  req: NextApiRequest,
  res: NextApiResponse<Category | ErrorResponse>
) {
  const createCategory = CreateCategorySchema.parse(req.body);
  const category = await prisma.category.create({
    data: {
      ...createCategory,
    },
  });

  res.status(201).json(category);
}

async function getCategories(
  req: NextApiRequest,
  res: NextApiResponse<Category[] | ErrorResponse>
) {
  const categories = await prisma.category.findMany();

  res.status(200).json(categories);
}

export default apiHandler({
  POST: withAdmin(createCategory),
  GET: getCategories,
});
