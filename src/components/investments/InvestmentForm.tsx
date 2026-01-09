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
}

export function InvestmentForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    categoryId: "",
    startDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=EXPENSE")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || "Failed to create investment")
        return
      }

      router.push("/dashboard/investments")
      router.refresh()
    } catch (error) {
      alert("Failed to create investment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Investment Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Investment Name</Label>
        <Input
          id="name"
          placeholder="e.g., Bitcoin, Mutual Fund, Gold"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="h-12 text-base"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add notes about this investment..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="text-base resize-none"
        />
      </div>

      {/* Initial Investment Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Initial Investment (৳)</Label>
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
            {categories.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                No expense categories available
              </div>
            ) : (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          required
          className="h-12 text-base"
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
          {loading ? "Creating..." : "Create Investment"}
        </Button>
      </div>
    </form>
  )
}
