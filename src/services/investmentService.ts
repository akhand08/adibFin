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

  // Verify category exists and belongs to user
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
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
  const { totalReturned, categoryId, date } = data

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

  // Calculate total invested and already returned capital
  const totalInvested = investment.cashflows
    .filter((cf) => cf.flowType === FlowType.INVEST_PRINCIPAL)
    .reduce((sum, cf) => sum + cf.amount, 0)

  const alreadyReturnedCapital = investment.cashflows
    .filter((cf) => cf.flowType === FlowType.RETURN_OF_CAPITAL)
    .reduce((sum, cf) => sum + cf.amount, 0)

  // Calculate capital and profit/loss
  const remainingCapital = totalInvested - alreadyReturnedCapital
  const capitalReturned = Math.min(totalReturned, remainingCapital)
  const profitOrLoss = totalReturned - capitalReturned

  // Check if return exceeds expected total
  if (capitalReturned > remainingCapital) {
    throw new Error(
      `Invalid return amount. Total invested: ${totalInvested}, Already returned: ${alreadyReturnedCapital}, Remaining: ${remainingCapital}`
    )
  }

  // Verify category exists and belongs to user
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
  })

  if (!category) {
    throw new Error("Category not found")
  }

  const returnDate = date ? new Date(date) : new Date()
  const shouldClose = alreadyReturnedCapital + capitalReturned === totalInvested

  // Create return transactions and cashflows
  return await prisma.$transaction(async (tx) => {
    // Create transaction for capital return
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
    }

    // Create transaction for profit or loss
    if (profitOrLoss !== 0) {
      const profitLossTransaction = await tx.transaction.create({
        data: {
          userId,
          date: returnDate,
          type: TransactionType.INCOME,
          categoryId,
          amount: Math.abs(profitOrLoss),
          investmentProjectId: investmentId,
          note: profitOrLoss > 0
            ? `Profit from ${investment.name}`
            : `Loss from ${investment.name}`,
        },
      })

      await tx.investmentCashflow.create({
        data: {
          projectId: investmentId,
          transactionId: profitLossTransaction.id,
          flowType: profitOrLoss > 0 ? FlowType.PROFIT : FlowType.LOSS,
          amount: Math.abs(profitOrLoss),
        },
      })
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
