"use client"

import { useState } from "react"
import { Card } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import {
  MapPin,
  Wifi,
  DollarSign,
  Users,
  AlertTriangle,
  Check,
  X,
  Waves,
  Dumbbell,
  Shield,
  Banknote,
  Info,
  Star,
  Filter
} from "lucide-react"

interface Hotel {
  id: string
  name: string
  area: string
  guestFriendly: "YES" | "NO" | "JOINER_FEE" | "UNKNOWN"
  joinerFee?: number
  priceRange: "BUDGET" | "MID" | "HIGH" | "LUXURY"
  distanceToBeach?: number
  distanceToWalking?: number
  distanceToSoi6?: number
  hasPool: boolean
  hasGym: boolean
  hasSafe: boolean
  nearbyATM: boolean
  wifiQuality?: number
  rating?: number
  reviewCount?: number
}

// Demo data - will be replaced with real data from database
const demoHotels: Hotel[] = [
  {
    id: "1",
    name: "Flipper House Hotel",
    area: "Beach Road",
    guestFriendly: "YES",
    priceRange: "BUDGET",
    distanceToBeach: 50,
    distanceToWalking: 800,
    distanceToSoi6: 1200,
    hasPool: true,
    hasGym: false,
    hasSafe: true,
    nearbyATM: true,
    wifiQuality: 7,
    rating: 4.2,
    reviewCount: 89
  },
  {
    id: "2",
    name: "LK Metropole",
    area: "Second Road",
    guestFriendly: "YES",
    priceRange: "HIGH",
    distanceToBeach: 400,
    distanceToWalking: 900,
    distanceToSoi6: 800,
    hasPool: true,
    hasGym: true,
    hasSafe: true,
    nearbyATM: true,
    wifiQuality: 9,
    rating: 4.6,
    reviewCount: 234
  },
  {
    id: "3",
    name: "Hilton Pattaya",
    area: "Beach Road",
    guestFriendly: "JOINER_FEE",
    joinerFee: 1000,
    priceRange: "LUXURY",
    distanceToBeach: 0,
    distanceToWalking: 700,
    distanceToSoi6: 1100,
    hasPool: true,
    hasGym: true,
    hasSafe: true,
    nearbyATM: true,
    wifiQuality: 10,
    rating: 4.8,
    reviewCount: 567
  },
  {
    id: "4",
    name: "Centara Grand Mirage",
    area: "North Pattaya",
    guestFriendly: "NO",
    priceRange: "LUXURY",
    distanceToBeach: 0,
    distanceToWalking: 3000,
    distanceToSoi6: 2000,
    hasPool: true,
    hasGym: true,
    hasSafe: true,
    nearbyATM: true,
    wifiQuality: 10,
    rating: 4.7,
    reviewCount: 432
  },
  {
    id: "5",
    name: "Areca Lodge",
    area: "Soi 6",
    guestFriendly: "YES",
    priceRange: "BUDGET",
    distanceToBeach: 150,
    distanceToWalking: 1300,
    distanceToSoi6: 0,
    hasPool: true,
    hasGym: false,
    hasSafe: true,
    nearbyATM: true,
    wifiQuality: 8,
    rating: 4.4,
    reviewCount: 156
  },
]

interface HotelDatabaseProps {
  isPaid?: boolean
}

