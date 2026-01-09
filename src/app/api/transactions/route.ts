import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getTransactions, createTransaction } from "@/services/transactionService"
import { createTransactionSchema } from "@/lib/validations"
import { TransactionType } from "@prisma/client"

// GET /api/transactions - List transactions with optional filters
// Query params: ?type=EXPENSE&categoryId=xxx&startDate=2024-01-01&endDate=2024-12-31
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    const filters: any = {}

    const type = searchParams.get("type")
    if (type) {
      filters.type = type as TransactionType
    }

    const categoryId = searchParams.get("categoryId")
    if (categoryId) {
      filters.categoryId = categoryId
    }

    const investmentProjectId = searchParams.get("investmentProjectId")
    if (investmentProjectId) {
      filters.investmentProjectId = investmentProjectId
    }

    const startDate = searchParams.get("startDate")
    if (startDate) {
      filters.startDate = new Date(startDate)
    }

    const endDate = searchParams.get("endDate")
    if (endDate) {
      filters.endDate = new Date(endDate)
    }

    const transactions = await getTransactions(session.user.id, filters)

    return NextResponse.json({ success: true, data: transactions })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Create new transaction
// Body: { date, type: "EXPENSE", categoryId, amount, note?, investmentProjectId? }
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTransactionSchema.parse(body)

    const transaction = await createTransaction(session.user.id, validatedData)

    return NextResponse.json({ success: true, data: transaction }, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to create transaction" },
      { status: 500 }
    )
  }
}
