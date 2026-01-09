import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getInvestmentReport } from "@/services/reportService"

// GET /api/reports/investments
// Returns all investments with ROI, profit/loss, duration, capital status
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const report = await getInvestmentReport(session.user.id)

    return NextResponse.json({ success: true, data: report })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate investment report" },
      { status: 500 }
    )
  }
}
