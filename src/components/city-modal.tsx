"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { 
  MapPin, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Wifi, 
  ThermometerSun,
  AlertTriangle,
  Star,
  ArrowRight,
  Lock
} from "lucide-react";

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: {
    slug: string;
    name: string;
    country: string;
    flag: string;
    description: string;
    mongerRank: number;
    stats: {
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
    };
    badges?: string[];
    trending?: boolean;
    image?: string;
  } | null;
  isPaid?: boolean;
}

export function CityModal({ isOpen, onClose, city, isPaid = false }: CityModalProps) {
  if (!city) return null;

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "USD") return `$${amount}`;
    return `${amount} ${currency}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">{city.flag}</span>
            {city.name}, {city.country}
            <Badge className="ml-2 bg-red-500 text-white">#{city.mongerRank}</Badge>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {city.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left Column - Stats */}
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-white">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Venues</span>
                      <MapPin className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-xl font-bold text-white">{city.stats.venues}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Active Users</span>
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-xl font-bold text-white">{city.stats.activeUsers}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Vibe Score</span>
                      <Star className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-xl font-bold text-white">{city.stats.vibeScore}/10</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Fair Price</span>
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-xl font-bold text-white">
                      {isPaid ? formatCurrency(city.stats.fairPriceST, city.stats.currency) : "???"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-white">Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">New Reports (24h)</span>
                    <span className="text-white font-medium">{city.stats.newReports24h}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Top Rated Venues</span>
                    <span className="text-white font-medium">{city.stats.topRatedVenues}</span>
                  </div>
                  {city.stats.alerts > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Active Alerts</span>
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {city.stats.alerts}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Environment & Actions */}
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-white">Environment</h3>
                <div className="space-y-3">
                  {city.stats.temperature && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <ThermometerSun className="h-4 w-4" />
                        Temperature
                      </span>
                      <span className="text-white font-medium">{city.stats.temperature}°C</span>
                    </div>
                  )}
                  {city.stats.internetSpeed && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Internet Speed
                      </span>
                      <span className="text-white font-medium">{city.stats.internetSpeed} Mbps</span>
                    </div>
                  )}
                  {city.stats.airQuality && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Air Quality Index</span>
                      <span className="text-white font-medium">AQI {city.stats.airQuality}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {city.badges && city.badges.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3 text-white">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {city.badges.map((badge, index) => (
                      <Badge key={index} className="bg-gray-700 text-white">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {isPaid ? (
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => window.location.href = `/city/${city.slug}`}
                >
                  View Full City Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                    disabled
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    City Guide Locked
                  </Button>
                  <Button 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => window.location.href = '/upgrade'}
                  >
                    Unlock Premium Access
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}