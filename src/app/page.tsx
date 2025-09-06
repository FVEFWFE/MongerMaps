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
  Filter,
  MessageCircle,
  Bot,
  UserPlus,
  Heart
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
          if (filter === 'no-ladyboy' && city.features?.includes('ladyboy')) return false;
          if (filter === 'minimal-tattoos' && city.women?.tattooPrevalence !== 'low') return false;
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
    <>
      <div className="flex h-screen">
        {/* Sidebar Filters - Full height from top */}
        <SidebarFilters 
          onFilterChange={setActiveFilters}
          className="hidden lg:block flex-shrink-0 h-screen sticky top-0"
        />
        
        {/* Shell wraps everything else */}
        <Shell>
          <div className="flex w-full">
            {/* Main Content Area with Right Sidebar */}
            <div className="flex-1 flex gap-6">
              {/* Content */}
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

                <div className="flex items-center justify-end mb-6">
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

                {/* Responsive Grid with Blur Paywall */}
                <div className="relative">
                  {/* Grid Container */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2560px]:grid-cols-6 gap-4">
                    {(() => {
                      // Define special cards for rightmost column
                      const specialCards = [
                        // 1. CamRiches.ai Ad
                        <Card key="ad-camriches" className="relative overflow-hidden transition-all cursor-zoom-in group hover:shadow-xl hover:scale-[1.02] h-full">
                          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white p-4">
                                <Bot className="h-12 w-12 mx-auto mb-3" />
                                <h3 className="text-xl font-bold mb-2">CamRiches.ai</h3>
                                <p className="text-sm opacity-90 mb-2">AI-Powered Cam Model Analytics</p>
                                <p className="text-xs opacity-75">Find the highest earning models</p>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-white/20 text-white">AD</Badge>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <Badge className="bg-black/70 text-white w-full justify-center">
                                Learn More →
                              </Badge>
                            </div>
                          </div>
                        </Card>,
                        
                        // 2. Featured Members
                        <Card key="featured-members" className="relative overflow-hidden transition-all cursor-zoom-in group hover:shadow-xl hover:scale-[1.02] h-full">
                          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white p-4">
                                <Users className="h-12 w-12 mx-auto mb-3" />
                                <h3 className="text-xl font-bold mb-2">Featured Members</h3>
                                <p className="text-sm opacity-90 mb-2">Learn from veteran mongers</p>
                                <p className="text-xs opacity-75">2,847+ members worldwide</p>
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <Badge className="bg-black/70 text-white w-full justify-center">
                                View Members →
                              </Badge>
                            </div>
                          </div>
                        </Card>,
                        
                        // 3. Underrated Location: Mombasa
                        <Card key="suggestion-mombasa" className="relative overflow-hidden transition-all cursor-zoom-in group hover:shadow-xl hover:scale-[1.02] h-full">
                          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-500 to-red-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white p-4">
                                <MapPin className="h-12 w-12 mx-auto mb-3" />
                                <h3 className="text-xl font-bold mb-2">Hidden Gem: Mombasa</h3>
                                <p className="text-sm opacity-90 mb-2">Underrated mongering paradise</p>
                                <p className="text-xs opacity-75">9.2/10 hotness • $30 ST</p>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-500 text-black">
                                <Star className="h-3 w-3 mr-1" />
                                Editor's Pick
                              </Badge>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <Badge className="bg-black/70 text-white w-full justify-center">
                                Explore Mombasa →
                              </Badge>
                            </div>
                          </div>
                        </Card>,
                        
                        // 4. Join Chat
                        <Card key="join-chat" className="relative overflow-hidden transition-all cursor-zoom-in group hover:shadow-xl hover:scale-[1.02] h-full">
                          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-green-500 to-teal-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white p-4">
                                <MessageCircle className="h-12 w-12 mx-auto mb-3" />
                                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                                <p className="text-sm opacity-90 mb-2">247 mongers online now</p>
                                <p className="text-xs opacity-75">Get real-time advice</p>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-400 text-black animate-pulse">
                                LIVE
                              </Badge>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <Button size="sm" className="w-full bg-white/20 hover:bg-white/30">
                                Join the Chat →
                              </Button>
                            </div>
                          </div>
                        </Card>,
                        
                        // 5. Affiliate Program
                        <Link href="/affiliate" key="affiliate-program">
                          <Card className="relative overflow-hidden transition-all cursor-pointer group hover:shadow-xl hover:scale-[1.02] h-full">
                            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white p-4">
                                  <DollarSign className="h-12 w-12 mx-auto mb-3" />
                                  <h3 className="text-xl font-bold mb-2">Earn 40% Commission</h3>
                                  <p className="text-sm opacity-90">Refer friends, get paid</p>
                                  <p className="text-xs mt-2 opacity-75">$127 avg per referral</p>
                                </div>
                              </div>
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-yellow-500 text-black">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Hot
                                </Badge>
                              </div>
                              <div className="absolute bottom-2 left-2 right-2">
                                <Badge className="bg-black/70 text-white w-full justify-center">
                                  Start Earning →
                                </Badge>
                              </div>
                            </div>
                          </Card>
                        </Link>,
                        
                        // 6. Guest-Friendly Hotels
                        <Card key="guest-hotels" className="relative overflow-hidden transition-all cursor-zoom-in group hover:shadow-xl hover:scale-[1.02] h-full">
                          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white p-4">
                                <div className="text-4xl mb-3">🏨</div>
                                <h3 className="text-xl font-bold mb-2">Guest-Friendly Hotels</h3>
                                <p className="text-sm opacity-90 mb-2">Never get cockblocked</p>
                                <p className="text-xs opacity-75">5000+ verified hotels</p>
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <Badge className="bg-black/70 text-white w-full justify-center">
                                Access Database →
                              </Badge>
                            </div>
                          </div>
                        </Card>,
                        
                        // 7. Scam Alerts
                        <Card key="scam-alerts" className="relative overflow-hidden transition-all cursor-zoom-in group hover:shadow-xl hover:scale-[1.02] h-full">
                          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-red-500 to-red-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white p-4">
                                <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
                                <h3 className="text-xl font-bold mb-2">Scam Alerts</h3>
                                <p className="text-sm opacity-90 mb-2">Real-time warnings</p>
                                <p className="text-xs opacity-75">147 active alerts</p>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-500 text-black animate-pulse">
                                LIVE
                              </Badge>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <Badge className="bg-black/70 text-white w-full justify-center">
                                View Alerts →
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ];

                      // Calculate grid columns based on screen size
                      const getColumnsForBreakpoint = () => {
                        if (typeof window !== 'undefined') {
                          if (window.innerWidth >= 2560) return 6;
                          if (window.innerWidth >= 1536) return 5;
                          if (window.innerWidth >= 1280) return 4;
                          if (window.innerWidth >= 1024) return 3;
                          if (window.innerWidth >= 768) return 2;
                        }
                        return 6; // Default to max columns for SSR
                      };

                      const columns = getColumnsForBreakpoint();
                      const gridItems = [];
                      let cityIndex = 0;
                      let specialCardIndex = 0;

                      // Build grid with special cards in rightmost column
                      for (let row = 0; row < Math.ceil((filteredCities.length + specialCards.length) / columns); row++) {
                        for (let col = 0; col < columns; col++) {
                          const position = row * columns + col;
                          
                          // Place special cards in rightmost column for first 7 rows
                          if (col === columns - 1 && row < 7 && specialCardIndex < specialCards.length) {
                            gridItems.push(specialCards[specialCardIndex]);
                            specialCardIndex++;
                          } else if (cityIndex < filteredCities.length) {
                            const city = filteredCities[cityIndex];
                            gridItems.push(
                              <CityCard
                                key={city.slug}
                                {...city}
                                isPaid={isPaid}
                                onClick={() => {
                                  setSelectedCity(city);
                                  setShowCityModal(true);
                                }}
                              />
                            );
                            cityIndex++;
                          }
                        }
                      }

                      return gridItems;
                    })()}
                  </div>
                  
                  {/* Blur Overlay - Only shows when filters are active, user is not paid, and there are many results */}
                  {Object.keys(activeFilters).length > 0 && !isPaid && filteredCities.length > 20 && (
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ top: '120rem' }}>
                      {/* Gradient blur effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background backdrop-blur-[2px]" />
                      
                      {/* Message overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6 bg-background/95 backdrop-blur-md rounded-lg border shadow-lg pointer-events-auto">
                          <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
                          <h3 className="text-lg font-semibold mb-2">
                            To see all {filteredCities.length} results
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Join MongerMaps for unlimited access
                          </p>
                          <Button 
                            onClick={() => {
                              setShowPaywall(true);
                              setPaywallFeature("filtered results");
                            }}
                            className="font-semibold"
                          >
                            Get Instant Access
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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

                {/* Trust Section */}
                <div className="mt-12 pt-8 border-t">
            <div className="text-center space-y-6">
              {/* Forum Hell Section */}
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="font-bold text-lg mb-3 text-destructive">The Cure to Forum Hell</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="text-left">
                    <p className="font-semibold text-sm mb-2">What You're Escaping:</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>❌ 500 pages of ISG for one useful tip</div>
                      <div>❌ Half the links dead. Info from 2019</div>
                      <div>❌ "No guests allowed sir" at 2am</div>
                      <div>❌ Same questions asked 1000 times</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm mb-2">What You're Getting:</p>
                    <div className="text-xs space-y-1">
                      <div className="text-primary">✅ All forums, one platform</div>
                      <div className="text-primary">✅ Organized by city & venue</div>
                      <div className="text-primary">✅ Real-time verified intel</div>
                      <div className="text-primary">✅ Instant search across 2.6M posts</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Built by mongers who were sick of the same bullshit you are.
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2.6M+</div>
                  <div className="text-xs text-muted-foreground">Field Reports Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">847</div>
                  <div className="text-xs text-muted-foreground">Cities Ranked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-xs text-muted-foreground">Active Venues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-xs text-muted-foreground">Real-Time Updates</div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="bg-primary/5 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="font-semibold mb-4">
                  Get the intel that veteran mongers pay thousands to learn the hard way.
                </p>
                <Button 
                  size="lg" 
                  className="font-semibold"
                  onClick={() => {
                    if (!isPaid) {
                      setShowPaywall(true);
                      setPaywallFeature("full access");
                    }
                  }}
                >
                  Join MongerMaps Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
                </div>
              </div>

            </div>
          </div>
        </Shell>
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
    </>
  );
}