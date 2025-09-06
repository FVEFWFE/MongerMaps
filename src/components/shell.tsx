"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bird, Database, Globe, User, Search, Copy, DollarSign, ChevronDown, Gift, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Cities", href: "/", icon: Globe },
  { name: "Make Money Mongering", href: "/make-money", icon: DollarSign },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [referralCode] = useState("MONGER123") // Demo referral code

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://mongermaps.com/ref/${referralCode}`)
    // You could add a toast notification here
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          {/* Logo on the left */}
          <Link href="/" className="flex items-center space-x-3 mr-4">
            <Bird className="h-6 w-6 text-foreground" />
            <span className="text-lg font-bold text-foreground">MongerMaps</span>
          </Link>

          {/* Search right after logo */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 text-muted-foreground mr-8"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search cities, venues, reports...</span>
            <span className="lg:hidden">Search</span>
          </Button>

          {/* Navigation Links - pushed further right */}
          <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 ml-auto">

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="text-sm font-medium mb-2">My Referral Code</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2 py-1 bg-muted rounded text-xs">{referralCode}</code>
                    <Button size="sm" variant="outline" onClick={handleCopyReferral}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    4 Referrals = 1 Year Free
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search cities, venues, reports..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Cities">
            <CommandItem>
              <Globe className="mr-2 h-4 w-4" />
              Pattaya
            </CommandItem>
            <CommandItem>
              <Globe className="mr-2 h-4 w-4" />
              Bangkok
            </CommandItem>
            <CommandItem>
              <Globe className="mr-2 h-4 w-4" />
              Angeles City
            </CommandItem>
            <CommandItem>
              <Globe className="mr-2 h-4 w-4" />
              Tijuana
            </CommandItem>
            <CommandItem>
              <Globe className="mr-2 h-4 w-4" />
              Medellin
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Venues">
            <CommandItem>
              <MapPin className="mr-2 h-4 w-4" />
              Walking Street
            </CommandItem>
            <CommandItem>
              <MapPin className="mr-2 h-4 w-4" />
              Soi 6
            </CommandItem>
            <CommandItem>
              <MapPin className="mr-2 h-4 w-4" />
              Nana Plaza
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Recent Reports">
            <CommandItem>
              <Database className="mr-2 h-4 w-4" />
              Pattaya November Update
            </CommandItem>
            <CommandItem>
              <Database className="mr-2 h-4 w-4" />
              Bangkok Price Changes
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}