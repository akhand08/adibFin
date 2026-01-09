import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import {
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
} from "@/services/investmentService"
import { updateInvestmentSchema } from "@/lib/validations"

// GET /api/investments/[id] - Get investment details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const investment = await getInvestmentById(params.id, session.user.id)

    return NextResponse.json({ success: true, data: investment })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch investment" },
      { status: 500 }
    )
  }
}

// PUT /api/investments/[id] - Update investment metadata
// Body: { name?, description?, status? }
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
    const validatedData = updateInvestmentSchema.parse(body)

    const investment = await updateInvestment(
      params.id,
      session.user.id,
      validatedData
    )

    return NextResponse.json({ success: true, data: investment })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to update investment" },
      { status: 500 }
    )
  }
}

// DELETE /api/investments/[id] - Delete investment
// Deletes: project + all transactions + all cashflows (cascade)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteInvestment(params.id, session.user.id)

    return NextResponse.json({ success: true, message: "Investment deleted" })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete investment" },
      { status: 500 }
    )
  }
}
