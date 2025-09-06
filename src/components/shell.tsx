"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bird, Database, Globe, User, Search, Copy, DollarSign, ChevronDown, Gift, MapPin, MessageCircle, Users, Calendar, HelpCircle, Bug, Shield, Image, Moon, Heart, Shuffle, TrendingUp, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  { name: "Make Money Mongering", href: "/make-money", icon: DollarSign },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [logoDropdownOpen, setLogoDropdownOpen] = useState(false)
  const [referralCode] = useState("MONGER123") // Demo referral code
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickCountRef = useRef(0)

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://mongermaps.com/ref/${referralCode}`)
    // You could add a toast notification here
  }

  const handleLogoClick = () => {
    clickCountRef.current += 1
    
    if (clickCountRef.current === 1) {
      // Single click - open dropdown
      clickTimeoutRef.current = setTimeout(() => {
        setLogoDropdownOpen(true)
        clickCountRef.current = 0
      }, 300)
    } else if (clickCountRef.current === 2) {
      // Double click - go home without filters
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      router.push('/')
      clickCountRef.current = 0
    }
  }

  return (
    <div className="flex h-screen bg-background w-full">
      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Header - Only above main content, not filters */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
          {/* Square Logo with Dropdown */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu open={logoDropdownOpen} onOpenChange={setLogoDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button 
                      onClick={handleLogoClick}
                      className="flex items-center space-x-3 mr-4 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                          <Bird className="h-6 w-6 text-white" />
                        </div>
                      </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight">MongerMaps</span>
              <span className="text-xs text-muted-foreground">Find the Gems. Avoid the Rip-offs.</span>
            </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {/* General */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground">General</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push('/')}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Frontpage</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark mode</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Your favorites</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Community */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Community</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push('/chat')}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Chat</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Friend finder</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Host meetup</span>
                      <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">new</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Attend meetup</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Swingers meetup</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Gangbang meetup</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Tools */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Tools</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push('/best')}>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>Best place now</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/random')}>
                      <Shuffle className="mr-2 h-4 w-4" />
                      <span>Random place</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/random-good')}>
                      <Shuffle className="mr-2 h-4 w-4" />
                      <span>Random good place</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/gallery')}>
                      <Image className="mr-2 h-4 w-4" />
                      <span>Gallery</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Help */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Help</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push('/faq')}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>FAQ & Help</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open('https://github.com/mongermaps/feedback', '_blank')}>
                      <Bug className="mr-2 h-4 w-4" />
                      <span>Ideas + bugs</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/changelog')}>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>Changelog</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/legal')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>TOS & Privacy policy</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to open nav, double click to go home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Search right after logo */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search cities, venues with hot girls, 2.6M+ field reports...</span>
            <span className="lg:hidden">Search</span>
          </Button>

          {/* Tagline */}
          <div className="hidden xl:flex flex-col mx-4 text-xs max-w-lg">
            <span className="font-semibold text-foreground">Stop Wasting Your Travels on 'Starfish'.</span>
            <span className="text-muted-foreground">
              Live member-vetted map. Real stunners. Real-time prices. No outdated forums.
            </span>
          </div>

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
          {/* Philosophical Hook & Social Proof Bar */}
          <div className="hidden lg:flex items-center justify-between px-6 py-3 bg-muted/20 border-b text-xs">
            <span className="text-muted-foreground italic">
              Because men who've earned their freedom deserve to enjoy it without getting scammed.
            </span>
            <span className="text-muted-foreground font-medium">
              2.6M+ Reports. No BS. Trusted by 12,000+ Vets.
            </span>
          </div>
          {children}
        </main>
      </div>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search cities, venues with hot girls, 2.6M+ field reports..." />
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