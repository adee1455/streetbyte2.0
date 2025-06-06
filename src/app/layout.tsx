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
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
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
        <link rel="icon" type="image/svg+xml" href="/ByteLogo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="google-site-verification" content="GjBpuDyiz1HLW_ZYqWWXRUqMFT7xzX5o3okR9xNs6zU" />
        {/* Manifest Link */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ServiceWorkerRegistration />
        <DesktopWarning />
        <ClientLayout>
          <InstallAppBanner/>
          <SessionProviderWrapper>
            <Header />
            {children}
          </SessionProviderWrapper>
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
