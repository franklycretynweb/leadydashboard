import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { AppFrame } from "@/components/layout/app-frame";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Light.woff2",   weight: "300", style: "normal" },
    { path: "../../public/fonts/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Medium.woff2",  weight: "500", style: "normal" },
    { path: "../../public/fonts/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
});

const chillax = localFont({
  src: [
    { path: "../../public/fonts/fonts/Chillax_Complete/Fonts/WEB/fonts/Chillax-Regular.woff2",   weight: "400", style: "normal" },
    { path: "../../public/fonts/fonts/Chillax_Complete/Fonts/WEB/fonts/Chillax-Medium.woff2",    weight: "500", style: "normal" },
    { path: "../../public/fonts/fonts/Chillax_Complete/Fonts/WEB/fonts/Chillax-Semibold.woff2",  weight: "600", style: "normal" },
    { path: "../../public/fonts/fonts/Chillax_Complete/Fonts/WEB/fonts/Chillax-Bold.woff2",      weight: "700", style: "normal" },
  ],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "OffScript — Leads",
  description: "Lead generation dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${satoshi.variable} ${chillax.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppFrame>{children}</AppFrame>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
