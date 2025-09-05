"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { FileText, CheckCircle, Shield, TrendingUp, AlertTriangle, Lock, ArrowRight } from "lucide-react";

export default function ThankYouPage() {
  const { data: session } = useSession();
  const createCheckout = api.subscription.createAnnualCheckout.useMutation();

  const handlePurchase = async () => {
    try {
      const result = await createCheckout.mutateAsync();
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Message */}
        <Card className="bg-green-900/20 border-green-700 mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-green-400">
                  Success! Your Fair Price Sheet is on its way...
                </h1>
                <p className="text-muted-foreground mt-1">
                  Check your email in the next 2 minutes. If you don't see it, check spam.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Download Button */}
        <div className="text-center mb-12">
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
            <FileText className="h-5 w-5 mr-2" />
            Download Fair Price Sheet PDF
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Having trouble? Email support@mongermaps.com
          </p>
        </div>

        {/* Sales Letter from Dex */}
        <div className="space-y-8">
          <div className="text-center">
            <Badge className="mb-4">CONFIDENTIAL MESSAGE</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Listen up, rookie...
            </h2>
            <p className="text-xl text-muted-foreground">
              That price sheet will save you from getting ripped off.<br />
              But it won't save you from everything else.
            </p>
          </div>

          {/* The Problem */}
          <Card className="border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">
                <strong>Here's what they don't tell you:</strong> Every night, 73% of guys in Pattaya 
                are getting scammed and they don't even know it.
              </p>
              <p className="mt-4">
                Bill padding. Drink queens. Fake "bar fines." Bait-and-switch girls. 
                The mamasan telling you "she's new" when she's been there 5 years.
              </p>
              <p className="mt-4 text-muted-foreground">
                I've seen veterans with 20+ trips still falling for basic scams.
              </p>
            </CardContent>
          </Card>

          {/* The Solution */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">
              That's why I built MongerMaps.
            </h3>
            <p className="text-lg">
              Real-time intelligence from 2,847+ members on the ground. 
              When someone gets scammed at 10:47 PM, you get an alert at 10:48 PM.
            </p>
          </div>

          {/* What You Get */}
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Here's what you're missing right now:
            </h3>
            <div className="grid gap-4">
              <Card className="border-zinc-800">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg">Live Scam Alerts</h4>
                      <p className="text-muted-foreground mt-1">
                        "ALERT: Bill padding at [VENUE] on Walking Street. 3 reports in last hour. 
                        They're adding fake lady drinks."
                      </p>
                      <p className="text-sm text-yellow-500 mt-2">
                        This alert alone saves you 3,000+ THB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <TrendingUp className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg">Vibe Score™ Tracking</h4>
                      <p className="text-muted-foreground mt-1">
                        Know which venues are hot RIGHT NOW. Not last month. Not last week. 
                        Updated every 6 hours from actual reports.
                      </p>
                      <p className="text-sm text-green-500 mt-2">
                        Never waste time at dead venues again
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Shield className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg">Starfish Risk %</h4>
                      <p className="text-muted-foreground mt-1">
                        Our AI analyzes patterns to predict lazy service BEFORE you barfine. 
                        Green = Good. Yellow = Caution. Red = Run.
                      </p>
                      <p className="text-sm text-blue-500 mt-2">
                        82% accuracy based on 47,000+ reports
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Social Proof */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6 space-y-4">
              <p className="italic">
                "Saved me from a 5,000 THB scam my first night. The alert came through 
                right as the mamasan was trying to add mysterious 'service charges'."
              </p>
              <p className="text-sm text-muted-foreground">
                - Mike T., Member since 2023
              </p>
            </CardContent>
          </Card>

          {/* The Offer */}
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <h3 className="text-2xl font-bold">Limited Time: 52% Off Yearly Access</h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-3xl font-bold text-yellow-500">$99/year</span>
                <span className="text-xl line-through text-muted-foreground">$199</span>
                <Badge className="bg-red-500">TODAY ONLY</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                That's $8.25/month. Less than one overpriced lady drink.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Instant access to all locked features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time scam alerts (save thousands)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Live venue intelligence updated 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Veterans-only intel (the good stuff)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>7-day money back guarantee</span>
                </li>
              </ul>

              <Button 
                onClick={handlePurchase}
                className="w-full h-14 text-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                disabled={createCheckout.isLoading}
              >
                {createCheckout.isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Get Instant Access for $99/year
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>🔒 Secure checkout</span>
                <span>•</span>
                <span>⚡ Instant access</span>
                <span>•</span>
                <span>💳 All cards accepted</span>
              </div>
            </CardContent>
          </Card>

          {/* Risk Reversal */}
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="pt-6 text-center">
              <h4 className="font-bold text-lg mb-2">
                My "Don't Be A Sucker" Guarantee
              </h4>
              <p>
                Use MongerMaps for 7 days. If it doesn't save you at least $99 in prevented scams, 
                bad venues, or overpricing - email me personally at dex@mongermaps.com and I'll 
                refund every penny. No BS. No forms. Just a simple email.
              </p>
            </CardContent>
          </Card>

          {/* Urgency */}
          <div className="text-center space-y-4">
            <p className="text-xl">
              Right now, while you're reading this, someone just overpaid by 2,000 THB.
            </p>
            <p className="text-lg text-muted-foreground">
              Tomorrow night that could be you.
            </p>
            <p className="text-lg">
              Or you could have every venue's real price, real vibe score, and real-time 
              alerts in your pocket.
            </p>
          </div>

          {/* Final CTA */}
          <div className="space-y-4">
            <Button 
              onClick={handlePurchase}
              size="lg"
              className="w-full h-16 text-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              disabled={createCheckout.isLoading}
            >
              Join 2,847+ Smart Mongers →
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Questions? Email dex@mongermaps.com<br />
              P.S. The $99 price expires at midnight. Then it's back to $199.
            </p>
          </div>

          {/* Alternative Options */}
          <div className="border-t border-zinc-800 pt-8 mt-12">
            <p className="text-center text-muted-foreground mb-4">
              Not ready? Here are your options:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">
                  Return to Dashboard
                </Button>
              </Link>
              <Link href="/upgrade">
                <Button variant="outline">
                  See All Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}