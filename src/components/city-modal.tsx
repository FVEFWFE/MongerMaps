"use client"

import { useState } from "react"
import { X, Star, Wifi, DollarSign, Sun, Users, MapPin, TrendingUp, MessageSquare, Camera, Cloud, BarChart, Building, Briefcase, Navigation, Heart, ChevronRight, Check, Banknote, Info } from "lucide-react"
import Image from "next/image"
import { FlagIcon } from "./flag-icon"
import { Badge } from "~/components/ui/badge"
import { HotelDatabase } from "./hotel-database"

interface CityModalProps {
  city: {
    slug: string
    name: string
    country: string
    flag: string
    description: string
    mongerRank: number
    stats: {
      venues: number
      activeUsers: number
      vibeScore: number
      alerts: number
      fairPriceST: number
      currency: string
      newReports24h: number
      topRatedVenues: number
      temperature?: number
      internetSpeed?: number
      airQuality?: number
    }
    badges?: string[]
    trending?: boolean
    comingSoon?: boolean
    image?: string
    region: string
    temperature: string
    cost: string
    pros?: string[]
    cons?: string[]
    scores?: {
      overall: number
      costOfLiving: number
      internet: number
      safety: number
      nightlife: number
      walkability: number
      english: number
      healthcare: number
      climate: number
      outdoors: number
      cannabis: number
      lgbtq: number
    }
  } | null
  isOpen: boolean
  onClose: () => void
  isPaid?: boolean
}

const tabs = [
  "Scores",
  "Venues",
  "Hotels",
  "Digital Nomad Guide", 
  "Pros and Cons",
  "Reviews",
  "Cost of Living",
  "People",
  "Chat",
  "Photos",
  "Weather",
  "Trends",
  "Demographics",
  "Neighborhoods",
  "Coworking",
  "Video",
  "Remote jobs",
  "Near",
  "Next",
  "Similar"
]

