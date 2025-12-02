import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YojanaHub - Government Schemes Discovery",
  description: "Discover government welfare schemes you're eligible for",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
