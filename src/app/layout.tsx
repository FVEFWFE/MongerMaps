import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "~/components/providers";
import { PostHogPageView } from "~/components/posthog-pageview";

export const metadata: Metadata = {
  title: "MongerMaps - The Bloomberg Terminal for Mongers",
  description: "Private intelligence service providing real-time data and insider knowledge for the sophisticated monger.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <PostHogPageView />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}