"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Lock, Shield, TrendingUp, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function PaywallModal({ isOpen, onClose, feature }: PaywallModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const captureEmailMutation = api.lead.capture.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Check your email for the Fair Price Sheet PDF",
      });
      // Redirect to thank you page
      router.push("/thank-you");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await captureEmailMutation.mutateAsync({ email });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Scam Protection",
      description: "Real-time alerts save you thousands"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Live Intelligence",
      description: "184 new reports processed today"
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Fair Pricing",
      description: "Never overpay again"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-black border-zinc-800">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-5 w-5 text-yellow-500" />
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
              Premium Feature
            </Badge>
          </div>
          <DialogTitle className="text-2xl">
            Get Instant Access to {feature || "Full Intelligence"}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Join 2,847+ members who never get scammed or overpay in Southeast Asia
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-3">
                <div className="text-green-500 mt-0.5">{benefit.icon}</div>
                <div>
                  <h4 className="font-semibold">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50">
            <p className="text-sm italic">
              "Saved me 3,000 THB on my first night. The scam alert for [REDACTED] was spot on."
            </p>
            <p className="text-xs text-muted-foreground mt-2">- Veteran_77, Member since Jan 2024</p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Enter your email for instant access:</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    Get Free Fair Price Sheet PDF
                  </>
                )}
              </Button>

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Instant download • No spam • Unsubscribe anytime • 
                  Includes "5 Venues Overcharging You" bonus report
                </span>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="sm:justify-center">
          <p className="text-xs text-center text-muted-foreground">
            By entering your email, you agree to receive MongerMaps intelligence updates.
            Your privacy is protected by military-grade encryption.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}