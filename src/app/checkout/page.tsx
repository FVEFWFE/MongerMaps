"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Loader2 } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (success && sessionId) {
      // Handle successful payment
      // TODO: Update user subscription status via tRPC
      setTimeout(() => {
        window.location.href = "/?welcome=true";
      }, 3000);
    }
  }, [success, sessionId]);

  if (canceled) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Payment Canceled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your payment was canceled. No charges were made.
            </p>
            <a href="/thank-you" className="text-yellow-500 hover:underline">
              ← Return to offer page
            </a>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-green-500">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Welcome to MongerMaps! You now have full access to all intelligence features.
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Redirecting to dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Default state - processing
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Processing Payment...</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}