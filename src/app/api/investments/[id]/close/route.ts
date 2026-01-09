import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { closeInvestment } from "@/services/investmentService"

// POST /api/investments/[id]/close - Manually close investment
// Validates that all capital has been returned before closing
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const investment = await closeInvestment(params.id, session.user.id)

    return NextResponse.json({ success: true, data: investment })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to close investment" },
      { status: 500 }
    )
  }
}
