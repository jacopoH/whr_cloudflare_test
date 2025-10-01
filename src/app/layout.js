import './globals.css'; // Global styles
import NavBar from '../../components/NavBar';
import TekjaCredit from  '../../components/TekjaCredit';
import GoogleAnalytics from "../../components/GoogleAnalytics";

import Script from "next/script";

// import { VariableProvider } from "../../components/VariableContext";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export const metadata = {
  title: 'WHR Dashboard',
  description: 'WHR Dashboard',
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon-180.png", sizes: "180x180", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon-120.png", sizes: "120x120" },
      { url: "/apple-touch-icon-152.png", sizes: "152x152" },
      { url: "/apple-touch-icon-180.png", sizes: "180x180" },
      { url: "/apple-touch-icon.png", sizes: "180x180" }, // Default Apple icon
    ],
    shortcut: "/android-chrome-196.png",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
        <head>
          <link rel="stylesheet" href="https://use.typekit.net/vjy2xwu.css" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        <link rel="icon" type="image/png" sizes="196x196" href="/android-chrome-196.png" />

        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/favicon-128.png" />
        <link rel="icon" type="image/png" sizes="180x180" href="/favicon-180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />

          {/* Google Analytics */}
          <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-S28S8LN2KR`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-S28S8LN2KR', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        </head>
      <body className="md:h-full h-auto ">
      <GoogleAnalytics /> {/* Track page views */}

      <AppRouterCacheProvider>
        <NavBar />
        <main className="grow px-2 py-8 md:py-0 overflow-auto">
        {children}
        </main>
        </AppRouterCacheProvider>
      <TekjaCredit/>
      </body>
    </html>
  );
}
