import { prisma } from "@/lib/db"
import { TransactionType } from "@prisma/client"

export async function getCategoriesByUser(userId: string, type?: TransactionType) {
  const where: any = { userId }

  if (type) {
    where.type = type
  }

  return await prisma.category.findMany({
    where,
    orderBy: {
      name: "asc",
    },
  })
}

export async function createCategory(
  userId: string,
  data: { name: string; type: TransactionType }
) {
  return await prisma.category.create({
    data: {
      ...data,
      userId,
      isSystem: false,
    },
  })
}

export async function deleteCategory(categoryId: string, userId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  })

  if (!category) {
    throw new Error("Category not found")
  }

  const transactionCount = await prisma.transaction.count({
    where: { categoryId },
  })

  if (transactionCount > 0) {
    throw new Error("Cannot delete category with existing transactions")
  }

  return await prisma.category.delete({
    where: { id: categoryId },
  })
}
