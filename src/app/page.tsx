"use client";

import Link from "next/link";
import { useState } from "react";
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
  Zap
} from "lucide-react";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { PaywallModal } from "~/components/paywall-modal";

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
      topRatedVenues: 42
    },
    badges: ["Most Active", "Best Value", "24/7 Action"],
    trending: true
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
      topRatedVenues: 31
    },
    badges: ["Diverse Scene", "High-End Options"],
    trending: false
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
      topRatedVenues: 28
    },
    badges: ["Best GFE", "Walkable"],
    trending: true
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
      topRatedVenues: 12
    },
    badges: ["Emerging"],
    comingSoon: true
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
      fairPriceST: 1200000,
      currency: "IDR",
      newReports24h: 23,
      topRatedVenues: 8
    },
    badges: ["Under the Radar"],
    comingSoon: true
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
      topRatedVenues: 15
    },
    badges: ["Anything Goes"],
    comingSoon: true
  }
];

export default function HomePage() {
  const { data: session } = useSession();
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("");
  
  const isPaid = session?.user?.isPaid;

  const handleUnlockFeature = (feature: string) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };

  // Calculate dynamic Monger Score
  const getMongerScore = (stats: typeof cities[0]["stats"]) => {
    const score = (
      (stats.vibeScore * 20) +
      (stats.activeUsers / 50) +
      (stats.topRatedVenues / 2) +
      (stats.newReports24h / 10) -
      (stats.alerts * 10)
    );
    return Math.min(100, Math.round(score));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-zinc-900 to-black border-b border-zinc-800">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
              <Sparkles className="h-3 w-3 mr-1" />
              Live Intelligence Network
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              MongerMaps
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time intelligence for Southeast Asia's hottest destinations.
              <br />
              <span className="text-yellow-500">Find the gems. Avoid the rip-offs.</span>
            </p>
            
            {/* Live Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">2,847</div>
                <div className="text-xs text-muted-foreground">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">842</div>
                <div className="text-xs text-muted-foreground">Live Reports Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">1,247</div>
                <div className="text-xs text-muted-foreground">Verified Venues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">12</div>
                <div className="text-xs text-muted-foreground">Active Scam Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Cities by Monger Rank™</h2>
          <Badge variant="outline" className="text-sm">
            <Globe className="h-3 w-3 mr-1" />
            Updated Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => {
            const mongerScore = getMongerScore(city.stats);
            
            return (
              <Card 
                key={city.slug}
                className={cn(
                  "relative overflow-hidden transition-all hover:shadow-xl",
                  city.comingSoon && "opacity-75",
                  city.trending && "ring-2 ring-yellow-500/50"
                )}
              >
                {/* Monger Rank Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge 
                    className={cn(
                      "text-lg font-bold px-3 py-1",
                      city.mongerRank === 1 && "bg-yellow-500 text-black",
                      city.mongerRank === 2 && "bg-gray-400 text-black",
                      city.mongerRank === 3 && "bg-orange-600"
                    )}
                  >
                    #{city.mongerRank}
                  </Badge>
                </div>

                {city.trending && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-red-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      HOT
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="text-3xl">{city.flag}</span>
                    {city.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{city.country}</p>
                  <p className="text-sm mt-2">{city.description}</p>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {city.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Monger Score */}
                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <span className="text-sm font-medium">Monger Score™</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(mongerScore / 20)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-zinc-700"
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-bold">{mongerScore}</span>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{city.stats.venues} venues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{city.stats.activeUsers.toLocaleString()} active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Vibe: {city.stats.vibeScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn(
                        "h-4 w-4",
                        city.stats.alerts > 0 ? "text-red-500" : "text-green-500"
                      )} />
                      <span className={cn(
                        city.stats.alerts > 0 ? "text-red-500" : "text-green-500"
                      )}>
                        {city.stats.alerts} alerts
                      </span>
                    </div>
                  </div>

                  {/* Live Activity */}
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-500 font-medium">Live Activity</span>
                      <Badge variant="outline" className="text-xs border-green-500/50 text-green-500">
                        <Zap className="h-3 w-3 mr-1" />
                        {city.stats.newReports24h} new
                      </Badge>
                    </div>
                    {isPaid ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        Fair Price ST: {city.stats.fairPriceST} {city.stats.currency}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1 blur-sm select-none">
                        Fair Price ST: ??? {city.stats.currency}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  {city.comingSoon ? (
                    <Button className="w-full" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Link href={`/city/${city.slug}`} className="block">
                      <Button className="w-full group">
                        Enter {city.name}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTAs */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Make Money Mongering CTA */}
          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                Make Money Mongering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Turn your mongering adventures into recurring income. 
                Learn how veterans are earning $5k+/month through field reports and referrals.
              </p>
              <Link href="/make-money">
                <Button variant="outline" className="w-full border-yellow-500/50 hover:bg-yellow-500/10">
                  Learn More
                  <Trophy className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Upgrade CTA */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Unlock Full Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get real-time prices, venue heat maps, scam alerts, and access to our veteran community.
                Stop gambling, start winning.
              </p>
              {isPaid ? (
                <Badge className="w-full justify-center py-2 bg-green-500/20 text-green-500 border-green-500/50">
                  You have full access
                </Badge>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => handleUnlockFeature("full platform access")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Get Premium Access
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12 pb-8">
          <p className="text-sm text-muted-foreground">
            Trusted by 2,847+ savvy mongers • 
            <span className="text-yellow-500"> 50,000+ verified reports</span> • 
            Veteran-owned & operated
          </p>
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