import { Shell } from "@/components/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Shield, Star, Calendar, Target } from "lucide-react"

export default function Profile() {
  return (
    <Shell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">My Dossier</h1>
            <p className="text-muted-foreground">Veteran_77 • Member since January 2024</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Stats */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  My Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[hsl(142.1_76.2%_41.2%)]">21</div>
                  <div className="text-sm text-muted-foreground">Total Encounters Logged</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8.2</div>
                  <div className="text-sm text-muted-foreground">Average Player Score™ Given</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2150 THB</div>
                  <div className="text-sm text-muted-foreground">Average Price Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[hsl(142.1_76.2%_41.2%)]">Kinnaree</div>
                  <div className="text-sm text-muted-foreground">Most Frequented Venue</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[hsl(142.1_76.2%_41.2%)]">47</div>
                  <div className="text-sm text-muted-foreground">Reports Submitted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8.7</div>
                  <div className="text-sm text-muted-foreground">Avg. Player Score™</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm text-muted-foreground">Cities Visited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[hsl(142.1_76.2%_41.2%)]">4</div>
                  <div className="text-sm text-muted-foreground">Referrals Made</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Submitted report for Kinnaree</span>
                    <Badge variant="secondary">2h ago</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Updated venue rating</span>
                    <Badge variant="secondary">1d ago</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Referred new member</span>
                    <Badge variant="default" className="text-[hsl(142.1_76.2%_41.2%)]">
                      3d ago
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Membership</span>
                  <Badge className="text-[hsl(142.1_76.2%_41.2%)]">Premium</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Verification</span>
                  <Badge className="text-[hsl(142.1_76.2%_41.2%)]">Verified</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trust Score</span>
                  <Badge variant="secondary">9.2/10</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Premium membership expires in 347 days</p>
                <Button className="w-full bg-transparent" variant="outline">
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  )
}
