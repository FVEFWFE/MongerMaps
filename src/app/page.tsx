"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Shell } from "~/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DataTable } from "~/components/data-table";
import { columns } from "~/components/intel-columns";
import { PaywallModal } from "~/components/paywall-modal";
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  ArrowUp, 
  ArrowDown,
  PlusCircle, 
  X, 
  Lock,
  Eye,
  EyeOff 
} from "lucide-react";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

type City = "pattaya" | "bangkok" | "angeles";

export default function HomePage() {
  const { data: session } = useSession();
  const [selectedCity, setSelectedCity] = useState<City>("pattaya");
  const [filter, setFilter] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string>("");
  
  // Fetch dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = api.intelligence.getDashboardMetrics.useQuery({
    city: selectedCity
  });
  
  // Fetch live intel feed
  const { data: intelFeed, isLoading: feedLoading } = api.intelligence.getLiveIntelFeed.useQuery({
    city: selectedCity,
    limit: 10,
    filter: filter || undefined
  });
  
  // Fetch top venues
  const { data: topVenues, isLoading: venuesLoading } = api.intelligence.getTopVenues.useQuery({
    city: selectedCity,
    limit: 3
  });
  
  const isPaid = session?.user?.isPaid;
  
  const handleUnlockFeature = (feature: string) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };
  
  // Format KPI data based on real metrics
  const kpiData = metrics ? [
    {
      title: `${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Vibe Shift (24h)`,
      value: metrics.vibeShift ? (parseFloat(metrics.vibeShift) > 0 ? `+${metrics.vibeShift}` : metrics.vibeShift) : "0",
      subtext: parseFloat(metrics.vibeShift || "0") > 0 ? "Vibe Score™ rising" : "Vibe Score™ stable",
      analysisText: `Analysis based on ${metrics.reportCount} new reports`,
      positive: parseFloat(metrics.vibeShift || "0") > 0 ? true : parseFloat(metrics.vibeShift || "0") < 0 ? false : null,
      visible: true, // Always visible to prove value
    },
    {
      title: selectedCity === "pattaya" ? "Fair Price: Soi 6 ST" : "Fair Price: ST",
      value: metrics.fairPrice ? `${metrics.fairPrice} THB` : "N/A",
      subtext: "Market average",
      touristPrice: metrics.fairPrice ? `${Math.round(metrics.fairPrice * 1.5)} THB` : null,
      positive: null,
      visible: true, // Number visible to tease value
      detailsLocked: !isPaid, // But details are locked
    },
    {
      title: "New Reports Processed (6h)",
      value: metrics.reportCount?.toString() || "0",
      subtext: isPaid ? "From multiple venues" : "Unlock for details",
      positive: null,
      visible: true, // Count visible
      locked: !isPaid, // Content locked
    },
    {
      title: "Active Scam Alerts",
      value: metrics.activeAlerts?.toString() || "0",
      subtext: `${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Zone`,
      positive: metrics.activeAlerts === 0,
      visible: true, // FREE - builds trust
    },
  ] : [];
  
  const isLoading = metricsLoading || feedLoading || venuesLoading;

  const cities: { value: City; label: string }[] = [
    { value: "pattaya", label: "Pattaya" },
    { value: "bangkok", label: "Bangkok" },
    { value: "angeles", label: "Angeles City" }
  ];

  return (
    <Shell>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header with City Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Live Intelligence Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Loading..." : "Real-time data from verified field reports"}
            </p>
          </div>
          
          {/* City Selector */}
          <div className="flex gap-2">
            {cities.map((city) => (
              <Button
                key={city.value}
                variant={selectedCity === city.value ? "default" : "outline"}
                onClick={() => setSelectedCity(city.value)}
                className="min-w-[100px]"
              >
                {city.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Scam Alerts - Always visible FREE to build trust */}
        {metrics?.activeAlerts > 0 && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                SCAM ALERT: {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Multiple reports of bill padding in last 24 hours.
                {isPaid ? (
                  <Button variant="link" className="text-red-500 p-0 h-auto ml-1">
                    View Details
                  </Button>
                ) : (
                  <Button 
                    variant="link" 
                    className="text-red-500 p-0 h-auto ml-1"
                    onClick={() => handleUnlockFeature("scam alert details")}
                  >
                    Unlock Details
                  </Button>
                )}
              </p>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards - All visible but with strategic locking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card 
              key={index} 
              className={cn(
                "relative overflow-hidden transition-all",
                (kpi.locked || kpi.detailsLocked) && "cursor-pointer hover:shadow-lg"
              )}
              onClick={() => (kpi.locked || kpi.detailsLocked) && handleUnlockFeature("detailed metrics")}
            >
              {kpi.locked && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-yellow-500" />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      kpi.positive === true && "text-green-500",
                      kpi.positive === false && "text-red-500",
                      kpi.positive === null && "text-foreground"
                    )}
                  >
                    {kpi.value}
                  </div>
                  {kpi.positive === true && <ArrowUp className="h-5 w-5 text-green-500" />}
                  {kpi.positive === false && <ArrowDown className="h-5 w-5 text-red-500" />}
                </div>
                <p
                  className={cn(
                    "text-xs mt-1",
                    kpi.positive === true && "text-green-500",
                    kpi.positive === false && "text-red-500",
                    kpi.positive === null && "text-muted-foreground",
                    kpi.detailsLocked && "blur-sm"
                  )}
                >
                  {kpi.subtext}
                </p>
                {kpi.touristPrice && (
                  <p className={cn("text-xs mt-1 text-red-500", !isPaid && "blur-sm")}>
                    Tourist Price: {isPaid ? kpi.touristPrice : "???"}
                  </p>
                )}
                {kpi.analysisText && <p className="text-xs mt-1 text-muted-foreground">{kpi.analysisText}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top 3 Tonight - Headers visible, venues blurred */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:order-1 order-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Top 3 Tonight
                  {!isPaid && (
                    <Badge variant="secondary" className="ml-auto">
                      <Lock className="h-3 w-3" />
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topVenues?.map((venue, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex justify-between items-center group cursor-pointer",
                      !isPaid && "hover:scale-105 transition-transform"
                    )}
                    onClick={() => !isPaid && handleUnlockFeature("top venues tonight")}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={cn("text-sm", !isPaid && "blur-sm select-none")}>
                        {isPaid ? venue.name : "Hidden Venue"}
                      </span>
                      <Badge
                        variant={venue.score > 8.5 ? "default" : venue.score > 7 ? "secondary" : "destructive"}
                        className={cn(
                          venue.score > 8.5 ? "bg-green-500" : "",
                          !isPaid && "opacity-50"
                        )}
                      >
                        {venue.score.toFixed(1)}
                      </Badge>
                    </div>
                    {isPaid && (
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isPaid && (
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-2"
                    onClick={() => handleUnlockFeature("top venues tonight")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock Top Venues
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Intel Feed - Count visible, content locked */}
          <div className="xl:col-span-2 xl:order-2 order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Live Intel Feed
                  <Badge variant="default" className="ml-2">
                    {intelFeed?.data?.length || 0} New
                  </Badge>
                  {!isPaid && (
                    <Badge variant="secondary" className="ml-auto">
                      <Lock className="h-3 w-3 mr-1" />
                      Limited View
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Filter by venue..." 
                    className="max-w-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    disabled={!isPaid}
                  />
                  {!isPaid && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlockFeature("full search & filters")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Unlock Filters
                    </Button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  {intelFeed && (
                    <div className={cn(!isPaid && "relative")}>
                      {!isPaid && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 flex items-end justify-center pb-4">
                          <Button
                            onClick={() => handleUnlockFeature("all field reports")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            View All {intelFeed.data.length}+ Reports
                          </Button>
                        </div>
                      )}
                      <DataTable 
                        columns={columns} 
                        data={isPaid ? intelFeed.data : intelFeed.data.slice(0, 3)} 
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Game Plan & Alerts */}
          <div className="space-y-4 xl:order-3 order-3">
            <Card className={cn(!isPaid && "relative overflow-hidden")}>
              {!isPaid && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end p-4">
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-sm"
                    onClick={() => handleUnlockFeature("personalized game plans")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock Game Plan
                  </Button>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Tonight's Game Plan
                </CardTitle>
              </CardHeader>
              <CardContent className={cn("space-y-3", !isPaid && "blur-sm")}>
                <p className="text-xs text-muted-foreground">
                  Personalized recommendations based on your preferences
                </p>
                {isPaid && topVenues?.slice(0, 3).map((venue, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{venue.name}</span>
                    <span className="text-muted-foreground ml-2">- Peak time 10pm</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Fair Price Guide - Teaser */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fair Price Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ST (Short Time)</span>
                  <span className={cn("font-medium", !isPaid && "blur-sm")}>
                    {isPaid ? `${metrics?.fairPrice || "N/A"} THB` : "??? THB"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>LT (Long Time)</span>
                  <span className={cn("font-medium", !isPaid && "blur-sm")}>
                    {isPaid ? `${Math.round((metrics?.fairPrice || 1500) * 2)} THB` : "??? THB"}
                  </span>
                </div>
                {!isPaid && (
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    variant="outline"
                    onClick={() => handleUnlockFeature("fair price details")}
                  >
                    Get Full Price Sheet
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={paywallFeature}
      />
    </Shell>
  );
}