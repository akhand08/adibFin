import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "@/services/transactionService"
import { updateTransactionSchema } from "@/lib/validations"

// GET /api/transactions/[id] - Get single transaction
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transaction = await getTransactionById(params.id, session.user.id)

    return NextResponse.json({ success: true, data: transaction })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch transaction" },
      { status: 500 }
    )
  }
}

// PUT /api/transactions/[id] - Update transaction
// Blocks if transaction is part of investment cashflow
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateTransactionSchema.parse(body)

    const transaction = await updateTransaction(
      params.id,
      session.user.id,
      validatedData
    )

    return NextResponse.json({ success: true, data: transaction })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to update transaction" },
      { status: 500 }
    )
  }
}

// DELETE /api/transactions/[id] - Delete transaction
// Blocks if transaction is part of investment cashflow
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteTransaction(params.id, session.user.id)

    return NextResponse.json({ success: true, message: "Transaction deleted" })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete transaction" },
      { status: 500 }
    )
  }
}
