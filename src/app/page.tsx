"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Star,
  Globe,
  MapPin,
  DollarSign,
  Lock,
  ArrowRight,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Grid3X3,
  ChevronDown,
  Search as SearchIcon
} from "lucide-react";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { PaywallModal } from "~/components/paywall-modal";
import { SidebarFilters } from "~/components/sidebar-filters";
import { CityCard } from "~/components/city-card";

// Extended city data with Monger Rank factors
const cities = [
  {
    slug: "pattaya",
    name: "Pattaya",
    country: "Thailand",
    flag: "🇹🇭",
    description: "The undisputed capital of mongering",
    mongerRank: 1,
    stats: {
      venues: 247,
      activeUsers: 1843,
      vibeScore: 9.2,
      alerts: 3,
      fairPriceST: 1500,
      currency: "THB",
      newReports24h: 184,
      topRatedVenues: 42,
      temperature: 32,
      internetSpeed: 85,
      airQuality: 45
    },
    badges: ["Most Active", "Best Value", "24/7 Action"],
    trending: true,
    image: "/bangkok-skyline-with-temples.jpg",
    region: "asia",
    temperature: "warm",
    cost: "cheap"
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    description: "Massive city with endless options",
    mongerRank: 2,
    stats: {
      venues: 189,
      activeUsers: 1254,
      vibeScore: 8.7,
      alerts: 1,
      fairPriceST: 2000,
      currency: "THB",
      newReports24h: 126,
      topRatedVenues: 31,
      temperature: 33,
      internetSpeed: 92,
      airQuality: 55
    },
    badges: ["Diverse Scene", "High-End Options"],
    trending: false,
    image: "/bangkok-skyline-with-temples.jpg",
    region: "asia",
    temperature: "warm",
    cost: "cheap"
  },
  {
    slug: "angeles",
    name: "Angeles City",
    country: "Philippines",
    flag: "🇵🇭",
    description: "Compact party zone with GFE paradise",
    mongerRank: 3,
    stats: {
      venues: 134,
      activeUsers: 892,
      vibeScore: 8.9,
      alerts: 2,
      fairPriceST: 2500,
      currency: "PHP",
      newReports24h: 98,
      topRatedVenues: 28,
      temperature: 31,
      internetSpeed: 78,
      airQuality: 40
    },
    badges: ["Best GFE", "Walkable"],
    trending: true,
    image: "/placeholder.jpg",
    region: "asia",
    temperature: "warm",
    cost: "cheap"
  },
  {
    slug: "manila",
    name: "Manila",
    country: "Philippines",
    flag: "🇵🇭",
    description: "Capital with hidden gems",
    mongerRank: 4,
    stats: {
      venues: 98,
      activeUsers: 423,
      vibeScore: 7.8,
      alerts: 0,
      fairPriceST: 3000,
      currency: "PHP",
      newReports24h: 45,
      topRatedVenues: 12,
      temperature: 30,
      internetSpeed: 82,
      airQuality: 50
    },
    badges: ["Emerging"],
    comingSoon: true,
    image: "/placeholder.jpg",
    region: "asia",
    temperature: "warm",
    cost: "mid"
  },
  {
    slug: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    flag: "🇮🇩",
    description: "Emerging scene for veterans",
    mongerRank: 5,
    stats: {
      venues: 76,
      activeUsers: 234,
      vibeScore: 7.5,
      alerts: 0,
      fairPriceST: 80,
      currency: "USD",
      newReports24h: 23,
      topRatedVenues: 8,
      temperature: 32,
      internetSpeed: 75,
      airQuality: 65
    },
    badges: ["Under the Radar"],
    comingSoon: true,
    image: "/placeholder.jpg",
    region: "asia",
    temperature: "warm",
    cost: "cheap"
  },
  {
    slug: "phnom-penh",
    name: "Phnom Penh",
    country: "Cambodia",
    flag: "🇰🇭",
    description: "Wild west of Southeast Asia",
    mongerRank: 6,
    stats: {
      venues: 89,
      activeUsers: 567,
      vibeScore: 8.1,
      alerts: 1,
      fairPriceST: 40,
      currency: "USD",
      newReports24h: 67,
      topRatedVenues: 15,
      temperature: 34,
      internetSpeed: 70,
      airQuality: 45
    },
    badges: ["Anything Goes"],
    comingSoon: true,
    image: "/placeholder.jpg",
    region: "asia",
    temperature: "warm",
    cost: "cheap"
  },
  // Additional cities to fill the grid
  {
    slug: "dubai",
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    description: "Luxury scene with high-end experiences",
    mongerRank: 7,
    stats: {
      venues: 45,
      activeUsers: 234,
      vibeScore: 7.9,
      alerts: 0,
      fairPriceST: 500,
      currency: "USD",
      newReports24h: 32,
      topRatedVenues: 12,
      temperature: 35,
      internetSpeed: 98,
      airQuality: 30
    },
    badges: ["Luxury", "Discrete"],
    comingSoon: true,
    image: "/dubai-skyline-burj-khalifa.png",
    region: "middle-east",
    temperature: "warm",
    cost: "expensive"
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    description: "European gem with growing scene",
    mongerRank: 8,
    stats: {
      venues: 56,
      activeUsers: 189,
      vibeScore: 7.2,
      alerts: 0,
      fairPriceST: 150,
      currency: "EUR",
      newReports24h: 23,
      topRatedVenues: 8,
      temperature: 24,
      internetSpeed: 92,
      airQuality: 25
    },
    badges: ["Euro Scene", "Safe"],
    comingSoon: true,
    image: "/lisbon-colorful-buildings-and-trams.jpg",
    region: "europe",
    temperature: "mild",
    cost: "mid"
  },
  {
    slug: "berlin",
    name: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    description: "Alternative scene capital",
    mongerRank: 9,
    stats: {
      venues: 78,
      activeUsers: 456,
      vibeScore: 8.0,
      alerts: 0,
      fairPriceST: 200,
      currency: "EUR",
      newReports24h: 45,
      topRatedVenues: 15,
      temperature: 18,
      internetSpeed: 95,
      airQuality: 20
    },
    badges: ["Alternative", "Liberal"],
    comingSoon: true,
    image: "/berlin-brandenburg-gate-and-modern-architecture.jpg",
    region: "europe",
    temperature: "mild",
    cost: "mid"
  }
];

