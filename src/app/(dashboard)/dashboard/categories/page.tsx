import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { CategoryList } from "@/components/categories/CategoryList"
import { AddCategoryDialog } from "@/components/categories/AddCategoryDialog"

export default async function CategoriesPage() {
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
              Categories
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your income and expense categories
            </p>
          </div>

          <AddCategoryDialog />
        </div>

        {/* Category List */}
        <CategoryList />
      </div>
    </DashboardLayout>
  )
}
