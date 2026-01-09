"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
  type: string
}

export function TransactionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    type: "EXPENSE" as "EXPENSE" | "INCOME",
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [formData.type])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/categories?type=${formData.type}`)
      if (res.ok) {
        const data = await res.json()
        setCategories(data.data || [])
        setFormData((prev) => ({ ...prev, categoryId: "" }))
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || "Failed to create transaction")
        return
      }

      router.push("/dashboard/transactions")
      router.refresh()
    } catch (error) {
      alert("Failed to create transaction")
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((c) => c.type === formData.type)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "EXPENSE" | "INCOME") =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (৳)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          className="h-12 text-lg"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) =>
            setFormData({ ...formData, categoryId: value })
          }
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                No categories available. Create one first.
              </div>
            ) : (
              filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="h-12 text-base"
        />
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Note (Optional)</Label>
        <Textarea
          id="note"
          placeholder="Add a note..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          rows={3}
          className="text-base resize-none"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="h-12 flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.categoryId}
          className="h-12 flex-1"
        >
          {loading ? "Creating..." : "Create Transaction"}
        </Button>
      </div>
    </form>
  )
}
