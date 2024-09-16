import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const ps2 = Press_Start_2P({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Mathler React",
  description: "A math puzzle game built with React.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ps2.className} antialiased`}>
        <ThemeProvider attribute="class">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
