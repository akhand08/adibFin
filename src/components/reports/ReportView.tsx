"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react"

export function ReportView() {
  const currentDate = new Date()
  const [year, setYear] = useState(currentDate.getFullYear())
  const [month, setMonth] = useState(currentDate.getMonth() + 1)
  const [monthlyData, setMonthlyData] = useState<any>(null)
  const [yearlyData, setYearlyData] = useState<any>(null)
  const [investmentData, setInvestmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMonthlyReport()
    fetchYearlyReport()
    fetchInvestmentReport()
  }, [year, month])

  const fetchMonthlyReport = async () => {
    try {
      const res = await fetch(
        `/api/reports/monthly?year=${year}&month=${month}`
      )
      if (res.ok) {
        const data = await res.json()
        setMonthlyData(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch monthly report:", error)
    }
  }

  const fetchYearlyReport = async () => {
    try {
      const res = await fetch(`/api/reports/yearly?year=${year}`)
      if (res.ok) {
        const data = await res.json()
        setYearlyData(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch yearly report:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInvestmentReport = async () => {
    try {
      const res = await fetch("/api/reports/investments")
      if (res.ok) {
        const data = await res.json()
        setInvestmentData(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch investment report:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Loading reports...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger value="monthly" className="text-sm sm:text-base">
          Monthly
        </TabsTrigger>
        <TabsTrigger value="yearly" className="text-sm sm:text-base">
          Yearly
        </TabsTrigger>
        <TabsTrigger value="investments" className="text-sm sm:text-base">
          Investments
        </TabsTrigger>
      </TabsList>

      {/* Monthly Report */}
      <TabsContent value="monthly" className="mt-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select
                  value={month.toString()}
                  onValueChange={(value) => setMonth(parseInt(value))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {monthlyData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-sm">Total Income</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    ৳{monthlyData.summary.totalIncome.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <ArrowDownCircle className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-sm">Total Expense</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    ৳{monthlyData.summary.totalExpense.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm">Net Savings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    ৳{monthlyData.summary.netSavings.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Expense by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(monthlyData.expenseByCategory).length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No expenses this month
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(monthlyData.expenseByCategory).map(
                        ([category, amount]: [string, any]) => (
                          <div
                            key={category}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm font-medium">
                              {category}
                            </span>
                            <span className="text-sm font-bold text-red-600">
                              ৳{amount.toLocaleString()}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Income by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(monthlyData.incomeByCategory).length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No income this month
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(monthlyData.incomeByCategory).map(
                        ([category, amount]: [string, any]) => (
                          <div
                            key={category}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm font-medium">
                              {category}
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              ৳{amount.toLocaleString()}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </TabsContent>

      {/* Yearly Report */}
      <TabsContent value="yearly" className="mt-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Label htmlFor="yearSelect">Year</Label>
              <Input
                id="yearSelect"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="h-11 mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {yearlyData && (
          <>
            {/* Yearly Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    ৳{yearlyData.summary.totalIncome.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    ৳{yearlyData.summary.totalExpense.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Net Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    ৳{yearlyData.summary.netSavings.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {yearlyData.monthlyData.map((data: any) => (
                    <div
                      key={data.month}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">
                        Month {data.month}
                      </span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">
                          +৳{data.totalIncome.toLocaleString()}
                        </span>
                        <span className="text-red-600">
                          -৳{data.totalExpense.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </TabsContent>

      {/* Investment Report */}
      <TabsContent value="investments" className="mt-6 space-y-4">
        {investmentData && (
          <>
            {/* Investment Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {investmentData.summary.totalInvestments}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Principal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ৳
                    {investmentData.summary.totalPrincipal.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    ৳
                    {investmentData.summary.totalNetProfit.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Overall ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-600">
                    {investmentData.summary.overallROI.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Investment List */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {investmentData.investments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No investments yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {investmentData.investments.map((inv: any) => (
                      <div
                        key={inv.id}
                        className="p-4 bg-gray-50 rounded-lg space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{inv.name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              inv.status === "OPEN"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Principal</p>
                            <p className="font-semibold">
                              ৳{inv.principal.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Profit</p>
                            <p className="font-semibold text-green-600">
                              ৳{inv.netProfit.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">ROI</p>
                            <p className="font-semibold text-purple-600">
                              {inv.roi.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-semibold">
                              {inv.durationDays} days
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}
