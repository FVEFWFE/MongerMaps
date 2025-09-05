"use client";

import Link from "next/link";
import { Shell } from "~/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { MapPin, Users, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { api } from "~/trpc/react";

const cities = [
  {
    slug: "pattaya",
    name: "Pattaya",
    country: "Thailand",
    description: "Beach resort capital of mongering",
    stats: {
      venues: 247,
      activeUsers: 1843,
      vibeScore: 9.2,
      alerts: 3
    }
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    country: "Thailand", 
    description: "Massive city with diverse options",
    stats: {
      venues: 189,
      activeUsers: 1254,
      vibeScore: 8.7,
      alerts: 1
    }
  },
  {
    slug: "angeles",
    name: "Angeles City",
    country: "Philippines",
    description: "Compact party zone near Manila",
    stats: {
      venues: 134,
      activeUsers: 892,
      vibeScore: 8.9,
      alerts: 2
    }
  },
  {
    slug: "manila",
    name: "Manila",
    country: "Philippines",
    description: "Capital with hidden gems",
    stats: {
      venues: 98,
      activeUsers: 423,
      vibeScore: 7.8,
      alerts: 0
    },
    comingSoon: true
  },
  {
    slug: "jakarta",
    name: "Jakarta", 
    country: "Indonesia",
    description: "Emerging scene for veterans",
    stats: {
      venues: 76,
      activeUsers: 234,
      vibeScore: 7.5,
      alerts: 0
    },
    comingSoon: true
  },
  {
    slug: "phnom-penh",
    name: "Phnom Penh",
    country: "Cambodia",
    description: "Wild west of Southeast Asia",
    stats: {
      venues: 89,
      activeUsers: 567,
      vibeScore: 8.1,
      alerts: 1
    },
    comingSoon: true
  }
];

export default function CitiesPage() {
  return (
    <Shell>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Cities</h1>
          <p className="text-muted-foreground mt-1">
            Real-time intelligence from Southeast Asia's hottest destinations
          </p>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Card 
              key={city.slug} 
              className={city.comingSoon ? "opacity-60" : "hover:shadow-lg transition-all"}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{city.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{city.country}</p>
                  </div>
                  {city.comingSoon ? (
                    <Badge variant="secondary">Coming Soon</Badge>
                  ) : city.stats.alerts > 0 ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {city.stats.alerts} Alert{city.stats.alerts > 1 ? 's' : ''}
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-500">
                      All Clear
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{city.description}</p>
                
                {/* City Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
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
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span>{city.stats.alerts} alerts</span>
                  </div>
                </div>

                {/* CTA Button */}
                {city.comingSoon ? (
                  <Button className="w-full" variant="outline" disabled>
                    Coming Soon
                  </Button>
                ) : (
                  <Link href={`/map/${city.slug}`} className="block">
                    <Button className="w-full" variant="default">
                      View Intel
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">Want intel from more cities?</h3>
              <p className="text-muted-foreground">
                We're expanding based on member demand. Vote for your city.
              </p>
              <Button variant="outline">
                Request a City
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}