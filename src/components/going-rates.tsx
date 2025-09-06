"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Info,
  Filter
} from "lucide-react"
import { cn } from "~/lib/utils"

interface PriceData {
  service: string
  area: string
  venueType: string
  lowPrice: number
  avgPrice: number
  highPrice: number
  trend: "up" | "down" | "stable"
  lastUpdated: Date
  reportCount: number
}

// Demo data - will be replaced with real data from database
const demoPrices: PriceData[] = [
  // Short Time Prices
  {
    service: "Short Time",
    area: "Walking Street",
    venueType: "Go-Go Bar",
    lowPrice: 2500,
    avgPrice: 3500,
    highPrice: 5000,
    trend: "up",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
    reportCount: 89
  },
  {
    service: "Short Time",
    area: "Soi 6",
    venueType: "Beer Bar",
    lowPrice: 1000,
    avgPrice: 1500,
    highPrice: 2000,
    trend: "stable",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 45),
    reportCount: 234
  },
  {
    service: "Short Time",
    area: "Beach Road",
    venueType: "Freelancer",
    lowPrice: 1000,
    avgPrice: 1500,
    highPrice: 2500,
    trend: "down",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15),
    reportCount: 156
  },
  
  // Long Time Prices
  {
    service: "Long Time",
    area: "Walking Street",
    venueType: "Go-Go Bar",
    lowPrice: 4000,
    avgPrice: 5500,
    highPrice: 8000,
    trend: "up",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60),
    reportCount: 67
  },
  {
    service: "Long Time",
    area: "Soi 6",
    venueType: "Beer Bar",
    lowPrice: 2000,
    avgPrice: 2500,
    highPrice: 3500,
    trend: "stable",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 90),
    reportCount: 123
  },
  
  // Bar Fines
  {
    service: "Bar Fine",
    area: "Walking Street",
    venueType: "Go-Go Bar",
    lowPrice: 800,
    avgPrice: 1000,
    highPrice: 1500,
    trend: "up",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 20),
    reportCount: 456
  },
  {
    service: "Bar Fine",
    area: "LK Metro",
    venueType: "Go-Go Bar",
    lowPrice: 600,
    avgPrice: 800,
    highPrice: 1000,
    trend: "stable",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 35),
    reportCount: 234
  },
  
  // Lady Drinks
  {
    service: "Lady Drink",
    area: "Walking Street",
    venueType: "Go-Go Bar",
    lowPrice: 180,
    avgPrice: 220,
    highPrice: 300,
    trend: "up",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 10),
    reportCount: 789
  },
  {
    service: "Lady Drink",
    area: "Soi 6",
    venueType: "Beer Bar",
    lowPrice: 140,
    avgPrice: 160,
    highPrice: 200,
    trend: "stable",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 25),
    reportCount: 567
  },
]

interface GoingRatesProps {
  city?: string
  isPaid?: boolean
}

export function GoingRates({ city = "pattaya", isPaid = false }: GoingRatesProps) {
  const [selectedService, setSelectedService] = useState<string>("all")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const services = ["all", "Short Time", "Long Time", "Bar Fine", "Lady Drink"]
  const areas = ["all", "Walking Street", "Soi 6", "Beach Road", "LK Metro", "Soi Buakhao"]

  const filteredPrices = demoPrices.filter(price => {
    if (selectedService !== "all" && price.service !== selectedService) return false
    if (selectedArea !== "all" && price.area !== selectedArea) return false
    return true
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />
    }
  }

  const formatTime = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 1000 / 60)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getServiceColor = (service: string) => {
    const colors = {
      "Short Time": "text-blue-500",
      "Long Time": "text-purple-500",
      "Bar Fine": "text-orange-500",
      "Lady Drink": "text-pink-500"
    }
    return colors[service] || "text-gray-500"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Going Rates - {city.charAt(0).toUpperCase() + city.slice(1)}</h2>
          <p className="text-muted-foreground">
            Current market prices based on {demoPrices.reduce((sum, p) => sum + p.reportCount, 0)} recent reports
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Service Type</label>
              <select
                className="w-full p-2 bg-background border rounded-md"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Area</label>
              <select
                className="w-full p-2 bg-background border rounded-md"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">ST Average</p>
              <p className="text-xl font-bold">
                {isPaid ? "฿2,200" : "Premium"}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">LT Average</p>
              <p className="text-xl font-bold">
                {isPaid ? "฿3,800" : "Premium"}
              </p>
            </div>
            <Minus className="w-5 h-5 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Bar Fine Avg</p>
              <p className="text-xl font-bold">
                {isPaid ? "฿900" : "Premium"}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Updates</p>
              <p className="text-xl font-bold">Live</p>
            </div>
            <Clock className="w-5 h-5 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Price Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Prices by Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Service</th>
                  <th className="text-left p-2 text-sm font-medium">Area</th>
                  <th className="text-left p-2 text-sm font-medium">Venue</th>
                  <th className="text-center p-2 text-sm font-medium">Low</th>
                  <th className="text-center p-2 text-sm font-medium">Average</th>
                  <th className="text-center p-2 text-sm font-medium">High</th>
                  <th className="text-center p-2 text-sm font-medium">Trend</th>
                  <th className="text-center p-2 text-sm font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.map((price, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <span className={cn("font-medium", getServiceColor(price.service))}>
                        {price.service}
                      </span>
                    </td>
                    <td className="p-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {price.area}
                      </div>
                    </td>
                    <td className="p-2 text-sm">{price.venueType}</td>
                    <td className="p-2 text-center text-sm">
                      {isPaid ? `฿${price.lowPrice}` : "---"}
                    </td>
                    <td className="p-2 text-center font-semibold">
                      {isPaid ? `฿${price.avgPrice}` : "Premium"}
                    </td>
                    <td className="p-2 text-center text-sm">
                      {isPaid ? `฿${price.highPrice}` : "---"}
                    </td>
                    <td className="p-2 text-center">
                      {getTrendIcon(price.trend)}
                    </td>
                    <td className="p-2 text-center text-xs text-muted-foreground">
                      {formatTime(price.lastUpdated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <div className="flex gap-3">
            <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Best Value Areas</h4>
              <p className="text-sm text-muted-foreground">
                {isPaid ? "Soi 6 and Soi Buakhao offer the best value with ST averaging ฿1,500" : "Join to see best value locations"}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Price Alert</h4>
              <p className="text-sm text-muted-foreground">
                Walking Street go-go prices up 15% in last month due to high season
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Price CTA */}
      {isPaid && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Help keep prices accurate</h4>
              <p className="text-sm text-muted-foreground">
                Report your recent transactions to help the community
              </p>
            </div>
            <Button size="sm">
              Report Price
            </Button>
          </div>
        </Card>
      )}

      {/* Legend */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3">Understanding the Data</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Price Range</p>
              <p className="text-xs text-muted-foreground">
                Low = Best negotiated price | High = Initial asking price
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Trends</p>
              <p className="text-xs text-muted-foreground">
                Based on last 7 days vs previous week
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Data Source</p>
              <p className="text-xs text-muted-foreground">
                Verified member reports only
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}