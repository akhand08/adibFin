import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Plus } from "lucide-react"
import { getMonthlyReport } from "@/services/reportService"
import { getInvestments } from "@/services/investmentService"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Fetch real data
  const currentDate = new Date()
  const monthlyData = await getMonthlyReport(
    session.user.id,
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  )
  const openInvestments = await getInvestments(session.user.id, "OPEN")

  const stats = {
    totalIncome: monthlyData.summary.totalIncome,
    totalExpense: monthlyData.summary.totalExpense,
    netSavings: monthlyData.summary.netSavings,
    activeInvestments: openInvestments.length,
  }

  return (
    <DashboardLayout userName={session.user?.name ?? undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, {session.user?.name}
            </p>
          </div>

          <Link href="/dashboard/transactions/new">
            <Button className="w-full sm:w-auto h-11 min-h-[44px]">
              <Plus className="h-5 w-5 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Income */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Income
              </CardTitle>
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ৳{stats.totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          {/* Total Expense */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Expense
              </CardTitle>
              <ArrowDownCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ৳{stats.totalExpense.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          {/* Net Savings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Net Savings
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ৳{stats.netSavings.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          {/* Active Investments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Investments
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.activeInvestments}
              </div>
              <p className="text-xs text-gray-500 mt-1">Currently open</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Mobile friendly buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/dashboard/transactions/new" className="w-full">
                <Button variant="outline" className="w-full h-11 min-h-[44px]">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Transaction
                </Button>
              </Link>

              <Link href="/dashboard/investments/new" className="w-full">
                <Button variant="outline" className="w-full h-11 min-h-[44px]">
                  <Plus className="h-5 w-5 mr-2" />
                  New Investment
                </Button>
              </Link>

              <Link href="/dashboard/reports" className="w-full">
                <Button variant="outline" className="w-full h-11 min-h-[44px]">
                  View Reports
                </Button>
              </Link>

              <Link href="/dashboard/categories" className="w-full">
                <Button variant="outline" className="w-full h-11 min-h-[44px]">
                  Manage Categories
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle>Recent Transactions</CardTitle>
              <Link href="/dashboard/transactions">
                <Button variant="ghost" size="sm" className="h-9">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <p>No transactions yet</p>
              <p className="text-sm mt-2">
                Start by adding your first transaction
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
