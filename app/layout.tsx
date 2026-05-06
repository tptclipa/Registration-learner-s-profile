import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { DeveloperEasterEgg } from "@/components/DeveloperEasterEgg";

export const metadata: Metadata = {
  title: "TESDA Scholar Registration",
  description: "Welcome, TESDA Scholar Enrollees. Complete your registration to confirm your slot and proceed with onboarding requirements.",
  keywords: ["TESDA", "scholar", "registration", "enrollment", "technical education"],
  openGraph: {
    title: "TESDA Scholar Registration",
    description: "Complete your registration to confirm your slot and proceed with onboarding requirements.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0047AB",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased bg-white">
        <Header />
        {children}
        <DeveloperEasterEgg />
      </body>
    </html>
  );
}
