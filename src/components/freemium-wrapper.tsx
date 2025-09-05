"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { PaywallModal } from "~/components/paywall-modal";
import { cn } from "~/lib/utils";

const PAID_FEATURES = [
  "top3details",
  "venue_details", 
  "full_reports",
  "advanced_filters",
  "export_data",
  "price_history",
  "dm_members",
  "veterans_content"
];

interface FreemiumWrapperProps {
  children: React.ReactNode;
  feature: string;
  className?: string;
  blurContent?: boolean;
  showLockIcon?: boolean;
  customMessage?: string;
}

export function FreemiumWrapper({ 
  children, 
  feature, 
  className,
  blurContent = true,
  showLockIcon = true,
  customMessage
}: FreemiumWrapperProps) {
  const { data: session } = useSession();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const isPaid = session?.user?.isPaid;
  const isLocked = !isPaid && PAID_FEATURES.includes(feature);
  
  if (!isLocked) {
    return <>{children}</>;
  }
  
  return (
    <>
      <div 
        className={cn(
          "relative",
          className,
          "cursor-pointer hover:opacity-90 transition-opacity"
        )}
        onClick={() => setShowPaywall(true)}
      >
        {blurContent && (
          <div className={cn("pointer-events-none", blurContent && "blur-sm select-none")}>
            {children}
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-center">
            {showLockIcon && <Lock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />}
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              onClick={(e) => {
                e.stopPropagation();
                setShowPaywall(true);
              }}
            >
              {customMessage || "Unlock Access"}
            </Button>
          </div>
        </div>
      </div>
      
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={feature}
      />
    </>
  );
}