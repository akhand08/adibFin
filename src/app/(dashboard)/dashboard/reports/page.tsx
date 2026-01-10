import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ReportView } from "@/components/reports/ReportView"

export default async function ReportsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout userName={session.user?.name ?? undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Reports
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            View your financial insights and analytics
          </p>
        </div>

        {/* Report View */}
        <ReportView />
      </div>
    </DashboardLayout>
  )
}
