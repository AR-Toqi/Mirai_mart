import type { Metadata } from "next";
import { Baloo_2, DM_Sans } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mirai Mart — Play, Live & Discover",
  description:
    "A modern, optimistic and friendly store for curated educational toys, creative developmental items, home decor, and digital gadgets.",
};

import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { CompareProvider } from "@/lib/context/CompareContext";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { CompareDock } from "@/components/shared/CompareDock";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${baloo.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <CompareProvider>
                {children}
                <CartDrawer />
                <CompareDock />
              </CompareProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

