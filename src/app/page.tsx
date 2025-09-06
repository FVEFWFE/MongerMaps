"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Shell } from "~/components/shell";
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
  Search as SearchIcon,
  Filter
} from "lucide-react";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { PaywallModal } from "~/components/paywall-modal";
import { SidebarFilters } from "~/components/sidebar-filters";
import { CityCard } from "~/components/city-card";
import { CityModal } from "~/components/city-modal";
import { ChatWidget } from "~/components/chat-widget";

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
    image: "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "warm",
    cost: "cheap",
    // New filter attributes
    women: {
      attractiveness: "high",
      easyToFind: true,
      tattooPrevalence: "low",
      personality: "friendly"
    },
    culture: "liberal",
    infrastructure: {
      hotelQuality: "good",
      internetCategory: "fast-internet",
      environment: "urban"
    },
    timezone: "tz-asia",
    safety: "safe",
    features: ["nightlife", "24hr", "value", "beach", "legal"]
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
    image: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "warm",
    cost: "cheap",
    women: {
      attractiveness: "high",
      easyToFind: true,
      tattooPrevalence: "low",
      personality: "friendly"
    },
    culture: "liberal",
    infrastructure: {
      hotelQuality: "luxury",
      internetCategory: "ultra-internet",
      environment: "urban"
    },
    timezone: "tz-asia",
    safety: "safe",
    features: ["nightlife", "24hr", "value", "legal", "english"]
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "warm",
    cost: "cheap",
    women: {
      attractiveness: "high",
      easyToFind: true,
      tattooPrevalence: "low",
      personality: "friendly"
    },
    culture: "traditional",
    infrastructure: {
      hotelQuality: "good",
      internetCategory: "fast-internet",
      environment: "urban"
    },
    timezone: "tz-asia",
    safety: "safe",
    features: ["nightlife", "walkable", "value", "legal", "english"]
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "warm",
    cost: "mid",
    women: {
      attractiveness: "high",
      easyToFind: true,
      tattooPrevalence: "moderate",
      personality: "professional"
    },
    culture: "modern",
    infrastructure: {
      hotelQuality: "good",
      internetCategory: "fast-internet",
      environment: "urban"
    },
    timezone: "tz-asia",
    safety: "moderate",
    features: ["nightlife", "value", "english"]
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "warm",
    cost: "cheap",
    women: {
      attractiveness: "moderate",
      easyToFind: false,
      tattooPrevalence: "low",
      personality: "traditional"
    },
    culture: "conservative",
    infrastructure: {
      hotelQuality: "good",
      internetCategory: "fast-internet",
      environment: "urban"
    },
    timezone: "tz-asia",
    safety: "moderate",
    features: ["value"]
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "warm",
    cost: "cheap",
    women: {
      attractiveness: "high",
      easyToFind: true,
      tattooPrevalence: "moderate",
      personality: "friendly"
    },
    culture: "liberal",
    infrastructure: {
      hotelQuality: "moderate",
      internetCategory: "moderate",
      environment: "urban"
    },
    timezone: "tz-asia",
    safety: "moderate",
    features: ["nightlife", "value", "cannabis"]
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
    image: "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=600&fit=crop",
    region: "middle-east",
    temperature: "warm",
    cost: "expensive",
    women: {
      attractiveness: "high",
      easyToFind: false,
      tattooPrevalence: "low",
      personality: "professional"
    },
    culture: "conservative",
    infrastructure: {
      hotelQuality: "luxury",
      internetCategory: "ultra-internet",
      environment: "urban"
    },
    timezone: "tz-europe",
    safety: "safe",
    features: ["luxury-hotels"]
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
    image: "https://images.unsplash.com/photo-1485199692108-c3b5069de6a0?w=800&h=600&fit=crop",
    region: "europe",
    temperature: "mild",
    cost: "mid",
    women: {
      attractiveness: "high",
      easyToFind: false,
      tattooPrevalence: "moderate",
      personality: "friendly"
    },
    culture: "liberal",
    infrastructure: {
      hotelQuality: "good",
      internetCategory: "ultra-internet",
      environment: "beautiful"
    },
    timezone: "tz-europe",
    safety: "safe",
    features: ["beach", "safe", "beautiful-env"]
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
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop",
    region: "europe",
    temperature: "mild",
    cost: "mid",
    women: {
      attractiveness: "high",
      easyToFind: true,
      tattooPrevalence: "high",
      personality: "professional"
    },
    culture: "liberal",
    infrastructure: {
      hotelQuality: "good",
      internetCategory: "ultra-internet",
      environment: "urban"
    },
    timezone: "tz-europe",
    safety: "safe",
    features: ["nightlife", "lgbtq", "cannabis", "24hr"]
  }
];

