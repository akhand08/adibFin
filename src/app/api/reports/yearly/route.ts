import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getYearlyReport } from "@/services/reportService"

// GET /api/reports/yearly?year=2024
// Returns yearly report with month-by-month breakdown and category totals
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get("year") || "")

    if (!year) {
      return NextResponse.json(
        { error: "Valid year is required" },
        { status: 400 }
      )
    }

    const report = await getYearlyReport(session.user.id, year)

    return NextResponse.json({ success: true, data: report })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate yearly report" },
      { status: 500 }
    )
  }
}
