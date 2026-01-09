"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  BarChart3,
  Tag,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { name: "Investments", href: "/dashboard/investments", icon: TrendingUp },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Categories", href: "/dashboard/categories", icon: Tag },
]

interface SidebarProps {
  isMobile?: boolean
  onItemClick?: () => void
}

export function Sidebar({ isMobile, onItemClick }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col h-full bg-gray-50 border-r border-gray-200",
      isMobile ? "w-64" : "w-64"
    )}>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                "min-h-[44px]", // Touch-friendly minimum height
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              )}
            >
              <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          AdibFin v1.0
        </p>
      </div>
    </div>
  )
}
