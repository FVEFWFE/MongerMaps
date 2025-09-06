"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
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
  },
  // MEXICO
  {
    slug: "tijuana",
    name: "Tijuana",
    country: "Mexico",
    flag: "🇲🇽",
    description: "Border city with legendary Hong Kong Club",
    mongerRank: 4,
    stats: {
      venues: 95,
      activeUsers: 892,
      vibeScore: 8.2,
      alerts: 4,
      fairPriceST: 80,
      currency: "USD",
      newReports24h: 67,
      topRatedVenues: 15,
      temperature: 22,
      internetSpeed: 50,
      airQuality: 65
    },
    badges: ["Border Town", "24/7 Action"],
    trending: false,
    image: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "warm",
    cost: "moderate",
    stunnerDensity: "high",
    gfeAvailable: false,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: false,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "high",
    conservatism: "liberal",
    attractiveness: 7.5,
    easyToFindHotWomen: true,
    safety: "risky",
    personality: "transactional",
    environmentBeauty: "poor",
    infrastructure: "moderate",
    internetSpeed: 50,
    timezone: "GMT-8",
    features: ["nightlife", "bars", "24hr"]
  },
  {
    slug: "cancun",
    name: "Cancun",
    country: "Mexico",
    flag: "🇲🇽",
    description: "Tourist hotspot with hidden gems",
    mongerRank: 12,
    stats: {
      venues: 42,
      activeUsers: 356,
      vibeScore: 7.1,
      alerts: 2,
      fairPriceST: 150,
      currency: "USD",
      newReports24h: 23,
      topRatedVenues: 8,
      temperature: 28,
      internetSpeed: 60,
      airQuality: 40
    },
    badges: ["Beach Paradise"],
    trending: false,
    image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "expensive",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "poor",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "good",
    girlsUnder25: "common",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "liberal",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "friendly",
    environmentBeauty: "excellent",
    infrastructure: "excellent",
    internetSpeed: 60,
    timezone: "GMT-5",
    features: ["beach", "nightlife", "tourism"]
  },
  {
    slug: "puerto-vallarta",
    name: "Puerto Vallarta",
    country: "Mexico",
    flag: "🇲🇽",
    description: "Pacific coast resort town",
    mongerRank: 18,
    stats: {
      venues: 28,
      activeUsers: 234,
      vibeScore: 6.8,
      alerts: 1,
      fairPriceST: 120,
      currency: "USD",
      newReports24h: 15,
      topRatedVenues: 5,
      temperature: 26,
      internetSpeed: 55,
      airQuality: 35
    },
    badges: ["Beach Town"],
    trending: false,
    image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "warm",
    cost: "moderate",
    stunnerDensity: "low",
    gfeAvailable: true,
    bestBangBuck: "moderate",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "good",
    girlsUnder25: "rare",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "moderate",
    attractiveness: 6.5,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "friendly",
    environmentBeauty: "excellent",
    infrastructure: "good",
    internetSpeed: 55,
    timezone: "GMT-6",
    features: ["beach", "lgbtq", "tourism"]
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    flag: "🇲🇽",
    description: "Massive capital with diverse options",
    mongerRank: 14,
    stats: {
      venues: 156,
      activeUsers: 789,
      vibeScore: 7.5,
      alerts: 3,
      fairPriceST: 100,
      currency: "USD",
      newReports24h: 52,
      topRatedVenues: 24,
      temperature: 18,
      internetSpeed: 70,
      airQuality: 75
    },
    badges: ["Megacity", "Culture Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1518659526054-e3c5b74fe72f?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "mild",
    cost: "moderate",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "moderate",
    attractiveness: 7.0,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "professional",
    environmentBeauty: "moderate",
    infrastructure: "good",
    internetSpeed: 70,
    timezone: "GMT-6",
    features: ["nightlife", "culture", "business"]
  },
  {
    slug: "guadalajara",
    name: "Guadalajara",
    country: "Mexico",
    flag: "🇲🇽",
    description: "Second city with growing scene",
    mongerRank: 20,
    stats: {
      venues: 67,
      activeUsers: 423,
      vibeScore: 7.2,
      alerts: 2,
      fairPriceST: 80,
      currency: "USD",
      newReports24h: 28,
      topRatedVenues: 11,
      temperature: 20,
      internetSpeed: 65,
      airQuality: 60
    },
    badges: ["Tech Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "mild",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "common",
    plasticSurgery: "moderate",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "conservative",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "moderate",
    personality: "traditional",
    environmentBeauty: "moderate",
    infrastructure: "good",
    internetSpeed: 65,
    timezone: "GMT-6",
    features: ["nightlife", "tech", "culture"]
  },
  // COLOMBIA
  {
    slug: "medellin",
    name: "Medellin",
    country: "Colombia",
    flag: "🇨🇴",
    description: "City of eternal spring and stunning women",
    mongerRank: 5,
    stats: {
      venues: 78,
      activeUsers: 1456,
      vibeScore: 9.1,
      alerts: 3,
      fairPriceST: 200000,
      currency: "COP",
      newReports24h: 98,
      topRatedVenues: 22,
      temperature: 22,
      internetSpeed: 70,
      airQuality: 50
    },
    badges: ["Hotness Capital", "Digital Nomad Hub"],
    trending: true,
    image: "https://images.unsplash.com/photo-1543385426-191664295b58?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "mild",
    cost: "moderate",
    stunnerDensity: "extreme",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "abundant",
    plasticSurgery: "extreme",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "moderate",
    attractiveness: 9.5,
    easyToFindHotWomen: true,
    safety: "risky",
    personality: "passionate",
    environmentBeauty: "good",
    infrastructure: "good",
    internetSpeed: 70,
    timezone: "GMT-5",
    features: ["nightlife", "dating", "digital-nomad"]
  },
  {
    slug: "bogota",
    name: "Bogota",
    country: "Colombia",
    flag: "🇨🇴",
    description: "Capital city with diverse scene",
    mongerRank: 8,
    stats: {
      venues: 124,
      activeUsers: 876,
      vibeScore: 7.8,
      alerts: 2,
      fairPriceST: 150000,
      currency: "COP",
      newReports24h: 56,
      topRatedVenues: 18,
      temperature: 14,
      internetSpeed: 65,
      airQuality: 60
    },
    badges: ["Business Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "cold",
    cost: "moderate",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "moderate",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "professional",
    environmentBeauty: "moderate",
    infrastructure: "good",
    internetSpeed: 65,
    timezone: "GMT-5",
    features: ["nightlife", "business", "culture"]
  },
  {
    slug: "cartagena",
    name: "Cartagena",
    country: "Colombia",
    flag: "🇨🇴",
    description: "Caribbean coast beauty",
    mongerRank: 7,
    stats: {
      venues: 56,
      activeUsers: 623,
      vibeScore: 8.4,
      alerts: 1,
      fairPriceST: 250000,
      currency: "COP",
      newReports24h: 41,
      topRatedVenues: 12,
      temperature: 31,
      internetSpeed: 55,
      airQuality: 45
    },
    badges: ["Beach Town", "Tourist Friendly"],
    trending: false,
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "expensive",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "moderate",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "common",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "liberal",
    attractiveness: 8.5,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "fun",
    environmentBeauty: "excellent",
    infrastructure: "good",
    internetSpeed: 55,
    timezone: "GMT-5",
    features: ["beach", "nightlife", "tourism"]
  },
  {
    slug: "cali",
    name: "Cali",
    country: "Colombia",
    flag: "🇨🇴",
    description: "Salsa capital with hot nightlife",
    mongerRank: 15,
    stats: {
      venues: 45,
      activeUsers: 342,
      vibeScore: 7.6,
      alerts: 2,
      fairPriceST: 120000,
      currency: "COP",
      newReports24h: 23,
      topRatedVenues: 8,
      temperature: 25,
      internetSpeed: 60,
      airQuality: 55
    },
    badges: ["Dance Capital"],
    trending: false,
    image: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "warm",
    cost: "cheap",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "common",
    plasticSurgery: "common",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "liberal",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "risky",
    personality: "passionate",
    environmentBeauty: "moderate",
    infrastructure: "moderate",
    internetSpeed: 60,
    timezone: "GMT-5",
    features: ["nightlife", "dancing", "culture"]
  },
  // BRAZIL
  {
    slug: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brazil",
    flag: "🇧🇷",
    description: "Beach paradise with legendary nightlife",
    mongerRank: 6,
    stats: {
      venues: 145,
      activeUsers: 1234,
      vibeScore: 8.9,
      alerts: 3,
      fairPriceST: 200,
      currency: "BRL",
      newReports24h: 87,
      topRatedVenues: 31,
      temperature: 27,
      internetSpeed: 75,
      airQuality: 55
    },
    badges: ["Beach Capital", "Party Central"],
    trending: true,
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "moderate",
    stunnerDensity: "extreme",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "abundant",
    plasticSurgery: "extreme",
    naturalBeauty: "extreme",
    tallGirls: true,
    tattooPrevalence: "moderate",
    conservatism: "liberal",
    attractiveness: 9.0,
    easyToFindHotWomen: true,
    safety: "risky",
    personality: "passionate",
    environmentBeauty: "excellent",
    infrastructure: "moderate",
    internetSpeed: 75,
    timezone: "GMT-3",
    features: ["beach", "nightlife", "carnival"]
  },
  {
    slug: "sao-paulo",
    name: "Sao Paulo",
    country: "Brazil",
    flag: "🇧🇷",
    description: "Massive city with endless options",
    mongerRank: 9,
    stats: {
      venues: 234,
      activeUsers: 1567,
      vibeScore: 7.6,
      alerts: 4,
      fairPriceST: 250,
      currency: "BRL",
      newReports24h: 112,
      topRatedVenues: 45,
      temperature: 23,
      internetSpeed: 85,
      airQuality: 70
    },
    badges: ["Megacity", "Business Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1543059829-314c1ac70dfc?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "mild",
    cost: "expensive",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "moderate",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "extreme",
    naturalBeauty: "moderate",
    tallGirls: true,
    tattooPrevalence: "high",
    conservatism: "liberal",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "professional",
    environmentBeauty: "poor",
    infrastructure: "excellent",
    internetSpeed: 85,
    timezone: "GMT-3",
    features: ["nightlife", "business", "culture"]
  },
  {
    slug: "fortaleza",
    name: "Fortaleza",
    country: "Brazil",
    flag: "🇧🇷",
    description: "Northeast beach paradise",
    mongerRank: 16,
    stats: {
      venues: 67,
      activeUsers: 456,
      vibeScore: 8.2,
      alerts: 2,
      fairPriceST: 150,
      currency: "BRL",
      newReports24h: 31,
      topRatedVenues: 12,
      temperature: 28,
      internetSpeed: 60,
      airQuality: 40
    },
    badges: ["Beach Haven"],
    trending: false,
    image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "abundant",
    plasticSurgery: "moderate",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "moderate",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "fun",
    environmentBeauty: "good",
    infrastructure: "moderate",
    internetSpeed: 60,
    timezone: "GMT-3",
    features: ["beach", "nightlife", "value"]
  },
  // DOMINICAN REPUBLIC
  {
    slug: "santo-domingo",
    name: "Santo Domingo",
    country: "Dominican Republic",
    flag: "🇩🇴",
    description: "Caribbean capital with vibrant scene",
    mongerRank: 10,
    stats: {
      venues: 67,
      activeUsers: 543,
      vibeScore: 8.1,
      alerts: 2,
      fairPriceST: 3000,
      currency: "DOP",
      newReports24h: 38,
      topRatedVenues: 14,
      temperature: 29,
      internetSpeed: 40,
      airQuality: 50
    },
    badges: ["Caribbean Vibes"],
    trending: false,
    image: "https://images.unsplash.com/photo-1555717277-a5d32ed7736b?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "abundant",
    plasticSurgery: "common",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "liberal",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "fun",
    environmentBeauty: "good",
    infrastructure: "moderate",
    internetSpeed: 40,
    timezone: "GMT-4",
    features: ["beach", "nightlife", "caribbean"]
  },
  {
    slug: "sosua",
    name: "Sosua",
    country: "Dominican Republic",
    flag: "🇩🇴",
    description: "Beach town mongering paradise",
    mongerRank: 11,
    stats: {
      venues: 34,
      activeUsers: 412,
      vibeScore: 8.5,
      alerts: 1,
      fairPriceST: 2500,
      currency: "DOP",
      newReports24h: 29,
      topRatedVenues: 8,
      temperature: 28,
      internetSpeed: 35,
      airQuality: 40
    },
    badges: ["Beach Paradise", "Monger Haven"],
    trending: true,
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "extreme",
    gfeAvailable: false,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: false,
    englishSpeaking: "good",
    girlsUnder25: "abundant",
    plasticSurgery: "minimal",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "liberal",
    attractiveness: 8.5,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "transactional",
    environmentBeauty: "excellent",
    infrastructure: "poor",
    internetSpeed: 35,
    timezone: "GMT-4",
    features: ["beach", "bars", "tourism"]
  },
  {
    slug: "punta-cana",
    name: "Punta Cana",
    country: "Dominican Republic",
    flag: "🇩🇴",
    description: "Resort paradise with hidden scene",
    mongerRank: 22,
    stats: {
      venues: 18,
      activeUsers: 156,
      vibeScore: 6.5,
      alerts: 1,
      fairPriceST: 4000,
      currency: "DOP",
      newReports24h: 11,
      topRatedVenues: 4,
      temperature: 28,
      internetSpeed: 45,
      airQuality: 35
    },
    badges: ["Resort Town"],
    trending: false,
    image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "expensive",
    stunnerDensity: "low",
    gfeAvailable: true,
    bestBangBuck: "poor",
    stFriendly: true,
    ltAccommodating: false,
    englishSpeaking: "good",
    girlsUnder25: "rare",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "moderate",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "professional",
    environmentBeauty: "excellent",
    infrastructure: "excellent",
    internetSpeed: 45,
    timezone: "GMT-4",
    features: ["beach", "resorts", "tourism"]
  },
  // COSTA RICA
  {
    slug: "san-jose-cr",
    name: "San Jose",
    country: "Costa Rica",
    flag: "🇨🇷",
    description: "Central American gem with legal scene",
    mongerRank: 13,
    stats: {
      venues: 89,
      activeUsers: 678,
      vibeScore: 7.9,
      alerts: 1,
      fairPriceST: 100,
      currency: "USD",
      newReports24h: 45,
      topRatedVenues: 16,
      temperature: 20,
      internetSpeed: 50,
      airQuality: 45
    },
    badges: ["Legal Scene", "Stable"],
    trending: false,
    image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "mild",
    cost: "moderate",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "good",
    girlsUnder25: "common",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "moderate",
    attractiveness: 7.5,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "professional",
    environmentBeauty: "good",
    infrastructure: "good",
    internetSpeed: 50,
    timezone: "GMT-6",
    features: ["legal", "stable", "tourism"]
  },
  {
    slug: "jaco",
    name: "Jaco",
    country: "Costa Rica",
    flag: "🇨🇷",
    description: "Beach town party central",
    mongerRank: 17,
    stats: {
      venues: 23,
      activeUsers: 189,
      vibeScore: 7.3,
      alerts: 1,
      fairPriceST: 80,
      currency: "USD",
      newReports24h: 13,
      topRatedVenues: 5,
      temperature: 28,
      internetSpeed: 40,
      airQuality: 35
    },
    badges: ["Beach Party"],
    trending: false,
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "moderate",
    stunnerDensity: "moderate",
    gfeAvailable: false,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: false,
    englishSpeaking: "good",
    girlsUnder25: "common",
    plasticSurgery: "moderate",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "high",
    conservatism: "liberal",
    attractiveness: 7.0,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "party",
    environmentBeauty: "good",
    infrastructure: "moderate",
    internetSpeed: 40,
    timezone: "GMT-6",
    features: ["beach", "party", "surfing"]
  },
  // ARGENTINA
  {
    slug: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    flag: "🇦🇷",
    description: "European vibes in Latin America",
    mongerRank: 19,
    stats: {
      venues: 134,
      activeUsers: 892,
      vibeScore: 7.4,
      alerts: 2,
      fairPriceST: 15000,
      currency: "ARS",
      newReports24h: 61,
      topRatedVenues: 21,
      temperature: 18,
      internetSpeed: 65,
      airQuality: 60
    },
    badges: ["Cultural Hub", "Night Owls"],
    trending: false,
    image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "mild",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "extreme",
    naturalBeauty: "moderate",
    tallGirls: true,
    tattooPrevalence: "high",
    conservatism: "liberal",
    attractiveness: 7.5,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "sophisticated",
    environmentBeauty: "moderate",
    infrastructure: "good",
    internetSpeed: 65,
    timezone: "GMT-3",
    features: ["nightlife", "culture", "tango"]
  },
  // PERU
  {
    slug: "lima",
    name: "Lima",
    country: "Peru",
    flag: "🇵🇪",
    description: "Pacific coast capital with growing scene",
    mongerRank: 21,
    stats: {
      venues: 78,
      activeUsers: 523,
      vibeScore: 7.0,
      alerts: 2,
      fairPriceST: 200,
      currency: "PEN",
      newReports24h: 34,
      topRatedVenues: 14,
      temperature: 19,
      internetSpeed: 55,
      airQuality: 65
    },
    badges: ["Growing Scene"],
    trending: false,
    image: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "mild",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "common",
    plasticSurgery: "moderate",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "moderate",
    personality: "traditional",
    environmentBeauty: "moderate",
    infrastructure: "moderate",
    internetSpeed: 55,
    timezone: "GMT-5",
    features: ["nightlife", "culture", "food"]
  },
  // PANAMA
  {
    slug: "panama-city",
    name: "Panama City",
    country: "Panama",
    flag: "🇵🇦",
    description: "Banking hub with upscale scene",
    mongerRank: 23,
    stats: {
      venues: 45,
      activeUsers: 334,
      vibeScore: 6.8,
      alerts: 1,
      fairPriceST: 150,
      currency: "USD",
      newReports24h: 22,
      topRatedVenues: 8,
      temperature: 28,
      internetSpeed: 70,
      airQuality: 50
    },
    badges: ["Business Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1558299041-4dca7265b2e8?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "expensive",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "poor",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "good",
    girlsUnder25: "rare",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "moderate",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "professional",
    environmentBeauty: "moderate",
    infrastructure: "excellent",
    internetSpeed: 70,
    timezone: "GMT-5",
    features: ["business", "nightlife", "casinos"]
  },
  // CUBA
  {
    slug: "havana",
    name: "Havana",
    country: "Cuba",
    flag: "🇨🇺",
    description: "Time capsule with unique scene",
    mongerRank: 24,
    stats: {
      venues: 12,
      activeUsers: 234,
      vibeScore: 7.5,
      alerts: 1,
      fairPriceST: 50,
      currency: "USD",
      newReports24h: 15,
      topRatedVenues: 3,
      temperature: 26,
      internetSpeed: 5,
      airQuality: 45
    },
    badges: ["Unique Experience"],
    trending: false,
    image: "https://images.unsplash.com/photo-1570299437522-f66ff98d52e7?w=800&h=600&fit=crop",
    region: "americas",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "abundant",
    plasticSurgery: "minimal",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "moderate",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "passionate",
    environmentBeauty: "good",
    infrastructure: "poor",
    internetSpeed: 5,
    timezone: "GMT-5",
    features: ["culture", "music", "vintage"]
  },
  // EUROPE
  {
    slug: "prague",
    name: "Prague",
    country: "Czech Republic",
    flag: "🇨🇿",
    description: "European gem with liberal scene",
    mongerRank: 25,
    stats: {
      venues: 89,
      activeUsers: 678,
      vibeScore: 7.8,
      alerts: 1,
      fairPriceST: 1500,
      currency: "CZK",
      newReports24h: 45,
      topRatedVenues: 16,
      temperature: 11,
      internetSpeed: 80,
      airQuality: 50
    },
    badges: ["European Classic"],
    trending: false,
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop",
    region: "europe",
    temperature: "cold",
    cost: "moderate",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "good",
    girlsUnder25: "common",
    plasticSurgery: "moderate",
    naturalBeauty: "high",
    tallGirls: true,
    tattooPrevalence: "moderate",
    conservatism: "liberal",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "professional",
    environmentBeauty: "excellent",
    infrastructure: "excellent",
    internetSpeed: 80,
    timezone: "GMT+1",
    features: ["nightlife", "culture", "beer"]
  },
  {
    slug: "budapest",
    name: "Budapest",
    country: "Hungary",
    flag: "🇭🇺",
    description: "Danube beauty with active scene",
    mongerRank: 26,
    stats: {
      venues: 67,
      activeUsers: 456,
      vibeScore: 7.5,
      alerts: 1,
      fairPriceST: 15000,
      currency: "HUF",
      newReports24h: 31,
      topRatedVenues: 12,
      temperature: 12,
      internetSpeed: 85,
      airQuality: 55
    },
    badges: ["Thermal Baths"],
    trending: false,
    image: "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&h=600&fit=crop",
    region: "europe",
    temperature: "cold",
    cost: "cheap",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "moderate",
    naturalBeauty: "high",
    tallGirls: true,
    tattooPrevalence: "low",
    conservatism: "moderate",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "friendly",
    environmentBeauty: "excellent",
    infrastructure: "good",
    internetSpeed: 85,
    timezone: "GMT+1",
    features: ["nightlife", "spas", "culture"]
  },
  // AFRICA - KENYA
  {
    slug: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    flag: "🇰🇪",
    description: "African hub with growing scene",
    mongerRank: 27,
    stats: {
      venues: 56,
      activeUsers: 423,
      vibeScore: 7.2,
      alerts: 2,
      fairPriceST: 3000,
      currency: "KES",
      newReports24h: 28,
      topRatedVenues: 10,
      temperature: 19,
      internetSpeed: 45,
      airQuality: 60
    },
    badges: ["Safari Capital"],
    trending: false,
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop",
    region: "africa",
    temperature: "mild",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "excellent",
    girlsUnder25: "abundant",
    plasticSurgery: "minimal",
    naturalBeauty: "high",
    tallGirls: true,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 7.5,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "friendly",
    environmentBeauty: "good",
    infrastructure: "moderate",
    internetSpeed: 45,
    timezone: "GMT+3",
    features: ["nightlife", "safari", "culture"]
  },
  // ASIA - PHILIPPINES
  {
    slug: "manila",
    name: "Manila",
    country: "Philippines",
    flag: "🇵🇭",
    description: "Mega city with diverse options",
    mongerRank: 28,
    stats: {
      venues: 178,
      activeUsers: 1123,
      vibeScore: 7.7,
      alerts: 3,
      fairPriceST: 3500,
      currency: "PHP",
      newReports24h: 76,
      topRatedVenues: 29,
      temperature: 28,
      internetSpeed: 40,
      airQuality: 70
    },
    badges: ["Megacity", "Diverse Scene"],
    trending: false,
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "excellent",
    girlsUnder25: "abundant",
    plasticSurgery: "minimal",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 7.0,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "sweet",
    environmentBeauty: "poor",
    infrastructure: "moderate",
    internetSpeed: 40,
    timezone: "GMT+8",
    features: ["nightlife", "massage", "karaoke"]
  },
  {
    slug: "angeles-city",
    name: "Angeles City",
    country: "Philippines",
    flag: "🇵🇭",
    description: "Nightlife paradise with friendly locals",
    mongerRank: 3,
    stats: {
      venues: 186,
      activeUsers: 1247,
      vibeScore: 8.8,
      alerts: 2,
      fairPriceST: 3000,
      currency: "PHP",
      newReports24h: 127,
      topRatedVenues: 28,
      temperature: 30,
      internetSpeed: 45,
      airQuality: 55
    },
    badges: ["Growing Scene", "GFE Paradise"],
    trending: true,
    image: "https://images.unsplash.com/photo-1559629819-638a8f0a4303?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "warm",
    cost: "cheap",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "good",
    girlsUnder25: "abundant",
    plasticSurgery: "minimal",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "moderate",
    attractiveness: 8.5,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "friendly",
    environmentBeauty: "moderate",
    infrastructure: "good",
    internetSpeed: 45,
    timezone: "GMT+8",
    features: ["nightlife", "massage", "gfe"]
  },
  {
    slug: "subic-bay",
    name: "Subic Bay",
    country: "Philippines",
    flag: "🇵🇭",
    description: "Former navy base turned party town",
    mongerRank: 29,
    stats: {
      venues: 45,
      activeUsers: 234,
      vibeScore: 7.3,
      alerts: 1,
      fairPriceST: 2500,
      currency: "PHP",
      newReports24h: 16,
      topRatedVenues: 7,
      temperature: 29,
      internetSpeed: 50,
      airQuality: 40
    },
    badges: ["Beach Town"],
    trending: false,
    image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "excellent",
    girlsUnder25: "common",
    plasticSurgery: "minimal",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "moderate",
    attractiveness: 7.0,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "friendly",
    environmentBeauty: "good",
    infrastructure: "good",
    internetSpeed: 50,
    timezone: "GMT+8",
    features: ["beach", "bars", "diving"]
  },
  // ASIA - CAMBODIA
  {
    slug: "phnom-penh",
    name: "Phnom Penh",
    country: "Cambodia",
    flag: "🇰🇭",
    description: "Riverside capital with wild nightlife",
    mongerRank: 30,
    stats: {
      venues: 123,
      activeUsers: 876,
      vibeScore: 8.0,
      alerts: 2,
      fairPriceST: 50,
      currency: "USD",
      newReports24h: 59,
      topRatedVenues: 19,
      temperature: 29,
      internetSpeed: 35,
      airQuality: 65
    },
    badges: ["Anything Goes"],
    trending: false,
    image: "https://images.unsplash.com/photo-1560707854-fb9a10eeaace?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "abundant",
    plasticSurgery: "minimal",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "liberal",
    attractiveness: 7.5,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "sweet",
    environmentBeauty: "moderate",
    infrastructure: "poor",
    internetSpeed: 35,
    timezone: "GMT+7",
    features: ["nightlife", "bars", "massage"]
  },
  {
    slug: "siem-reap",
    name: "Siem Reap",
    country: "Cambodia",
    flag: "🇰🇭",
    description: "Temple town with hidden scene",
    mongerRank: 31,
    stats: {
      venues: 34,
      activeUsers: 267,
      vibeScore: 7.1,
      alerts: 1,
      fairPriceST: 40,
      currency: "USD",
      newReports24h: 18,
      topRatedVenues: 6,
      temperature: 28,
      internetSpeed: 30,
      airQuality: 50
    },
    badges: ["Tourist Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "minimal",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "moderate",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "friendly",
    environmentBeauty: "excellent",
    infrastructure: "moderate",
    internetSpeed: 30,
    timezone: "GMT+7",
    features: ["tourism", "temples", "bars"]
  },
  // ASIA - VIETNAM
  {
    slug: "ho-chi-minh",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    flag: "🇻🇳",
    description: "Saigon nights and massage parlors",
    mongerRank: 32,
    stats: {
      venues: 156,
      activeUsers: 987,
      vibeScore: 7.8,
      alerts: 2,
      fairPriceST: 1500000,
      currency: "VND",
      newReports24h: 67,
      topRatedVenues: 23,
      temperature: 28,
      internetSpeed: 60,
      airQuality: 70
    },
    badges: ["Massage Capital"],
    trending: false,
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "high",
    gfeAvailable: true,
    bestBangBuck: "excellent",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "abundant",
    plasticSurgery: "minimal",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 8.0,
    easyToFindHotWomen: true,
    safety: "safe",
    personality: "sweet",
    environmentBeauty: "moderate",
    infrastructure: "moderate",
    internetSpeed: 60,
    timezone: "GMT+7",
    features: ["massage", "nightlife", "food"]
  },
  {
    slug: "hanoi",
    name: "Hanoi",
    country: "Vietnam",
    flag: "🇻🇳",
    description: "Capital with traditional charm",
    mongerRank: 33,
    stats: {
      venues: 89,
      activeUsers: 567,
      vibeScore: 7.0,
      alerts: 1,
      fairPriceST: 1200000,
      currency: "VND",
      newReports24h: 38,
      topRatedVenues: 14,
      temperature: 24,
      internetSpeed: 65,
      airQuality: 75
    },
    badges: ["Cultural Capital"],
    trending: false,
    image: "https://images.unsplash.com/photo-1509030450996-dd1a08e17c1b?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "warm",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "common",
    plasticSurgery: "minimal",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 7.5,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "traditional",
    environmentBeauty: "good",
    infrastructure: "moderate",
    internetSpeed: 65,
    timezone: "GMT+7",
    features: ["culture", "massage", "nightlife"]
  },
  // ASIA - INDONESIA
  {
    slug: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    flag: "🇮🇩",
    description: "Mega city with hidden gems",
    mongerRank: 34,
    stats: {
      venues: 234,
      activeUsers: 1456,
      vibeScore: 7.3,
      alerts: 3,
      fairPriceST: 500000,
      currency: "IDR",
      newReports24h: 98,
      topRatedVenues: 35,
      temperature: 28,
      internetSpeed: 50,
      airQuality: 80
    },
    badges: ["Megacity", "Muslim Country"],
    trending: false,
    image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "moderate",
    girlsUnder25: "abundant",
    plasticSurgery: "minimal",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 7.0,
    easyToFindHotWomen: true,
    safety: "moderate",
    personality: "sweet",
    environmentBeauty: "poor",
    infrastructure: "moderate",
    internetSpeed: 50,
    timezone: "GMT+7",
    features: ["nightlife", "massage", "spas"]
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    description: "Island paradise with limited scene",
    mongerRank: 35,
    stats: {
      venues: 23,
      activeUsers: 189,
      vibeScore: 6.5,
      alerts: 1,
      fairPriceST: 700000,
      currency: "IDR",
      newReports24h: 13,
      topRatedVenues: 4,
      temperature: 27,
      internetSpeed: 70,
      airQuality: 35
    },
    badges: ["Digital Nomad Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "moderate",
    stunnerDensity: "low",
    gfeAvailable: true,
    bestBangBuck: "poor",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "good",
    girlsUnder25: "rare",
    plasticSurgery: "minimal",
    naturalBeauty: "high",
    tallGirls: false,
    tattooPrevalence: "high",
    conservatism: "liberal",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "spiritual",
    environmentBeauty: "excellent",
    infrastructure: "good",
    internetSpeed: 70,
    timezone: "GMT+8",
    features: ["beach", "yoga", "digital-nomad"]
  },
  // ASIA - CHINA
  {
    slug: "shanghai",
    name: "Shanghai",
    country: "China",
    flag: "🇨🇳",
    description: "Financial hub with upscale scene",
    mongerRank: 36,
    stats: {
      venues: 178,
      activeUsers: 1234,
      vibeScore: 6.8,
      alerts: 2,
      fairPriceST: 800,
      currency: "CNY",
      newReports24h: 83,
      topRatedVenues: 27,
      temperature: 16,
      internetSpeed: 90,
      airQuality: 85
    },
    badges: ["Business Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "mild",
    cost: "expensive",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "poor",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "poor",
    girlsUnder25: "common",
    plasticSurgery: "common",
    naturalBeauty: "moderate",
    tallGirls: true,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "materialistic",
    environmentBeauty: "moderate",
    infrastructure: "excellent",
    internetSpeed: 90,
    timezone: "GMT+8",
    features: ["business", "ktv", "nightlife"]
  },
  // ASIA - JAPAN
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    description: "Unique scene with strict rules",
    mongerRank: 37,
    stats: {
      venues: 456,
      activeUsers: 2345,
      vibeScore: 7.0,
      alerts: 1,
      fairPriceST: 20000,
      currency: "JPY",
      newReports24h: 156,
      topRatedVenues: 67,
      temperature: 16,
      internetSpeed: 95,
      airQuality: 50
    },
    badges: ["Unique Experience", "Expensive"],
    trending: false,
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "mild",
    cost: "very-expensive",
    stunnerDensity: "moderate",
    gfeAvailable: false,
    bestBangBuck: "poor",
    stFriendly: true,
    ltAccommodating: false,
    englishSpeaking: "poor",
    girlsUnder25: "common",
    plasticSurgery: "moderate",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 7.5,
    easyToFindHotWomen: false,
    safety: "very-safe",
    personality: "professional",
    environmentBeauty: "good",
    infrastructure: "excellent",
    internetSpeed: 95,
    timezone: "GMT+9",
    features: ["soaplands", "pink-salons", "unique"]
  },
  // ASIA - SOUTH KOREA
  {
    slug: "seoul",
    name: "Seoul",
    country: "South Korea",
    flag: "🇰🇷",
    description: "K-beauty capital with hidden scene",
    mongerRank: 38,
    stats: {
      venues: 234,
      activeUsers: 1567,
      vibeScore: 6.5,
      alerts: 1,
      fairPriceST: 150000,
      currency: "KRW",
      newReports24h: 98,
      topRatedVenues: 38,
      temperature: 12,
      internetSpeed: 100,
      airQuality: 60
    },
    badges: ["K-Beauty", "Tech Hub"],
    trending: false,
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "cold",
    cost: "expensive",
    stunnerDensity: "high",
    gfeAvailable: false,
    bestBangBuck: "poor",
    stFriendly: true,
    ltAccommodating: false,
    englishSpeaking: "moderate",
    girlsUnder25: "common",
    plasticSurgery: "extreme",
    naturalBeauty: "low",
    tallGirls: true,
    tattooPrevalence: "low",
    conservatism: "conservative",
    attractiveness: 8.0,
    easyToFindHotWomen: false,
    safety: "very-safe",
    personality: "cold",
    environmentBeauty: "moderate",
    infrastructure: "excellent",
    internetSpeed: 100,
    timezone: "GMT+9",
    features: ["room-salons", "massage", "nightlife"]
  },
  // ASIA - INDIA
  {
    slug: "mumbai",
    name: "Mumbai",
    country: "India",
    flag: "🇮🇳",
    description: "Bollywood city with hidden scene",
    mongerRank: 39,
    stats: {
      venues: 123,
      activeUsers: 789,
      vibeScore: 6.0,
      alerts: 2,
      fairPriceST: 5000,
      currency: "INR",
      newReports24h: 52,
      topRatedVenues: 19,
      temperature: 27,
      internetSpeed: 55,
      airQuality: 90
    },
    badges: ["Bollywood Capital"],
    trending: false,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "low",
    gfeAvailable: true,
    bestBangBuck: "moderate",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "excellent",
    girlsUnder25: "common",
    plasticSurgery: "minimal",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "very-conservative",
    attractiveness: 6.5,
    easyToFindHotWomen: false,
    safety: "moderate",
    personality: "traditional",
    environmentBeauty: "poor",
    infrastructure: "moderate",
    internetSpeed: 55,
    timezone: "GMT+5:30",
    features: ["bars", "dance-bars", "massage"]
  },
  {
    slug: "delhi",
    name: "Delhi",
    country: "India",
    flag: "🇮🇳",
    description: "Capital with underground scene",
    mongerRank: 40,
    stats: {
      venues: 89,
      activeUsers: 567,
      vibeScore: 5.8,
      alerts: 3,
      fairPriceST: 6000,
      currency: "INR",
      newReports24h: 38,
      topRatedVenues: 14,
      temperature: 25,
      internetSpeed: 60,
      airQuality: 95
    },
    badges: ["Capital City"],
    trending: false,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "low",
    gfeAvailable: true,
    bestBangBuck: "moderate",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "excellent",
    girlsUnder25: "common",
    plasticSurgery: "minimal",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "low",
    conservatism: "very-conservative",
    attractiveness: 6.5,
    easyToFindHotWomen: false,
    safety: "risky",
    personality: "traditional",
    environmentBeauty: "poor",
    infrastructure: "good",
    internetSpeed: 60,
    timezone: "GMT+5:30",
    features: ["spas", "escorts", "underground"]
  },
  {
    slug: "goa",
    name: "Goa",
    country: "India",
    flag: "🇮🇳",
    description: "Beach paradise with party scene",
    mongerRank: 41,
    stats: {
      venues: 34,
      activeUsers: 234,
      vibeScore: 6.8,
      alerts: 1,
      fairPriceST: 4000,
      currency: "INR",
      newReports24h: 16,
      topRatedVenues: 6,
      temperature: 28,
      internetSpeed: 45,
      airQuality: 35
    },
    badges: ["Beach Paradise"],
    trending: false,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    region: "asia",
    temperature: "hot",
    cost: "cheap",
    stunnerDensity: "moderate",
    gfeAvailable: true,
    bestBangBuck: "good",
    stFriendly: true,
    ltAccommodating: true,
    englishSpeaking: "excellent",
    girlsUnder25: "common",
    plasticSurgery: "minimal",
    naturalBeauty: "moderate",
    tallGirls: false,
    tattooPrevalence: "moderate",
    conservatism: "liberal",
    attractiveness: 7.0,
    easyToFindHotWomen: false,
    safety: "safe",
    personality: "party",
    environmentBeauty: "excellent",
    infrastructure: "moderate",
    internetSpeed: 45,
    timezone: "GMT+5:30",
    features: ["beach", "party", "tourism"]
  }
];

function HomePageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("");
  const [selectedCity, setSelectedCity] = useState<typeof cities[0] | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  const isPaid = session?.user?.isPaid;
  
  // Clear filters when URL has clear=true
  useEffect(() => {
    if (searchParams.get('clear') === 'true') {
      setActiveFilters({});
      // Remove the clear param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('clear');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);
  
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
                                  <p className="text-xs italic opacity-90 mb-2">"Money is the world's greatest aphrodisiac"</p>
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
                <p className="text-xs text-muted-foreground italic mt-4">
                  "The Internet's most useful sex travel website."
                </p>
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

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}