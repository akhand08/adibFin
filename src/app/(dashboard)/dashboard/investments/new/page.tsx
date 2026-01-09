import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { InvestmentForm } from "@/components/investments/InvestmentForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewInvestmentPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout userName={session.user?.name}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            New Investment
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Start tracking a new investment project
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <InvestmentForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
