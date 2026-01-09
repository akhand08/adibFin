"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddReturnDialog } from "./AddReturnDialog"
import { TrendingUp, Calendar, DollarSign } from "lucide-react"

interface Investment {
  id: string
  name: string
  description?: string
  startDate: string
  status: "OPEN" | "CLOSED"
  closedDate?: string
  cashflows: Array<{
    id: string
    flowType: string
    amount: number
    createdAt: string
  }>
}

export function InvestmentList() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      const res = await fetch("/api/investments")
      if (res.ok) {
        const data = await res.json()
        setInvestments(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch investments:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (investment: Investment) => {
    const principal = investment.cashflows
      .filter((cf) => cf.flowType === "INVEST_PRINCIPAL")
      .reduce((sum, cf) => sum + cf.amount, 0)

    const capitalReturned = investment.cashflows
      .filter((cf) => cf.flowType === "RETURN_OF_CAPITAL")
      .reduce((sum, cf) => sum + cf.amount, 0)

    const profit = investment.cashflows
      .filter((cf) => cf.flowType === "PROFIT")
      .reduce((sum, cf) => sum + cf.amount, 0)

    const roi = principal > 0 ? (profit / principal) * 100 : 0

    return { principal, capitalReturned, profit, roi }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const openInvestments = investments.filter((inv) => inv.status === "OPEN")
  const closedInvestments = investments.filter((inv) => inv.status === "CLOSED")

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Loading investments...</p>
        </CardContent>
      </Card>
    )
  }

  const InvestmentCard = ({ investment }: { investment: Investment }) => {
    const stats = calculateStats(investment)

    // Calculate result for closed investments
    const result = investment.status === "CLOSED"
      ? stats.profit > 0
        ? "PROFIT"
        : stats.profit < 0
        ? "LOSS"
        : "BREAK_EVEN"
      : null

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{investment.name}</CardTitle>
              {investment.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {investment.description}
                </p>
              )}
              {result && (
                <Badge
                  variant={result === "PROFIT" ? "default" : "destructive"}
                  className={`mt-2 ${
                    result === "PROFIT"
                      ? "bg-green-600"
                      : result === "LOSS"
                      ? "bg-red-600"
                      : "bg-gray-600"
                  }`}
                >
                  {result}
                </Badge>
              )}
            </div>
            <Badge
              variant={investment.status === "OPEN" ? "default" : "secondary"}
              className="ml-2"
            >
              {investment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Principal</p>
              <p className="text-lg font-bold">
                ৳{stats.principal.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Returned</p>
              <p className="text-lg font-bold text-green-600">
                ৳{stats.capitalReturned.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Profit</p>
              <p className="text-lg font-bold text-blue-600">
                ৳{stats.profit.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">ROI</p>
              <p className="text-lg font-bold text-purple-600">
                {stats.roi.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Date Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
            <Calendar className="h-3 w-3" />
            <span>Started: {formatDate(investment.startDate)}</span>
            {investment.closedDate && (
              <span>• Closed: {formatDate(investment.closedDate)}</span>
            )}
          </div>

          {/* Add Return Button (only for open investments) */}
          {investment.status === "OPEN" && (
            <AddReturnDialog
              investmentId={investment.id}
              investmentName={investment.name}
              onSuccess={fetchInvestments}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="open" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-12">
        <TabsTrigger value="open" className="text-base">
          Open ({openInvestments.length})
        </TabsTrigger>
        <TabsTrigger value="closed" className="text-base">
          Closed ({closedInvestments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="open" className="mt-6 space-y-4">
        {openInvestments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              <p>No open investments</p>
              <p className="text-sm mt-2">
                Start by creating your first investment
              </p>
            </CardContent>
          </Card>
        ) : (
          openInvestments.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))
        )}
      </TabsContent>

      <TabsContent value="closed" className="mt-6 space-y-4">
        {closedInvestments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              <p>No closed investments</p>
            </CardContent>
          </Card>
        ) : (
          closedInvestments.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}
