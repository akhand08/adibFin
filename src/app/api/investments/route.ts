import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getInvestments, createInvestment } from "@/services/investmentService"
import { createInvestmentSchema } from "@/lib/validations"
import { ProjectStatus } from "@prisma/client"

// GET /api/investments - List investments
// Query param: ?status=OPEN or ?status=CLOSED
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as ProjectStatus | null

    const investments = await getInvestments(session.user.id, status || undefined)

    return NextResponse.json({ success: true, data: investments })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch investments" },
      { status: 500 }
    )
  }
}

// POST /api/investments - Create new investment
// Body: { name, description?, amount, categoryId, startDate? }
// Creates: project + expense transaction + cashflow (INVEST_PRINCIPAL)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createInvestmentSchema.parse(body)

    const investment = await createInvestment(session.user.id, validatedData)

    return NextResponse.json({ success: true, data: investment }, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to create investment" },
      { status: 500 }
    )
  }
}
