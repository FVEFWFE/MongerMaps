"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { FlagIcon } from "~/components/flag-icon";
import { 
  Heart, 
  Wifi, 
  ThermometerSun, 
  TrendingUp,
  AlertTriangle,
  DollarSign
} from "lucide-react";

interface CityStats {
  venues: number;
  activeUsers: number;
  vibeScore: number;
  alerts: number;
  fairPriceST: number;
  currency: string;
  newReports24h: number;
  topRatedVenues: number;
  temperature?: number;
  internetSpeed?: number;
  airQuality?: number;
}

interface CityCardProps {
  slug: string;
  name: string;
  country: string;
  flag: string;
  description: string;
  mongerRank: number;
  stats: CityStats;
  badges?: string[];
  trending?: boolean;
  comingSoon?: boolean;
  image?: string;
  isPaid?: boolean;
  onClick?: () => void;
}

export function CityCard({
  slug,
  name,
  country,
  flag,
  description,
  mongerRank,
  stats,
  badges = [],
  trending = false,
  comingSoon = false,
  image,
  isPaid = false,
  onClick
}: CityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Calculate quality scores
  const overallScore = Math.min(100, Math.round(
    (stats.vibeScore * 10) + 
    (stats.topRatedVenues / stats.venues * 20) - 
    (stats.alerts * 5)
  ));
  
  const costScore = stats.fairPriceST < 2000 ? 90 : stats.fairPriceST < 3000 ? 70 : 50;
  const internetScore = stats.internetSpeed || 85;
  const safetyScore = 100 - (stats.alerts * 10);
  const activityScore = Math.min(100, (stats.newReports24h / 10));

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "USD") return `$${amount}`;
    return `${amount} ${currency}`;
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all cursor-zoom-in cursor-target group",
        comingSoon && "opacity-75",
        "hover:shadow-xl hover:scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="block"
        onClick={(e) => {
          e.preventDefault();
          if (onClick && !comingSoon) {
            onClick();
          }
        }}
      >
        {/* Image Container - Changed to rectangular aspect ratio */}
        <div className="relative h-64 overflow-hidden">
          {/* City Image */}
          <div className="absolute inset-0">
            {image ? (
              <Image
                src={image}
                alt={`${name} skyline`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800" />
            )}
          </div>

          {/* Hover Overlay with Scores */}
          <div 
            className={cn(
              "absolute inset-0 bg-black/85 transition-all duration-300 flex flex-col justify-center px-6 space-y-3",
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">Overall</span>
                <div className="flex items-center gap-3">
                  <div className={cn("h-3 w-32 rounded-full bg-gray-700")}>
                    <div 
                      className={cn("h-full rounded-full transition-all", getScoreColor(overallScore))}
                      style={{ width: `${overallScore}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm w-8 text-right">{overallScore}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">Cost</span>
                <div className="flex items-center gap-3">
                  <div className={cn("h-3 w-32 rounded-full bg-gray-700")}>
                    <div 
                      className={cn("h-full rounded-full transition-all", getScoreColor(costScore))}
                      style={{ width: `${costScore}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm w-8 text-right">{costScore}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">Internet</span>
                <div className="flex items-center gap-3">
                  <div className={cn("h-3 w-32 rounded-full bg-gray-700")}>
                    <div 
                      className={cn("h-full rounded-full transition-all", getScoreColor(internetScore))}
                      style={{ width: `${internetScore}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm w-8 text-right">{internetScore}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">Safety</span>
                <div className="flex items-center gap-3">
                  <div className={cn("h-3 w-32 rounded-full bg-gray-700")}>
                    <div 
                      className={cn("h-full rounded-full transition-all", getScoreColor(safetyScore))}
                      style={{ width: `${safetyScore}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm w-8 text-right">{safetyScore}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">Activity</span>
                <div className="flex items-center gap-3">
                  <div className={cn("h-3 w-32 rounded-full bg-gray-700")}>
                    <div 
                      className={cn("h-full rounded-full transition-all", getScoreColor(activityScore))}
                      style={{ width: `${activityScore}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm w-8 text-right">{activityScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Overlays - Hide on hover */}
          <div className={cn(
            "absolute top-2 left-2 z-10 transition-opacity duration-300",
            isHovered ? "opacity-0" : "opacity-100"
          )}>
            <Badge 
              variant="secondary" 
              className="bg-black/70 text-white text-xs px-2 py-0.5 backdrop-blur-sm"
            >
              #{mongerRank}
            </Badge>
          </div>

          <div className={cn(
            "absolute top-2 right-2 z-10 flex items-center gap-1 transition-opacity duration-300",
            isHovered ? "opacity-0" : "opacity-100"
          )}>
            {stats.internetSpeed && (
              <Badge 
                variant="secondary" 
                className="bg-black/70 text-white text-xs px-2 py-0.5 backdrop-blur-sm flex items-center gap-1"
              >
                <Wifi className="h-3 w-3" />
                {stats.internetSpeed}
              </Badge>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              className="bg-black/70 hover:bg-black/90 p-1 h-6 w-6 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorited(!isFavorited);
              }}
            >
              <Heart className={cn("h-3 w-3", isFavorited && "fill-red-500 text-red-500")} />
            </Button>
          </div>

          {/* Center Overlay - City Name (hide on hover) */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            isHovered ? "opacity-0" : "opacity-100"
          )}>
            <div className="text-center">
              <h3 className="text-white font-bold text-xl drop-shadow-lg">
                {name}
              </h3>
              <p className="text-white/90 text-sm drop-shadow-lg flex items-center justify-center gap-1">
                <FlagIcon country={country} className="w-6 h-4" />
                {country}
              </p>
            </div>
          </div>

          {/* Bottom Overlays - Hide on hover */}
          <div className={cn(
            "absolute bottom-2 left-2 right-2 flex justify-between items-end transition-opacity duration-300",
            isHovered ? "opacity-0" : "opacity-100"
          )}>
            <div className="flex items-center gap-2">
              {stats.temperature && (
                <Badge 
                  variant="secondary" 
                  className="bg-black/70 text-white text-xs px-2 py-0.5 backdrop-blur-sm flex items-center gap-1"
                >
                  <ThermometerSun className="h-3 w-3" />
                  {stats.temperature}°C
                </Badge>
              )}
              {stats.airQuality && (
                <Badge 
                  variant="secondary" 
                  className="bg-black/70 text-white text-xs px-2 py-0.5 backdrop-blur-sm"
                >
                  AQI {stats.airQuality}
                </Badge>
              )}
            </div>
            
            <Badge 
              variant="secondary" 
              className="bg-black/70 text-white text-xs px-2 py-0.5 backdrop-blur-sm"
            >
              {isPaid ? (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {formatCurrency(stats.fairPriceST, stats.currency)}/mo
                </span>
              ) : (
                <span className="flex items-center gap-1 blur-sm">
                  <DollarSign className="h-3 w-3" />
                  ???/mo
                </span>
              )}
            </Badge>
          </div>

          {/* Trending Badge - Hide on hover */}
          {trending && (
            <div className={cn(
              "absolute top-12 left-2 transition-opacity duration-300",
              isHovered ? "opacity-0" : "opacity-100"
            )}>
              <Badge className="bg-red-500 text-white text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                HOT
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}