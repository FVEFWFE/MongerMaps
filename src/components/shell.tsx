"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Bird, Database, Globe, User, Search, Copy, DollarSign, ChevronDown, Gift, MapPin, MessageCircle, Users, Calendar, HelpCircle, Bug, Shield, Image, Moon, Sun, Heart, Shuffle, TrendingUp, Home } from "lucide-react"
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
import { useTheme } from "next-themes"

import CountUp from "./CountUp";
import { ThemeToggle } from "./theme-toggle";

// Dynamically import DecryptedText to avoid SSR issues
const DecryptedText = dynamic(() => import("./DecryptedText"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center gap-8">
      <span className="text-muted-foreground italic">
        Because men who've earned their freedom deserve to enjoy it without getting scammed.
      </span>
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground font-medium">
        2.6M+ Reports. No BS. Trusted by 12,000+ Vets.
      </span>
    </div>
  ),
})

const navigation: { name: string; href: string; icon: any }[] = []

export function Shell({ 
  children,
  onCursorToggle,
  cursorEnabled = true 
}: { 
  children: React.ReactNode;
  onCursorToggle?: () => void;
  cursorEnabled?: boolean;
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [logoDropdownOpen, setLogoDropdownOpen] = useState(false)
  const [referralCode] = useState("MONGER123") // Demo referral code
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickCountRef = useRef(0)
  const { theme, setTheme } = useTheme()

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://mongermaps.com/ref/${referralCode}`)
    // You could add a toast notification here
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    clickCountRef.current += 1
    
    if (clickCountRef.current === 1) {
      // Single click - wait to see if it's a double click
      clickTimeoutRef.current = setTimeout(() => {
        // It was just a single click - open dropdown
        if (clickCountRef.current === 1) {
          setLogoDropdownOpen(true)
        }
        clickCountRef.current = 0
      }, 250) // 250ms to detect double click
    } else if (clickCountRef.current === 2) {
      // Double click - clear timeout and go home with cleared filters
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      // Close dropdown if open
      setLogoDropdownOpen(false)
      // Navigate to home and clear filters
      router.push('/?clear=true')
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
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 mr-4">
            {/* Square Logo with Dropdown */}
            <DropdownMenu open={logoDropdownOpen} onOpenChange={setLogoDropdownOpen}>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button 
                        onClick={handleLogoClick}
                        className="relative h-12 w-12 flex-shrink-0 group cursor-zoom-in cursor-magnetic focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0"
                        title="Click to open nav, double click to go home"
                      >
                        <div className="absolute inset-0 rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                          <img 
                            src="/logo.png" 
                            alt="MongerMaps Logo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Dropdown arrow indicator */}
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to open nav, double click to go home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
                  <DropdownMenuContent align="start" className="w-64">
                    {/* General */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground">General</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push('/')}>
                          <Home className="mr-2 h-4 w-4" />
                          <span>Frontpage</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onCursorToggle}>
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Cursor effect: {cursorEnabled ? 'On' : 'Off'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={toggleTheme}>
                          {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                          <span>Dark mode: {theme === 'dark' ? 'On' : 'Off'}</span>
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
            
            {/* Title Text - Not clickable */}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight">MongerMaps.io</span>
              <span className="text-xs text-muted-foreground">Find the Gems. Avoid the Rip-offs.</span>
            </div>
          </div>

          {/* Search right after logo */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 text-muted-foreground cursor-target"
            data-cursor="search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search 2.6M+ field reports, venues with hot girls, cities...</span>
            <span className="lg:hidden">Search</span>
          </Button>

          {/* Tagline */}
          <div className="hidden xl:flex flex-col mx-4 text-xs max-w-lg">
            <DecryptedText 
              text="Stop Wasting Your Travels on 'Starfish'." 
              className="font-semibold text-foreground"
              speed={30}
              maxIterations={15}
            />
            <DecryptedText 
              text="Live member-vetted map. Real stunners. Real-time prices. No outdated forums."
              className="text-muted-foreground"
              speed={40}
              maxIterations={12}
            />
          </div>

          {/* Navigation Links - hidden since empty */}
          {navigation.length > 0 && (
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
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Theme Toggle */}
            <ThemeToggle />

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
          <div className="hidden lg:block px-6 py-3 bg-muted/20 border-b text-xs text-center">
            <div className="flex items-center justify-center gap-8">
              <DecryptedText
                text="Because men who've earned their freedom deserve to enjoy it without getting scammed."
                className="text-muted-foreground italic"
                speed={35}
                maxIterations={18}
                sequential={true}
                revealDirection="center"
              />
              <DecryptedText
                text="•"
                className="text-muted-foreground"
                speed={50}
                maxIterations={8}
              />
              <span className="text-muted-foreground font-medium">
                <CountUp from={0} to={2.6} duration={2} className="inline" />M+ Reports. No BS. Trusted by <CountUp from={0} to={12} duration={1.5} className="inline" />,000+ Vets.
              </span>
            </div>
          </div>
          {children}
        </main>
      </div>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search 2.6M+ field reports, venues with hot girls, cities..." />
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