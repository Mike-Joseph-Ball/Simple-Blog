import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme_provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Simple Blog!!",
  description: "Simple Blog is a very simple blogging platform",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "@/app/Light-Mode-Logo.svg",
        href: "@/app/Light-Mode-Logo.svg"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "@/app/Dark-Mode-Logo.svg",
        href: "@/app/Dark-Mode-Logo.svg"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
