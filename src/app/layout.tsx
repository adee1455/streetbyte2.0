import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import Head from "next/head";
import InstallAppBanner from "@/components/installComp";
import SessionProviderWrapper from "../components/SessionProviderWrapper"; 
import ClientLayout from './ClientLayout';
import { Analytics } from "@vercel/analytics/next"
import DesktopWarning from "@/components/DesktopWarning";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreetByte",
  description: "Made with love by Jade Studios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#EF4443" />
        <meta name="google-site-verification" content="GjBpuDyiz1HLW_ZYqWWXRUqMFT7xzX5o3okR9xNs6zU" />
        {/* Manifest Link */}
        <link rel="manifest" href="/manifest.json" />

        {/* Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                  }).catch((error) => {
                    console.log('Service Worker registration failed:', error);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DesktopWarning />
        <ClientLayout>
          <InstallAppBanner/>
          <SessionProviderWrapper>
            <Header />
            {children}
          </SessionProviderWrapper>
        </ClientLayout>
      </body>
    </html>
  );
}
