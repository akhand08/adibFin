import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TransactionList } from "@/components/transactions/TransactionList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function TransactionsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout userName={session.user?.name ?? undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Transactions
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Track all your income and expenses
            </p>
          </div>

          <Link href="/dashboard/transactions/new">
            <Button className="w-full sm:w-auto h-11 min-h-[44px]">
              <Plus className="h-5 w-5 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* Transaction List with filters */}
        <TransactionList />
      </div>
    </DashboardLayout>
  )
}
