import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionProvider from "./components/SessionProvider";
import React from 'react';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus",
  description: "MediTech platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-screen" lang="en">
      <body className={inter.className}>
         
          <SessionProvider>
            <div className="h-screen">
              <Navbar />
              {children}
            </div>
          </SessionProvider>
      </body>
    </html>
  );
}
