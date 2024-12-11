  import type { Metadata } from "next";
  import localFont from "next/font/local";
  import "./globals.css";
  import { ThemeProvider } from "@/components/providers/theme_provider";
  import { GoogleAnalytics } from '@next/third-parties/google'
  import { AppContextProvider } from "./context";

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
    title: "Simple Blog",
    description: "Simple Blog is a very simple blogging platform",
    icons: {
      icon: [
        /*
        {
          media: "(prefers-color-scheme: light)",
          url: "/logos/Light-Mode-Logo.svg",
          href: "/logos/Light-Mode-Logo.svg"
        },
        {
          media: "(prefers-color-scheme: dark)",
          url: "/logos/Dark-Mode-Logo.svg",
          href: "/logos/Dark-Mode-Logo.svg"
        }
          */
        {
        url: "/logos/Light-Mode-Logo.svg",
        href: "/logos/Light-Mode-Logo.svg"
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
      //Hydration is when React converts pre-rendered HTML from the server into
      //Fully a fully interactive application by attaching event handlers
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <GoogleAnalytics gaId="G-SDFEE488H4"/>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange // gets rid of CSS transitions so theme change is instant
          storageKey="simple-blog-key" //key that stores user preference, stored on the user's browser
          //const currentTheme = localStorage.getItem('simple-blog-key);
          >
            <AppContextProvider>
              {children}
            </AppContextProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }
