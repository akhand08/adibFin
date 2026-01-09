"use client"

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

interface NavbarProps {
  userName?: string
  isMobileMenuOpen: boolean
  onToggleMobileMenu: () => void
}

export function Navbar({ userName, isMobileMenuOpen, onToggleMobileMenu }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">AdibFin</h1>
        </div>

        {/* User info and logout - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-sm text-gray-700">Hello, {userName}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="h-9"
          >
            Logout
          </Button>
        </div>

        {/* Mobile logout button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="h-9 text-xs"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
