"use client"

import { useState } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
}

export function DashboardLayout({ children, userName }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar
        userName={userName}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar - Overlay drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
              <Sidebar isMobile onItemClick={() => setIsMobileMenuOpen(false)} />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full md:w-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