export function CityModal({ city, isOpen, onClose, isPaid = false }: CityModalProps) {
  const [activeTab, setActiveTab] = useState("Scores")

  if (!isOpen || !city) return null

  const defaultScores = {
    overall: city.stats.vibeScore || 4.2,
    costOfLiving: 4.5,
    internet: city.stats.internetSpeed ? city.stats.internetSpeed / 20 : 4.3,
    safety: 5 - (city.stats.alerts * 0.5),
    nightlife: 4.6,
    walkability: 3.2,
    english: 4.1,
    healthcare: 3.9,
    climate: 4.4,
    outdoors: 4.2,
    cannabis: 3.5,
    lgbtq: 3.7
  }

  const scores = city.scores || defaultScores

  const renderTabContent = () => {
    switch (activeTab) {
      case "Scores":
        return (
          <div className="space-y-6">
            <div className="bg-background/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Overall Score</h3>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl font-bold text-primary">{scores.overall.toFixed(2)}</div>
                <div className="text-muted-foreground">/5.00</div>
                <div className="flex gap-1 ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(scores.overall)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(scores).filter(([key]) => key !== "overall").map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-background rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(value / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">
                        {(value as number).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "Venues":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Popular Venues</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{city.stats.venues} total venues</span>
                <span className="text-primary ml-2">{city.stats.topRatedVenues} top rated</span>
              </div>
            </div>
            
            <div className="grid gap-4">
              {/* Example venue cards */}
              {[
                { name: "Walking Street", type: "Bar Complex", rating: 4.8, reports: 234, price: "$$" },
                { name: "Soi 6", type: "Bar Street", rating: 4.5, reports: 189, price: "$" },
                { name: "LK Metro", type: "Entertainment District", rating: 4.3, reports: 156, price: "$$" },
                { name: "Beach Road", type: "Freelancer Area", rating: 4.0, reports: 98, price: "$" },
                { name: "Soi Buakhao", type: "Bar Complex", rating: 4.4, reports: 145, price: "$" }
              ].map((venue, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-4 hover:bg-background/70 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{venue.name}</h4>
                      <p className="text-sm text-muted-foreground">{venue.type}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span>{venue.rating}</span>
                        </div>
                        <span className="text-muted-foreground">{venue.reports} reports</span>
                        <span className="text-primary">{venue.price}</span>
                      </div>
                    </div>
                    {!isPaid && (
                      <Badge variant="secondary" className="text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Recent Activity</p>
                  <p className="text-sm text-muted-foreground">{city.stats.newReports24h} new reports in last 24h</p>
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        )

      case "Hotels":
        return (
          <div className="space-y-6">
            <HotelDatabase isPaid={isPaid} />
          </div>
        )

      case "Digital Nomad Guide":
        return (
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4">Digital Nomad Guide for {city.name}</h3>
              <p className="text-muted-foreground">
                {city.description || `${city.name} is a popular destination for digital nomads and remote workers. With ${city.stats.internetSpeed || "fast"} Mbps internet speeds and a ${city.cost} cost of living, it offers a great balance for those looking to work remotely while experiencing a new culture.`}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-background/50 rounded-lg p-4">
                  <Wifi className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Internet Speed</div>
                  <div className="font-semibold">{city.stats.internetSpeed || "N/A"} Mbps</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <DollarSign className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Cost of Living</div>
                  <div className="font-semibold">{city.cost}</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <Sun className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Weather</div>
                  <div className="font-semibold">{city.temperature === "warm" ? "Warm & Tropical" : city.temperature === "mild" ? "Mild & Temperate" : "Cool"}</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Expat Community</div>
                  <div className="font-semibold">Active</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "Pros and Cons":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-500">Pros</h3>
                <ul className="space-y-2">
                  {(city.pros || [
                    "Great nightlife and entertainment",
                    "Affordable cost of living",
                    "Good internet infrastructure",
                    "Vibrant expat community",
                    "Excellent food scene"
                  ]).map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-muted-foreground">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-500">Cons</h3>
                <ul className="space-y-2">
                  {(city.cons || [
                    "Traffic can be heavy",
                    "Language barrier for some",
                    "Hot and humid weather",
                    "Tourist areas can be crowded"
                  ]).map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-muted-foreground">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )

      case "Reviews":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Reviews</h3>
              <span className="text-muted-foreground">{city.stats.activeUsers} active users</span>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-background/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-full" />
                  <div>
                    <div className="font-medium">Anonymous User</div>
                    <div className="text-xs text-muted-foreground">2 months ago</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${
                          j < 4 ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Great city for digital nomads! The nightlife is amazing and there's always something to do. 
                  Internet speeds are reliable and the cost of living is very reasonable.
                </p>
              </div>
            ))}
          </div>
        )

      case "Cost of Living":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Monthly Cost Breakdown</h3>
            <div className="space-y-3">
              {[
                { item: "Accommodation (1BR)", cost: "$800-1500" },
                { item: "Food & Dining", cost: "$300-600" },
                { item: "Transportation", cost: "$50-150" },
                { item: "Nightlife & Entertainment", cost: "$500-1500" },
                { item: "Short Time", cost: isPaid ? `${city.stats.currency} ${city.stats.fairPriceST}` : "Premium only" },
                { item: "Long Time", cost: isPaid ? `${city.stats.currency} ${city.stats.fairPriceST * 2}` : "Premium only" },
                { item: "Drinks at Venues", cost: "$5-15" },
                { item: "Bar Fine", cost: isPaid ? "$20-50" : "Premium only" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-background/50 rounded-lg p-3">
                  <span className="text-muted-foreground">{item.item}</span>
                  <span className="font-semibold">{item.cost}</span>
                </div>
              ))}
            </div>
            <div className="bg-primary/10 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Monthly Cost</span>
                <span className="text-xl font-bold text-primary">$1,500 - $3,200</span>
              </div>
            </div>
          </div>
        )

      case "Weather":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Climate Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <Cloud className="w-5 h-5 text-primary mb-2" />
                <div className="text-sm text-muted-foreground">Average Temperature</div>
                <div className="font-semibold">28°C / 82°F</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <Sun className="w-5 h-5 text-primary mb-2" />
                <div className="text-sm text-muted-foreground">Sunny Days</div>
                <div className="font-semibold">250+ days/year</div>
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Best Time to Visit</h4>
              <p className="text-sm text-muted-foreground">
                November to March offers the best weather with less humidity and rainfall.
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4">🚧</div>
            <p>This section is coming soon!</p>
            <p className="text-sm mt-2">We're working on adding more detailed information about {activeTab.toLowerCase()}.</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-card rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with image */}
        <div className="relative h-64 overflow-hidden">
          {city.image ? (
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {/* City info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">{city.name}</h2>
              <FlagIcon country={city.country} className="w-8 h-6" />
              {city.trending && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  🔥 Trending
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {city.country}, {city.region}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span>{city.stats.vibeScore}</span>
                <span className="text-white/70">({city.stats.activeUsers} users)</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}