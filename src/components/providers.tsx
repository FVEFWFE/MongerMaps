"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "~/components/theme-provider";
import { CSPostHogProvider } from "~/components/posthog-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CSPostHogProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </CSPostHogProvider>
    </SessionProvider>
  );
}