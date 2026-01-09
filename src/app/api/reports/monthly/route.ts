import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getMonthlyReport } from "@/services/reportService"

// GET /api/reports/monthly?year=2024&month=1
// Returns monthly income/expense by category, totals, net savings
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get("year") || "")
    const month = parseInt(searchParams.get("month") || "")

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Valid year and month (1-12) are required" },
        { status: 400 }
      )
    }

    const report = await getMonthlyReport(session.user.id, year, month)

    return NextResponse.json({ success: true, data: report })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate monthly report" },
      { status: 500 }
    )
  }
}
