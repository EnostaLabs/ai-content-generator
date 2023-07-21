"use client";

import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>AI Content Generator</title>
      </head>
      <body className={`${poppins.className} relative`}>
        <div className="bg-grid">
          <div className="gradient" />
        </div>
        <main className="relative z-10 max-w-7xl mx-auto sm:px-16 px-6">
          {children}
        </main>
      </body>

      <Script
        async
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-BKK7659J87"
      />
      <Script strategy="afterInteractive" src="/analytics.js" />
    </html>
  );
}