export default function HomePage() {
  const { data: session } = useSession();
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("");
  const [selectedCity, setSelectedCity] = useState<typeof cities[0] | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
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
        // Map filter values to city cost values
        const costMap = {
          'budget': 'cheap',  // <$1K/mo maps to cheap
          'cheap': 'cheap',   // <$2K/mo maps to cheap
          'mid': 'mid'        // <$3K/mo maps to mid
        };
        
        const matchesCost = activeFilters.cost.some(filterCost => {
          const mappedCost = costMap[filterCost] || filterCost;
          return city.cost === mappedCost || 
                 (filterCost === 'budget' && city.cost === 'cheap') ||
                 (filterCost === 'cheap' && ['cheap', 'mid'].includes(city.cost)) ||
                 (filterCost === 'mid' && ['cheap', 'mid', 'expensive'].includes(city.cost));
        });
        
        if (!matchesCost) return false;
      }

      // Essential filters
      if (activeFilters.essential?.length > 0) {
        for (const filter of activeFilters.essential) {
          if (filter === "safe" && city.safety !== "safe") return false;
          if (filter === "internet" && city.stats?.internetSpeed < 50) return false;
          if (filter === "nightlife" && !city.features?.includes("nightlife")) return false;
          if (filter === "24hr" && !city.features?.includes("24hr")) return false;
          if (filter === "english" && !city.features?.includes("english")) return false;
          if (filter === "walkable" && !city.features?.includes("walkable")) return false;
        }
      }

      // Features filters
      if (activeFilters.features?.length > 0) {
        for (const filter of activeFilters.features) {
          if (!city.features?.includes(filter)) return false;
        }
      }

      // Women filters
      if (activeFilters.women?.length > 0) {
        for (const filter of activeFilters.women) {
          if (filter === "attractive" && city.women?.attractiveness !== "high") return false;
          if (filter === "easy-find" && !city.women?.easyToFind) return false;
          if (filter === "low-tattoos" && city.women?.tattooPrevalence !== "low") return false;
          if (filter === "high-tattoos" && city.women?.tattooPrevalence !== "high") return false;
          if (filter === "friendly" && city.women?.personality !== "friendly") return false;
          if (filter === "professional" && city.women?.personality !== "professional") return false;
        }
      }

      // Culture filters
      if (activeFilters.culture?.length > 0) {
        if (!activeFilters.culture.includes(city.culture)) return false;
      }

      // Infrastructure filters
      if (activeFilters.infrastructure?.length > 0) {
        for (const filter of activeFilters.infrastructure) {
          if (filter === "fast-internet" && city.stats?.internetSpeed < 50) return false;
          if (filter === "ultra-internet" && city.stats?.internetSpeed < 100) return false;
          if (filter === "luxury-hotels" && city.infrastructure?.hotelQuality !== "luxury") return false;
          if (filter === "good-hotels" && !["good", "luxury"].includes(city.infrastructure?.hotelQuality)) return false;
          if (filter === "beautiful-env" && city.infrastructure?.environment !== "beautiful") return false;
          if (filter === "urban" && city.infrastructure?.environment !== "urban") return false;
        }
      }

      // Timezone filters
      if (activeFilters.timezone?.length > 0) {
        if (!activeFilters.timezone.includes(city.timezone)) return false;
      }

      // Vibe filters (single select)
      if (activeFilters.vibe?.length > 0) {
        // Add vibe logic if needed
      }

      // Girl Quality & Availability filters
      const girlFilters = activeFilters['girl-quality-&-availability'];
      if (girlFilters?.length > 0) {
        for (const filter of girlFilters) {
          if (filter === 'stunner-density' && city.women?.attractiveness !== 'high') return false;
          if (filter === 'gfe-available' && !city.features?.includes('gfe')) return false;
          if (filter === 'english-girls' && !city.features?.includes('english')) return false;
          if (filter === 'natural' && city.women?.tattooPrevalence === 'high') return false;
          if (filter === 'freelancer' && !city.features?.includes('freelancer')) return false;
          if (filter === 'bar-girls' && !city.features?.includes('bar-girls')) return false;
        }
      }

      // Value for Money filters
      const valueFilters = activeFilters['value-for-money'];
      if (valueFilters?.length > 0) {
        for (const filter of valueFilters) {
          if (filter === 'bang-buck' && !city.features?.includes('value')) return false;
          if (filter === 'transparent' && !city.features?.includes('transparent')) return false;
          if (filter === 'no-hidden' && !city.features?.includes('no-hidden')) return false;
          if (filter === 'st-focus' && !city.features?.includes('st-focus')) return false;
          if (filter === 'lt-friendly' && !city.features?.includes('lt-friendly')) return false;
        }
      }

      // Scene Vibe filters
      const sceneFilters = activeFilters['scene-vibe'];
      if (sceneFilters?.length > 0) {
        for (const filter of sceneFilters) {
          if (filter === 'party' && !city.features?.includes('party')) return false;
          if (filter === 'relaxed' && !city.features?.includes('relaxed')) return false;
          if (filter === 'newbie-friendly' && !city.features?.includes('newbie-friendly')) return false;
          if (filter === 'no-starfish' && !city.features?.includes('no-starfish')) return false;
        }
      }

      // Logistics & Comfort filters
      const logisticsFilters = activeFilters['logistics-&-comfort'];
      if (logisticsFilters?.length > 0) {
        for (const filter of logisticsFilters) {
          if (filter === 'guest-friendly' && !city.features?.includes('guest-friendly')) return false;
          if (filter === 'safe' && city.safety !== 'safe') return false;
          if (filter === 'walkable' && !city.features?.includes('walkable')) return false;
          if (filter === 'no-joiner' && !city.features?.includes('no-joiner')) return false;
        }
      }

      // Special Interests filters
      const specialFilters = activeFilters['special-interests'];
      if (specialFilters?.length > 0) {
        for (const filter of specialFilters) {
          if (filter === 'legal' && !city.features?.includes('legal')) return false;
          if (filter === 'cannabis' && !city.features?.includes('cannabis')) return false;
          if (filter === 'ladyboy' && !city.features?.includes('ladyboy')) return false;
          if (filter === 'milf' && !city.features?.includes('milf')) return false;
          if (filter === 'soapy' && !city.features?.includes('soapy')) return false;
        }
      }

      // Risk & Safety filters
      const riskFilters = activeFilters['risk-&-safety'];
      if (riskFilters?.length > 0) {
        for (const filter of riskFilters) {
          if (filter === 'scam-free' && !city.features?.includes('scam-free')) return false;
          if (filter === 'no-violence' && city.safety !== 'safe') return false;
          if (filter === 'virgin-safe' && !city.features?.includes('newbie-friendly')) return false;
          if (filter === 'no-spiking' && !city.features?.includes('no-spiking')) return false;
        }
      }

      // Social & Dating filters
      const socialFilters = activeFilters['social-&-dating'];
      if (socialFilters?.length > 0) {
        for (const filter of socialFilters) {
          if (filter === 'tinder-works' && !city.features?.includes('tinder-works')) return false;
          if (filter === 'sugar-scene' && !city.features?.includes('sugar-scene')) return false;
          if (filter === 'expat-community' && !city.features?.includes('expat-community')) return false;
        }
      }

      // Time & Season filters
      const timeFilters = activeFilters['time-&-season'];
      if (timeFilters?.length > 0) {
        for (const filter of timeFilters) {
          if (filter === 'best-now' && !city.features?.includes('best-now')) return false;
          if (filter === 'visa-runs' && !city.features?.includes('visa-runs')) return false;
          if (filter === 'weather-good' && !city.features?.includes('weather-good')) return false;
        }
      }

      return true;
    });
  }, [activeFilters]);

  return (
    <Shell>
      <div className="flex gap-6">
        {/* Sidebar Filters - Extended to top */}
        <SidebarFilters 
          onFilterChange={setActiveFilters}
          className="hidden lg:block flex-shrink-0 h-screen sticky top-0"
        />

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Cities</h1>
              <p className="text-muted-foreground">Best cities for mongering worldwide</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                Sort: Overall <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

            <div className="text-sm text-muted-foreground mb-4">
              Showing {filteredCities.length} of {cities.length} cities
            </div>

            {/* Responsive Grid: 6 cols on 4K, 5 on 2K, 4 on XL, 3 on LG, 2 on MD, 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2560px]:grid-cols-6 gap-4">
              {filteredCities.map((city) => (
                <CityCard
                  key={city.slug}
                  {...city}
                  isPaid={isPaid}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityModal(true);
                  }}
                />
              ))}
            </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="sm"
            >
              Load more cities
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 flex-shrink-0 hidden 2xl:block">
            {/* Trending Cities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Trending Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredCities.slice(0, 4).map((city) => (
                  <Link 
                    key={city.slug}
                    href={city.comingSoon ? "#" : `/city/${city.slug}`}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 rounded overflow-hidden bg-muted flex items-center justify-center">
                      <span className="text-lg">
                        {city.flag}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{city.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isPaid ? `$${city.stats.fairPriceST}/mo` : "$???/mo"}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">#{city.mongerRank}</div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Featured Mongermap Members */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Featured Mongermap Members</CardTitle>
              </CardHeader>
              <CardContent>
                {/* YouTube Video Embeds */}
                <div className="space-y-3 mb-3">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Featured Member Video 1"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Featured Member Video 2"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">2,847+ mongers worldwide</p>
                {!isPaid && (
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleUnlockFeature("community access")}
                  >
                    Join community
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/make-money" className="block">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start"
                  >
                    <DollarSign className="h-3 w-3 mr-2" />
                    Make Money
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={paywallFeature}
      />

      <CityModal
        isOpen={showCityModal}
        onClose={() => setShowCityModal(false)}
        city={selectedCity}
        isPaid={isPaid}
      />

      <ChatWidget 
        isPaid={isPaid}
        currentCity={selectedCity?.slug || "all"}
      />
    </Shell>
  );
}