import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { addReturn } from "@/services/investmentService"
import { addReturnSchema } from "@/lib/validations"

// POST /api/investments/[id]/returns - Add return (capital + profit)
// Body: { capitalReturned, profit, categoryId, date? }
// Creates: income transaction(s) + cashflow(s), auto-closes if capital fully returned
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = addReturnSchema.parse(body)

    const investment = await addReturn(params.id, session.user.id, validatedData)

    return NextResponse.json({ success: true, data: investment })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to add return" },
      { status: 500 }
    )
  }
}
