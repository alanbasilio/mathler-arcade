import type { Metadata } from "next";
import { Geist, Press_Start_2P } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AudioProvider } from "@/providers/audio-provider";
import { GameProvider } from "@/providers/game-provider";
import { ReactQueryProvider } from "@/providers/query-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className={`${ps2.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ReactQueryProvider>
            <AudioProvider>
              <GameProvider>
                {children}
                <Toaster />
              </GameProvider>
            </AudioProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
