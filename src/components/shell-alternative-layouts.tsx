// Alternative layout options for square logo integration

import Image from "next/image"
import { Bird } from "lucide-react"

// Option 1: Compact Header with Square Logo (40x40px)
export function CompactHeaderLayout() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-lg shadow-lg flex items-center justify-center">
              <Bird className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold">MongerMaps</span>
            <span className="text-xs text-muted-foreground block">Global Monger Intel</span>
          </div>
        </div>
      </div>
    </header>
  )
}

// Option 2: Centered Logo Layout (Better for square logos)
export function CenteredLogoLayout() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4">
        {/* Left section - Navigation */}
        <nav className="flex-1 flex items-center space-x-6">
          <a href="/" className="text-sm font-medium">Cities</a>
          <a href="/make-money" className="text-sm font-medium">Make Money</a>
        </nav>

        {/* Center - Square Logo */}
        <div className="flex items-center">
          <div className="relative h-12 w-12 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
              <Bird className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        {/* Right section - User menu */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          <button className="text-sm">Search</button>
          <button className="text-sm">Profile</button>
        </div>
      </div>
    </header>
  )
}

// Option 3: Sidebar Logo (For when filters are on the left)
export function SidebarLogoLayout() {
  return (
    <div className="w-80 h-screen border-r bg-card">
      {/* Logo at top of sidebar */}
      <div className="p-6 border-b">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-2xl shadow-xl flex items-center justify-center">
              <Bird className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">MongerMaps</h1>
            <p className="text-xs text-muted-foreground">847 Cities Ranked</p>
          </div>
        </div>
      </div>
      
      {/* Filters below */}
      <div className="p-4">
        {/* Filter content */}
      </div>
    </div>
  )
}

// Option 4: Hero Logo (For landing/home page)
export function HeroLogoLayout() {
  return (
    <div className="relative bg-gradient-to-b from-background to-background/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Large square logo */}
          <div className="relative h-24 w-24 md:h-32 md:w-32">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-3xl shadow-2xl flex items-center justify-center animate-pulse">
              <Bird className="h-16 w-16 md:h-20 md:w-20 text-white" />
            </div>
            {/* Decorative ring */}
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-xl" />
          </div>
          
          {/* Title and tagline */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              MongerMaps
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              The World's Largest Monger Intelligence Platform
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
              <span>📍 847 Cities</span>
              <span>📝 2.6M+ Reports</span>
              <span>👥 50K+ Members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Option 5: Floating Logo Badge (For mobile or minimal UI)
export function FloatingLogoBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button className="relative h-14 w-14 group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <Bird className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
      </button>
    </div>
  )
}

// Option 6: Split Layout with Large Logo
export function SplitLayoutWithLogo() {
  return (
    <div className="flex h-screen">
      {/* Left side - Logo and branding */}
      <div className="w-96 bg-gradient-to-br from-primary/10 to-primary/5 border-r flex flex-col items-center justify-center p-8">
        <div className="relative h-32 w-32 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-3xl shadow-2xl flex items-center justify-center">
            <Bird className="h-20 w-20 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">MongerMaps</h1>
        <p className="text-sm text-muted-foreground text-center">
          Real intel from real mongers
        </p>
      </div>
      
      {/* Right side - Main content */}
      <div className="flex-1">
        {/* Content */}
      </div>
    </div>
  )
}

/* 
Usage with actual image file:

<Image 
  src="/mongermaps-logo-square.png" 
  alt="MongerMaps" 
  width={40}
  height={40}
  className="rounded-lg shadow-lg"
  priority
/>

For SVG logos:

<div className="h-10 w-10">
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Your SVG content */}
  </svg>
</div>

CSS for logo glow effect:

.logo-glow {
  box-shadow: 
    0 0 20px rgba(var(--primary-rgb), 0.5),
    0 0 40px rgba(var(--primary-rgb), 0.3),
    0 0 60px rgba(var(--primary-rgb), 0.1);
}

*/