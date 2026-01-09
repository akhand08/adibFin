"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  type: "EXPENSE" | "INCOME"
}

export function CategoryList() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || "Failed to delete category")
        return
      }

      await fetchCategories()
      router.refresh()
    } catch (error) {
      alert("Failed to delete category")
    }
  }

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE")
  const incomeCategories = categories.filter((c) => c.type === "INCOME")

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-red-600" />
            <CardTitle>Expense Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {expenseCategories.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No expense categories yet
            </p>
          ) : (
            <div className="space-y-2">
              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="destructive" className="text-xs">
                      Expense
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => handleDelete(category.id, category.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Income Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-600" />
            <CardTitle>Income Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {incomeCategories.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No income categories yet
            </p>
          ) : (
            <div className="space-y-2">
              {incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="default" className="text-xs bg-green-600">
                      Income
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => handleDelete(category.id, category.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
