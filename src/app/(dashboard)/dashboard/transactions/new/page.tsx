import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TransactionForm } from "@/components/transactions/TransactionForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewTransactionPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout userName={session.user?.name ?? undefined}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Add Transaction
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Record a new income or expense
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
