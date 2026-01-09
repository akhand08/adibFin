import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getDateRangeReport } from "@/services/reportService"

// GET /api/reports/date-range?startDate=2024-01-01&endDate=2024-12-31
// Returns custom date range report with income/expense breakdown
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDateStr = searchParams.get("startDate")
    const endDateStr = searchParams.get("endDate")

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "Both startDate and endDate are required (format: YYYY-MM-DD)" },
        { status: 400 }
      )
    }

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      )
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { error: "startDate must be before endDate" },
        { status: 400 }
      )
    }

    const report = await getDateRangeReport(session.user.id, startDate, endDate)

    return NextResponse.json({ success: true, data: report })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate date range report" },
      { status: 500 }
    )
  }
}
