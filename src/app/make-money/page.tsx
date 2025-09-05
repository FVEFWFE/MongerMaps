"use client";

import { Shell } from "~/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Trophy,
  Zap,
  Globe,
  Target,
  Laptop,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function MakeMoneyPage() {
  return (
    <Shell>
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
            <DollarSign className="h-3 w-3 mr-1" />
            New Opportunity
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Make Money Mongering
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your mongering from an expensive hobby into a profitable venture.
            <br />
            <span className="text-yellow-500">
              Turn field reports into recurring income while you travel.
            </span>
          </p>

          {/* Success Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">$5,847</div>
              <div className="text-sm text-muted-foreground">Avg Monthly Income</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">127</div>
              <div className="text-sm text-muted-foreground">Active Earners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">$0</div>
              <div className="text-sm text-muted-foreground">Investment Required</div>
            </div>
          </div>
        </div>

        {/* The Problem */}
        <Card className="mb-8 border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500">The Problem Every Monger Faces</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg">You're stuck in a negative flywheel:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Work a job you hate to save money for mongering trips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Blow through savings in 2 weeks of fun</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Go back to wage slavery to do it all over again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Feel guilty about "wasting" money instead of building wealth</span>
              </li>
            </ul>
            <p className="text-muted-foreground italic mt-4">
              "I love mongering but I can't afford to do it as much as I want..."
            </p>
          </CardContent>
        </Card>

        {/* The Solution */}
        <Card className="mb-8 border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-500">The Solution: Create a Positive Flywheel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">Turn your mongering into content that funds itself:</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="font-semibold mb-2">1. Document Your Trips</h4>
                <p className="text-sm text-muted-foreground">
                  Write field reports and share intel (anonymously)
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="font-semibold mb-2">2. Build an Audience</h4>
                <p className="text-sm text-muted-foreground">
                  Help other mongers avoid mistakes and find gems
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="font-semibold mb-2">3. Earn Commissions</h4>
                <p className="text-sm text-muted-foreground">
                  Get paid when your referrals join MongerMaps
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg text-center">
              <p className="text-green-500 font-semibold">
                Result: Your mongering literally pays for itself (and then some)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <h2 className="text-2xl font-bold mb-6">How The MongerMaps Affiliate Program Works</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Commission Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Starter Plan ($99/year)</span>
                <Badge className="bg-green-500">40% = $39.60</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Pro Plan ($199/year)</span>
                <Badge className="bg-green-500">40% = $79.60</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Recurring Renewals</span>
                <Badge className="bg-yellow-500">20% lifetime</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Average affiliate earns $847/month with just 21 active referrals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Performance Bonuses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">10+ sales/month</span>
                  <Badge variant="outline">+10% bonus</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">25+ sales/month</span>
                  <Badge variant="outline">+20% bonus</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">50+ sales/month</span>
                  <Badge className="bg-yellow-500 text-black">+30% bonus</Badge>
                </div>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-lg mt-4">
                <p className="text-sm">
                  <strong>Top Performer:</strong> "Bangkok_Vet" earned $12,847 last month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Ideas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Content Converts Best</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Written Content
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>City comparison guides (Pattaya vs Bangkok)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>"How I saved $2000 on my trip" breakdowns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Scam alerts and prevention guides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Budget mongering strategies</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Platform Ideas
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Anonymous Twitter/X account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Substack newsletter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Telegram channel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Forum signature links</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Stories */}
        <h2 className="text-2xl font-bold mb-6">Success Stories</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm italic mb-4">
                "Started posting trip reports with my referral link. Now I make enough 
                to cover my flights and hotels. Mongering is finally cash-flow positive!"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">@AsianTraveler92</span>
                <Badge className="text-xs">$3,247/mo</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm italic mb-4">
                "My Telegram channel has 2,000 subs. Every trip report I post 
                converts 5-10 new MongerMaps users. Best passive income ever."
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">@BangkokInsider</span>
                <Badge className="text-xs">$5,892/mo</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm italic mb-4">
                "Quit my job and moved to Pattaya. My MongerMaps commissions 
                more than cover my monthly expenses. Living the dream!"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">@PattayaVet</span>
                <Badge className="text-xs">$8,441/mo</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ethical Approach */}
        <Card className="mb-8 border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Our Ethical Approach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>We believe in honest, value-first content:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>Only promote MongerMaps if you genuinely use and believe in it</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>Always disclose your affiliate relationship transparently</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>Focus on helping others have better trips, not just selling</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>Respect privacy - never share personal details or photos</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Ready to Start Making Money While Mongering?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">
              Join the MongerMaps Affiliate Program and turn your passion into profit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                <Laptop className="h-5 w-5 mr-2" />
                Apply Now
              </Button>
              <Button size="lg" variant="outline">
                <Target className="h-5 w-5 mr-2" />
                View Full Details
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No investment required • Start earning today • Monthly payouts via crypto or wire
            </p>
          </CardContent>
        </Card>

        {/* FAQ Preview */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Questions? Check our{" "}
            <Link href="/affiliate-faq" className="text-yellow-500 hover:underline">
              Affiliate FAQ
            </Link>{" "}
            or email affiliates@mongermaps.com
          </p>
        </div>
      </div>
    </Shell>
  );
}