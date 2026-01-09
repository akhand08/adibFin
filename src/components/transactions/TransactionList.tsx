"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowUpCircle, ArrowDownCircle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface Transaction {
  id: string
  date: string
  type: "EXPENSE" | "INCOME"
  amount: number
  note?: string
  category: {
    id: string
    name: string
  }
}

export function TransactionList() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "EXPENSE" | "INCOME">("ALL")

  useEffect(() => {
    fetchTransactions()
  }, [filter])

  const fetchTransactions = async () => {
    try {
      const url =
        filter === "ALL"
          ? "/api/transactions"
          : `/api/transactions?type=${filter}`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setTransactions(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return

    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || "Failed to delete transaction")
        return
      }

      await fetchTransactions()
      router.refresh()
    } catch (error) {
      alert("Failed to delete transaction")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Loading transactions...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant={filter === "ALL" ? "default" : "outline"}
              onClick={() => setFilter("ALL")}
              className="h-11 flex-1"
            >
              All
            </Button>
            <Button
              variant={filter === "INCOME" ? "default" : "outline"}
              onClick={() => setFilter("INCOME")}
              className="h-11 flex-1"
            >
              Income
            </Button>
            <Button
              variant={filter === "EXPENSE" ? "default" : "outline"}
              onClick={() => setFilter("EXPENSE")}
              className="h-11 flex-1"
            >
              Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "ALL"
              ? "All Transactions"
              : filter === "EXPENSE"
              ? "Expenses"
              : "Income"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No transactions found</p>
              <p className="text-sm mt-2">
                {filter !== "ALL"
                  ? `Try selecting "All Transactions"`
                  : "Start by adding your first transaction"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    {/* Top row: Amount and type */}
                    <div className="flex items-center gap-3 mb-2">
                      {transaction.type === "INCOME" ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                      <span
                        className={`text-lg font-bold ${
                          transaction.type === "INCOME"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ৳{transaction.amount.toLocaleString()}
                      </span>
                      <Badge
                        variant={
                          transaction.type === "INCOME"
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {transaction.category.name}
                      </Badge>
                    </div>

                    {/* Note if exists */}
                    {transaction.note && (
                      <p className="text-sm text-gray-700 mb-2 truncate">
                        {transaction.note}
                      </p>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(transaction.date)}
                    </div>
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 flex-shrink-0 ml-2"
                    onClick={() => handleDelete(transaction.id)}
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
