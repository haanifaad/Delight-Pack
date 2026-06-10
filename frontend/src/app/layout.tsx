import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delight Pack ERP",
  description: "High-Velocity Digital Ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