export function HotelDatabase({ isPaid = false }: HotelDatabaseProps) {
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedGuestFriendly, setSelectedGuestFriendly] = useState<string>("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredHotels = demoHotels.filter(hotel => {
    if (selectedArea !== "all" && hotel.area !== selectedArea) return false
    if (selectedGuestFriendly !== "all" && hotel.guestFriendly !== selectedGuestFriendly) return false
    if (selectedPriceRange !== "all" && hotel.priceRange !== selectedPriceRange) return false
    return true
  })

  const getGuestFriendlyBadge = (status: string, joinerFee?: number) => {
    switch (status) {
      case "YES":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="w-3 h-3 mr-1" />
            Guest Friendly
          </Badge>
        )
      case "JOINER_FEE":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Banknote className="w-3 h-3 mr-1" />
            {isPaid ? `${joinerFee} THB Joiner` : "Joiner Fee"}
          </Badge>
        )
      case "NO":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <X className="w-3 h-3 mr-1" />
            Not Guest Friendly
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Info className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

  const getPriceRangeBadge = (range: string) => {
    const colors = {
      BUDGET: "text-green-500",
      MID: "text-yellow-500",
      HIGH: "text-orange-500",
      LUXURY: "text-red-500"
    }
    const labels = {
      BUDGET: "< ฿1,000",
      MID: "฿1,000-2,500",
      HIGH: "฿2,500-5,000",
      LUXURY: "> ฿5,000"
    }
    return (
      <span className={cn("flex items-center gap-1 text-sm", colors[range])}>
        <DollarSign className="w-3 h-3" />
        {isPaid ? labels[range] : "Premium"}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Guest-Friendly Hotels</h2>
          <p className="text-muted-foreground">
            Verified database of {filteredHotels.length} hotels in Pattaya
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Area</label>
              <select
                className="w-full p-2 bg-background border rounded-md"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="all">All Areas</option>
                <option value="Beach Road">Beach Road</option>
                <option value="Walking Street">Walking Street</option>
                <option value="Soi 6">Soi 6</option>
                <option value="Second Road">Second Road</option>
                <option value="Soi Buakhao">Soi Buakhao</option>
                <option value="North Pattaya">North Pattaya</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Guest Policy</label>
              <select
                className="w-full p-2 bg-background border rounded-md"
                value={selectedGuestFriendly}
                onChange={(e) => setSelectedGuestFriendly(e.target.value)}
              >
                <option value="all">All Policies</option>
                <option value="YES">Guest Friendly</option>
                <option value="JOINER_FEE">Joiner Fee</option>
                <option value="NO">Not Guest Friendly</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <select
                className="w-full p-2 bg-background border rounded-md"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="BUDGET">Budget (&lt; ฿1,000)</option>
                <option value="MID">Mid (฿1,000-2,500)</option>
                <option value="HIGH">High (฿2,500-5,000)</option>
                <option value="LUXURY">Luxury (&gt; ฿5,000)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">
                {demoHotels.filter(h => h.guestFriendly === "YES").length}
              </p>
              <p className="text-xs text-muted-foreground">Guest Friendly</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">
                {demoHotels.filter(h => h.guestFriendly === "JOINER_FEE").length}
              </p>
              <p className="text-xs text-muted-foreground">Joiner Fee</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-2xl font-bold">
                {demoHotels.filter(h => h.guestFriendly === "NO").length}
              </p>
              <p className="text-xs text-muted-foreground">Not Friendly</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">
                {demoHotels.filter(h => h.priceRange === "BUDGET").length}
              </p>
              <p className="text-xs text-muted-foreground">Budget Options</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Hotel List */}
      <div className="grid gap-4">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {hotel.area}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getGuestFriendlyBadge(hotel.guestFriendly, hotel.joinerFee)}
                  {getPriceRangeBadge(hotel.priceRange)}
                </div>
              </div>

              {/* Distance Info */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <Waves className="w-3 h-3 text-blue-500" />
                  <span className="text-muted-foreground">Beach:</span>
                  <span>{hotel.distanceToBeach}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-500" />
                  <span className="text-muted-foreground">Walking St:</span>
                  <span>{hotel.distanceToWalking}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  <span className="text-muted-foreground">Soi 6:</span>
                  <span>{hotel.distanceToSoi6}m</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex items-center gap-3 mb-3">
                {hotel.hasPool && (
                  <Badge variant="secondary" className="text-xs">
                    <Waves className="w-3 h-3 mr-1" />
                    Pool
                  </Badge>
                )}
                {hotel.hasGym && (
                  <Badge variant="secondary" className="text-xs">
                    <Dumbbell className="w-3 h-3 mr-1" />
                    Gym
                  </Badge>
                )}
                {hotel.hasSafe && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Safe
                  </Badge>
                )}
                {hotel.nearbyATM && (
                  <Badge variant="secondary" className="text-xs">
                    <Banknote className="w-3 h-3 mr-1" />
                    ATM
                  </Badge>
                )}
                {hotel.wifiQuality && (
                  <Badge variant="secondary" className="text-xs">
                    <Wifi className="w-3 h-3 mr-1" />
                    WiFi {hotel.wifiQuality}/10
                  </Badge>
                )}
              </div>

              {/* Rating */}
              {hotel.rating && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{hotel.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({hotel.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Warning for non-guest-friendly */}
              {hotel.guestFriendly === "NO" && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span>This hotel does not allow guests. Choose another option.</span>
                  </div>
                </div>
              )}

              {/* Tip for joiner fee hotels */}
              {hotel.guestFriendly === "JOINER_FEE" && isPaid && (
                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-yellow-500">
                    <Info className="w-4 h-4" />
                    <span>Joiner fee of {hotel.joinerFee} THB per guest. Consider budget hotels to save money.</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Review CTA */}
      {isPaid && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Know a hotel not listed?</h4>
              <p className="text-sm text-muted-foreground">
                Help the community by adding your hotel review
              </p>
            </div>
            <Button size="sm">
              Add Hotel Review
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}