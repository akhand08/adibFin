"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface AddReturnDialogProps {
  investmentId: string
  investmentName: string
  onSuccess: () => void
}

export function AddReturnDialog({
  investmentId,
  investmentName,
  onSuccess,
}: AddReturnDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    totalReturned: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=INCOME")
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
      const res = await fetch(`/api/investments/${investmentId}/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalReturned: parseFloat(formData.totalReturned),
          categoryId: formData.categoryId,
          date: formData.date,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || "Failed to add return")
        return
      }

      setOpen(false)
      setFormData({
        totalReturned: "",
        categoryId: "",
        date: new Date().toISOString().split("T")[0],
      })
      onSuccess()
    } catch (error) {
      alert("Failed to add return")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-11 min-h-[44px]">
          <Plus className="h-5 w-5 mr-2" />
          Add Return
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Return</DialogTitle>
            <DialogDescription>
              Record total amount returned from {investmentName}. We&apos;ll automatically calculate capital and profit/loss.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="totalReturned">Total Returned (৳)</Label>
              <Input
                id="totalReturned"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.totalReturned}
                onChange={(e) =>
                  setFormData({ ...formData, totalReturned: e.target.value })
                }
                required
                className="h-11"
              />
              <p className="text-xs text-gray-500">
                Enter the total amount you received. System will separate capital from profit/loss.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Income Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="h-11"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.categoryId}
              className="h-11"
            >
              {loading ? "Adding..." : "Add Return"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
