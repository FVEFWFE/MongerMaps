"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Shell } from "~/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DataTable } from "~/components/data-table";
import { columns } from "~/components/intel-columns";
import { PaywallModal } from "~/components/paywall-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
  EyeOff,
  MapPin,
  FileText,
  MessageSquare,
  Building2,
  TrendingUp as Trends,
  DollarSign
} from "lucide-react";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

// City data configuration
const cityData = {
  pattaya: {
    name: "Pattaya",
    country: "Thailand",
    currency: "THB",
    defaultTab: "dashboard"
  },
  bangkok: {
    name: "Bangkok", 
    country: "Thailand",
    currency: "THB",
    defaultTab: "dashboard"
  },
  angeles: {
    name: "Angeles City",
    country: "Philippines",
    currency: "PHP",
    defaultTab: "dashboard"
  }
};

export default function CityPage() {
  const params = useParams();
  const citySlug = params.slug as string;
  const city = cityData[citySlug as keyof typeof cityData];
  
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filter, setFilter] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string>("");
  
  // Fetch dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = api.intelligence.getDashboardMetrics.useQuery({
    city: citySlug
  });
  
  // Fetch live intel feed
  const { data: intelFeed, isLoading: feedLoading } = api.intelligence.getLiveIntelFeed.useQuery({
    city: citySlug,
    limit: 10,
    filter: filter || undefined
  });
  
  // Fetch top venues
  const { data: topVenues, isLoading: venuesLoading } = api.intelligence.getTopVenues.useQuery({
    city: citySlug,
    limit: 3
  });
  
  const isPaid = session?.user?.isPaid;
  
  const handleUnlockFeature = (feature: string) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };
  
  const isLoading = metricsLoading || feedLoading || venuesLoading;

  if (!city) {
    return (
      <Shell>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">City not found</h1>
          <p className="text-muted-foreground mt-2">This city is not yet available.</p>
        </div>
      </Shell>
    );
  }

  // Dashboard content (moved from original homepage)
  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Scam Alerts - Always visible FREE to build trust */}
      {metrics?.activeAlerts > 0 && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-4 w-4" />
              SCAM ALERT: {city.name}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {city.name} Vibe Shift (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-500">
                {metrics?.vibeShift ? `+${metrics.vibeShift}` : "0"}
              </div>
              <ArrowUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              Analysis based on {metrics?.reportCount || 0} new reports
            </p>
          </CardContent>
        </Card>

        <Card className={cn(!isPaid && "cursor-pointer")} onClick={() => !isPaid && handleUnlockFeature("fair prices")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fair Price: ST</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.fairPrice || "N/A"} {city.currency}
            </div>
            <p className={cn("text-xs mt-1 text-red-500", !isPaid && "blur-sm")}>
              Tourist Price: {isPaid ? `${Math.round((metrics?.fairPrice || 1500) * 1.5)} ${city.currency}` : "???"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Reports (6h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.reportCount || 0}</div>
            <p className="text-xs mt-1 text-muted-foreground">
              {isPaid ? "From multiple venues" : "Unlock for details"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Scam Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              metrics?.activeAlerts === 0 ? "text-green-500" : "text-red-500"
            )}>
              {metrics?.activeAlerts || 0}
            </div>
            <p className="text-xs mt-1 text-muted-foreground">{city.name} Zone</p>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Tonight and Intel Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Top 3 Tonight */}
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

        {/* Main Intel Feed */}
        <div className="xl:col-span-3 xl:order-2 order-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Live Intel Feed
                <Badge variant="default" className="ml-2">
                  {intelFeed?.data?.length || 0} New
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Filter by venue..." 
                className="max-w-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                disabled={!isPaid}
              />
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
      </div>
    </div>
  );

  return (
    <Shell>
      <div className="p-4 md:p-6 space-y-6">
        {/* City Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{city.name}</h1>
            <p className="text-muted-foreground">{city.country}</p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            Monger Rank #1
          </Badge>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Field Reports</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Live Chat</span>
            </TabsTrigger>
            <TabsTrigger value="venues" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Venues</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <Trends className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground">
                    Real-time venue locations with heat mapping
                  </p>
                  {!isPaid && (
                    <Button 
                      className="mt-4"
                      onClick={() => handleUnlockFeature("interactive map")}
                    >
                      Unlock Map Access
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Field Reports Archive</h3>
                  <p className="text-muted-foreground">
                    Aggregated reports from ISG, Reddit, and our members
                  </p>
                  {!isPaid && (
                    <Button 
                      className="mt-4"
                      onClick={() => handleUnlockFeature("field reports")}
                    >
                      Unlock Reports
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Live Member Chat</h3>
                  <p className="text-muted-foreground">
                    Real-time discussion with verified members
                  </p>
                  {!isPaid && (
                    <Button 
                      className="mt-4"
                      onClick={() => handleUnlockFeature("live chat")}
                    >
                      Unlock Chat Access
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="venues" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Venue Database</h3>
                  <p className="text-muted-foreground">
                    Complete list of venues with ratings and prices
                  </p>
                  {!isPaid && (
                    <Button 
                      className="mt-4"
                      onClick={() => handleUnlockFeature("venue database")}
                    >
                      Unlock Database
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Trends className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Price & Quality Trends</h3>
                  <p className="text-muted-foreground">
                    Historical data and predictive analytics
                  </p>
                  {!isPaid && (
                    <Button 
                      className="mt-4"
                      onClick={() => handleUnlockFeature("trend analysis")}
                    >
                      Unlock Trends
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={paywallFeature}
      />
    </Shell>
  );
}