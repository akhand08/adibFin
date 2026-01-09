import { prisma } from "@/lib/db"
import { FlowType, ProjectStatus, TransactionType } from "@prisma/client"
import type { CreateInvestmentInput, AddReturnInput, UpdateInvestmentInput } from "@/lib/validations"

export async function getInvestments(userId: string, status?: ProjectStatus) {
  const where: any = { userId }

  if (status) {
    where.status = status
  }

  return await prisma.investmentProject.findMany({
    where,
    include: {
      transactions: {
        include: {
          category: true,
        },
      },
      cashflows: {
        include: {
          transaction: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  })
}

export async function getInvestmentById(investmentId: string, userId: string) {
  const investment = await prisma.investmentProject.findFirst({
    where: { id: investmentId, userId },
    include: {
      transactions: {
        include: {
          category: true,
        },
      },
      cashflows: {
        include: {
          transaction: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  if (!investment) {
    throw new Error("Investment not found")
  }

  return investment
}

export async function createInvestment(
  userId: string,
  data: CreateInvestmentInput
) {
  const { amount, categoryId, startDate, ...projectData } = data

  // Verify category exists
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

  // Create investment project, transaction, and cashflow in one transaction
  return await prisma.$transaction(async (tx) => {
    // Create investment project
    const project = await tx.investmentProject.create({
      data: {
        ...projectData,
        userId,
        startDate: startDate ? new Date(startDate) : new Date(),
        status: ProjectStatus.OPEN,
      },
    })

    // Create transaction (EXPENSE)
    const transaction = await tx.transaction.create({
      data: {
        userId,
        date: startDate ? new Date(startDate) : new Date(),
        type: TransactionType.EXPENSE,
        categoryId,
        amount,
        investmentProjectId: project.id,
        note: `Investment in ${projectData.name}`,
      },
    })

    // Create cashflow record (INVEST_PRINCIPAL)
    await tx.investmentCashflow.create({
      data: {
        projectId: project.id,
        transactionId: transaction.id,
        flowType: FlowType.INVEST_PRINCIPAL,
        amount,
      },
    })

    // Return full project with relations
    return await tx.investmentProject.findUnique({
      where: { id: project.id },
      include: {
        transactions: {
          include: {
            category: true,
          },
        },
        cashflows: {
          include: {
            transaction: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })
  })
}

export async function addReturn(
  investmentId: string,
  userId: string,
  data: AddReturnInput
) {
  const { capitalReturned, profit, categoryId, date } = data

  // Verify investment exists and is OPEN
  const investment = await prisma.investmentProject.findFirst({
    where: { id: investmentId, userId },
    include: {
      cashflows: true,
    },
  })

  if (!investment) {
    throw new Error("Investment not found")
  }

  if (investment.status === ProjectStatus.CLOSED) {
    throw new Error("Cannot add return to closed investment")
  }

  // Calculate total invested and total returned
  const totalInvested = investment.cashflows
    .filter((cf) => cf.flowType === FlowType.INVEST_PRINCIPAL)
    .reduce((sum, cf) => sum + cf.amount, 0)

  const totalReturned = investment.cashflows
    .filter((cf) => cf.flowType === FlowType.RETURN_OF_CAPITAL)
    .reduce((sum, cf) => sum + cf.amount, 0)

  const newTotalReturned = totalReturned + capitalReturned

  // Check if return exceeds investment
  if (newTotalReturned > totalInvested) {
    throw new Error(
      `Cannot return more capital than invested. Total invested: ${totalInvested}, Already returned: ${totalReturned}, Attempting to return: ${capitalReturned}`
    )
  }

  // Verify category
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

  const returnDate = date ? new Date(date) : new Date()
  const shouldClose = newTotalReturned === totalInvested

  // Create return transactions and cashflows
  return await prisma.$transaction(async (tx) => {
    const transactions = []

    // Create transaction for capital return if > 0
    if (capitalReturned > 0) {
      const capitalTransaction = await tx.transaction.create({
        data: {
          userId,
          date: returnDate,
          type: TransactionType.INCOME,
          categoryId,
          amount: capitalReturned,
          investmentProjectId: investmentId,
          note: `Capital return from ${investment.name}`,
        },
      })

      await tx.investmentCashflow.create({
        data: {
          projectId: investmentId,
          transactionId: capitalTransaction.id,
          flowType: FlowType.RETURN_OF_CAPITAL,
          amount: capitalReturned,
        },
      })

      transactions.push(capitalTransaction)
    }

    // Create transaction for profit if > 0
    if (profit > 0) {
      const profitTransaction = await tx.transaction.create({
        data: {
          userId,
          date: returnDate,
          type: TransactionType.INCOME,
          categoryId,
          amount: profit,
          investmentProjectId: investmentId,
          note: `Profit from ${investment.name}`,
        },
      })

      await tx.investmentCashflow.create({
        data: {
          projectId: investmentId,
          transactionId: profitTransaction.id,
          flowType: FlowType.PROFIT,
          amount: profit,
        },
      })

      transactions.push(profitTransaction)
    }

    // Close project if all capital returned
    if (shouldClose) {
      await tx.investmentProject.update({
        where: { id: investmentId },
        data: {
          status: ProjectStatus.CLOSED,
          closedDate: returnDate,
        },
      })
    }

    // Return updated investment
    return await tx.investmentProject.findUnique({
      where: { id: investmentId },
      include: {
        transactions: {
          include: {
            category: true,
          },
        },
        cashflows: {
          include: {
            transaction: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })
  })
}

export async function updateInvestment(
  investmentId: string,
  userId: string,
  data: UpdateInvestmentInput
) {
  const investment = await prisma.investmentProject.findFirst({
    where: { id: investmentId, userId },
  })

  if (!investment) {
    throw new Error("Investment not found")
  }

  return await prisma.investmentProject.update({
    where: { id: investmentId },
    data,
    include: {
      transactions: {
        include: {
          category: true,
        },
      },
      cashflows: {
        include: {
          transaction: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  })
}

export async function closeInvestment(investmentId: string, userId: string) {
  const investment = await prisma.investmentProject.findFirst({
    where: { id: investmentId, userId },
    include: {
      cashflows: true,
    },
  })

  if (!investment) {
    throw new Error("Investment not found")
  }

  if (investment.status === ProjectStatus.CLOSED) {
    throw new Error("Investment is already closed")
  }

  // Calculate total invested and total returned
  const totalInvested = investment.cashflows
    .filter((cf) => cf.flowType === FlowType.INVEST_PRINCIPAL)
    .reduce((sum, cf) => sum + cf.amount, 0)

  const totalReturned = investment.cashflows
    .filter((cf) => cf.flowType === FlowType.RETURN_OF_CAPITAL)
    .reduce((sum, cf) => sum + cf.amount, 0)

  if (totalReturned < totalInvested) {
    throw new Error(
      `Cannot close investment with unreturned capital. Total invested: ${totalInvested}, Total returned: ${totalReturned}`
    )
  }

  return await prisma.investmentProject.update({
    where: { id: investmentId },
    data: {
      status: ProjectStatus.CLOSED,
      closedDate: new Date(),
    },
    include: {
      transactions: {
        include: {
          category: true,
        },
      },
      cashflows: {
        include: {
          transaction: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  })
}

export async function deleteInvestment(investmentId: string, userId: string) {
  const investment = await prisma.investmentProject.findFirst({
    where: { id: investmentId, userId },
  })

  if (!investment) {
    throw new Error("Investment not found")
  }

  // Delete investment and all related records (cascade)
  return await prisma.investmentProject.delete({
    where: { id: investmentId },
  })
}
