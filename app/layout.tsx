import { Toaster } from "@/components/ui/toaster";
import { AudioProvider } from "@/providers/audio-provider";
import { GameProvider } from "@/providers/game-provider";
import "nes.css/css/nes.min.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const ps2 = Press_Start_2P({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Mathler Arcade",
  description: "A math puzzle game built with React.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ps2.className} antialiased`}>
        <ThemeProvider attribute="class">
          <AudioProvider>
            <GameProvider>
              {children}
              <Toaster />
            </GameProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
