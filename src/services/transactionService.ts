import { prisma } from "@/lib/db"
import { TransactionType } from "@prisma/client"
import type { CreateTransactionInput, UpdateTransactionInput } from "@/lib/validations"

export async function getTransactions(
  userId: string,
  filters?: {
    type?: TransactionType
    categoryId?: string
    investmentProjectId?: string
    startDate?: Date
    endDate?: Date
  }
) {
  const where: any = { userId }

  if (filters?.type) {
    where.type = filters.type
  }

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId
  }

  if (filters?.investmentProjectId) {
    where.investmentProjectId = filters.investmentProjectId
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {}
    if (filters.startDate) {
      where.date.gte = filters.startDate
    }
    if (filters.endDate) {
      where.date.lte = filters.endDate
    }
  }

  return await prisma.transaction.findMany({
    where,
    include: {
      category: true,
      investmentProject: true,
      cashflow: true,
    },
    orderBy: {
      date: "desc",
    },
  })
}

export async function getTransactionById(transactionId: string, userId: string) {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
    include: {
      category: true,
      investmentProject: true,
      cashflow: true,
    },
  })

  if (!transaction) {
    throw new Error("Transaction not found")
  }

  return transaction
}

export async function createTransaction(
  userId: string,
  data: CreateTransactionInput
) {
  const { categoryId, ...rest } = data

  // Verify category exists and belongs to user or is system
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [
        { userId },
        { isSystem: true },
      ],
    },
  })

  if (!category) {
    throw new Error("Category not found")
  }

  // Verify investment project if provided
  if (data.investmentProjectId) {
    const project = await prisma.investmentProject.findFirst({
      where: { id: data.investmentProjectId, userId },
    })

    if (!project) {
      throw new Error("Investment project not found")
    }
  }

  return await prisma.transaction.create({
    data: {
      ...rest,
      userId,
      categoryId,
      date: data.date ? new Date(data.date) : new Date(),
    },
    include: {
      category: true,
      investmentProject: true,
    },
  })
}

export async function updateTransaction(
  transactionId: string,
  userId: string,
  data: UpdateTransactionInput
) {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  })

  if (!transaction) {
    throw new Error("Transaction not found")
  }

  // Check if transaction is part of investment cashflow
  const cashflow = await prisma.investmentCashflow.findUnique({
    where: { transactionId },
  })

  if (cashflow) {
    throw new Error("Cannot edit transactions that are part of investment cashflows. Manage through investment instead.")
  }

  // Verify category if provided
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        OR: [
          { userId },
          { isSystem: true },
        ],
      },
    })

    if (!category) {
      throw new Error("Category not found")
    }
  }

  return await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
    include: {
      category: true,
      investmentProject: true,
    },
  })
}

export async function deleteTransaction(transactionId: string, userId: string) {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  })

  if (!transaction) {
    throw new Error("Transaction not found")
  }

  // Check if transaction is part of investment cashflow
  const cashflow = await prisma.investmentCashflow.findUnique({
    where: { transactionId },
  })

  if (cashflow) {
    throw new Error("Cannot delete transactions that are part of investment cashflows. Manage through investment instead.")
  }

  return await prisma.transaction.delete({
    where: { id: transactionId },
  })
}
