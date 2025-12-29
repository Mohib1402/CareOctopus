import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/layout/main-nav";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareOctopus",
  description: "AI Assistant for Caregivers",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50`}>
        <div className="flex min-h-screen">
          <MainNav />
          {/* Main Content Wrapper - Shifts content right on desktop to make room for sidebar */}
          <main className="flex-1 md:ml-64 pb-20 md:pb-8 p-4 md:p-8">
            {children}
          </main>
        </div>
        <Toaster position="top-center" /> {/* <--- ADD THIS LINE */}
      </body>
    </html>
  );
}