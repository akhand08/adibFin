import { prisma } from "@/lib/db"
import { TransactionType, FlowType } from "@prisma/client"

// =====================
// MONTHLY REPORT
// =====================

export async function getMonthlyReport(userId: string, year: number, month: number) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      category: true,
    },
  })

  // Group by category and type
  const expenses = transactions.filter((t) => t.type === TransactionType.EXPENSE)
  const incomes = transactions.filter((t) => t.type === TransactionType.INCOME)

  const expenseByCategory = expenses.reduce((acc, t) => {
    const categoryName = t.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = 0
    }
    acc[categoryName] += t.amount
    return acc
  }, {} as Record<string, number>)

  const incomeByCategory = incomes.reduce((acc, t) => {
    const categoryName = t.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = 0
    }
    acc[categoryName] += t.amount
    return acc
  }, {} as Record<string, number>)

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)
  const netSavings = totalIncome - totalExpense

  return {
    period: { year, month, startDate, endDate },
    summary: {
      totalIncome,
      totalExpense,
      netSavings,
    },
    expenseByCategory,
    incomeByCategory,
    transactions: {
      expenses,
      incomes,
    },
  }
}

// =====================
// YEARLY REPORT
// =====================

export async function getYearlyReport(userId: string, year: number) {
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      category: true,
    },
  })

  // Group by month
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthTransactions = transactions.filter(
      (t) => t.date.getMonth() === i
    )

    const expenses = monthTransactions.filter(
      (t) => t.type === TransactionType.EXPENSE
    )
    const incomes = monthTransactions.filter(
      (t) => t.type === TransactionType.INCOME
    )

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)

    return {
      month: i + 1,
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
    }
  })

  // Category breakdown for entire year
  const expenses = transactions.filter((t) => t.type === TransactionType.EXPENSE)
  const incomes = transactions.filter((t) => t.type === TransactionType.INCOME)

  const expenseByCategory = expenses.reduce((acc, t) => {
    const categoryName = t.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = 0
    }
    acc[categoryName] += t.amount
    return acc
  }, {} as Record<string, number>)

  const incomeByCategory = incomes.reduce((acc, t) => {
    const categoryName = t.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = 0
    }
    acc[categoryName] += t.amount
    return acc
  }, {} as Record<string, number>)

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)

  return {
    year,
    summary: {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
    },
    monthlyData,
    expenseByCategory,
    incomeByCategory,
  }
}

// =====================
// INVESTMENT REPORT
// =====================

export async function getInvestmentReport(userId: string) {
  const investments = await prisma.investmentProject.findMany({
    where: { userId },
    include: {
      cashflows: {
        include: {
          transaction: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  })

  const investmentSummaries = investments.map((inv) => {
    const principal = inv.cashflows
      .filter((cf) => cf.flowType === FlowType.INVEST_PRINCIPAL)
      .reduce((sum, cf) => sum + cf.amount, 0)

    const capitalReturned = inv.cashflows
      .filter((cf) => cf.flowType === FlowType.RETURN_OF_CAPITAL)
      .reduce((sum, cf) => sum + cf.amount, 0)

    const profit = inv.cashflows
      .filter((cf) => cf.flowType === FlowType.PROFIT)
      .reduce((sum, cf) => sum + cf.amount, 0)

    const loss = inv.cashflows
      .filter((cf) => cf.flowType === FlowType.LOSS)
      .reduce((sum, cf) => sum + cf.amount, 0)

    const netProfit = profit - loss
    const roi = principal > 0 ? (netProfit / principal) * 100 : 0

    // Calculate duration
    const startDate = inv.startDate
    const endDate = inv.closedDate || new Date()
    const durationDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      id: inv.id,
      name: inv.name,
      description: inv.description,
      status: inv.status,
      startDate,
      closedDate: inv.closedDate,
      durationDays,
      principal,
      capitalReturned,
      capitalOutstanding: principal - capitalReturned,
      profit,
      loss,
      netProfit,
      roi,
      totalReturn: capitalReturned + netProfit,
    }
  })

  const totalPrincipal = investmentSummaries.reduce(
    (sum, inv) => sum + inv.principal,
    0
  )
  const totalCapitalReturned = investmentSummaries.reduce(
    (sum, inv) => sum + inv.capitalReturned,
    0
  )
  const totalNetProfit = investmentSummaries.reduce(
    (sum, inv) => sum + inv.netProfit,
    0
  )
  const overallROI = totalPrincipal > 0 ? (totalNetProfit / totalPrincipal) * 100 : 0

  return {
    summary: {
      totalInvestments: investments.length,
      openInvestments: investments.filter((inv) => inv.status === "OPEN").length,
      closedInvestments: investments.filter((inv) => inv.status === "CLOSED").length,
      totalPrincipal,
      totalCapitalReturned,
      totalCapitalOutstanding: totalPrincipal - totalCapitalReturned,
      totalNetProfit,
      overallROI,
    },
    investments: investmentSummaries,
  }
}

// =====================
// DATE RANGE REPORT
// =====================

export async function getDateRangeReport(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  })

  const expenses = transactions.filter((t) => t.type === TransactionType.EXPENSE)
  const incomes = transactions.filter((t) => t.type === TransactionType.INCOME)

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)

  const expenseByCategory = expenses.reduce((acc, t) => {
    const categoryName = t.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = 0
    }
    acc[categoryName] += t.amount
    return acc
  }, {} as Record<string, number>)

  const incomeByCategory = incomes.reduce((acc, t) => {
    const categoryName = t.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = 0
    }
    acc[categoryName] += t.amount
    return acc
  }, {} as Record<string, number>)

  return {
    period: { startDate, endDate },
    summary: {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      transactionCount: transactions.length,
    },
    expenseByCategory,
    incomeByCategory,
    transactions: {
      expenses,
      incomes,
    },
  }
}