export default function HomePage() {
  const { data: session } = useSession();
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    temperature: ["warm"],
    region: ["asia"],
  });
  
  const isPaid = session?.user?.isPaid;

  const handleUnlockFeature = (feature: string) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };

  // Filter cities based on active filters
  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      // Temperature filter
      if (activeFilters.temperature?.length > 0) {
        if (!activeFilters.temperature.includes(city.temperature)) {
          return false;
        }
      }

      // Region filter
      if (activeFilters.region?.length > 0) {
        if (!activeFilters.region.includes(city.region)) {
          return false;
        }
      }

      // Cost filter
      if (activeFilters.cost?.length > 0) {
        if (!activeFilters.cost.includes(city.cost)) {
          return false;
        }
      }

      return true;
    });
  }, [activeFilters]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="ml-2 text-lg font-semibold text-white">MongerMaps</span>
              </div>
              <nav className="hidden md:flex items-center space-x-4 text-sm">
                <Link href="/" className="text-gray-300 hover:text-white">
                  Cities
                </Link>
                <Link href="/global-rankings" className="text-gray-300 hover:text-white">
                  Rankings
                </Link>
                <Link href="/make-money" className="text-gray-300 hover:text-white">
                  Earn
                </Link>
                <Link href="/intel-database" className="text-gray-300 hover:text-white">
                  Intel
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-xs text-gray-300 hover:text-white hover:bg-gray-700">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-gray-300 hover:text-white hover:bg-gray-700">
                Sort: Overall <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              {!isPaid && (
                <Button 
                  size="sm" 
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                  onClick={() => handleUnlockFeature("premium access")}
                >
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 py-4">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-sm border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <SearchIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex gap-4">
          {/* Sidebar Filters */}
          <SidebarFilters 
            onFilterChange={setActiveFilters}
            className="hidden lg:block"
          />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-white">Best cities for mongering worldwide</h1>
              <div className="text-xs text-gray-400">Showing {filteredCities.length} of {cities.length} cities</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredCities.map((city) => (
                <CityCard
                  key={city.slug}
                  {...city}
                  isPaid={isPaid}
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-6">
              <Button
                variant="outline"
                size="sm"
                className="text-sm bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Load more cities
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-64 flex-shrink-0 hidden xl:block">
            {/* Trending Cities */}
            <div className="bg-gray-800 rounded border border-gray-700 p-4 mb-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Trending Now
              </h4>
              <div className="space-y-2">
                {filteredCities.slice(0, 4).map((city) => (
                  <Link 
                    key={city.slug}
                    href={city.comingSoon ? "#" : `/city/${city.slug}`}
                    className="flex items-center space-x-2 p-1 hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded overflow-hidden bg-gray-600">
                      <span className="text-lg flex items-center justify-center h-full">
                        {city.flag}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-xs text-white">{city.name}</p>
                      <p className="text-xs text-gray-400">
                        {isPaid ? `$${city.stats.fairPriceST}/mo` : "$???/mo"}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">#{city.mongerRank}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Box */}
            <div className="bg-gray-800 rounded border border-gray-700 p-4 mb-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Community
              </h4>
              <div className="grid grid-cols-8 gap-1 mb-3">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-gray-600 rounded-full" />
                ))}
              </div>
              <p className="text-xs text-gray-400 mb-3">2,847+ mongers worldwide</p>
              {!isPaid && (
                <Button 
                  size="sm" 
                  className="w-full bg-red-500 hover:bg-red-600 text-xs"
                  onClick={() => handleUnlockFeature("community access")}
                >
                  Join community
                </Button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded border border-gray-700 p-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Link href="/make-money" className="block">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-xs justify-start border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <DollarSign className="h-3 w-3 mr-2" />
                    Make Money
                  </Button>
                </Link>
                <Link href="/intel-database" className="block">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-xs justify-start border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Target className="h-3 w-3 mr-2" />
                    Intel Database
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={paywallFeature}
      />
    </div>
  );
}