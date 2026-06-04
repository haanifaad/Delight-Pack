import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/AppContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import B2BChat from "@/components/B2BChat";

export const metadata: Metadata = {
  title: "Delight Pack | Premium Packaging Solutions",
  description: "High-quality, eco-friendly packing materials for domestic and international markets.",
  keywords: "packaging, eco-friendly, food packaging, box packaging, custom printing, Dubai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* prevent hydration warning because of data-theme mutation */}
      </head>
      <body>
        <ThemeProvider>
          <AppProvider>
            <main>{children}</main>
            <B2BChat />
            <ThemeSwitcher />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
