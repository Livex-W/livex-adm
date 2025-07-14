import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Livex Admin',
  description: 'Admin dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex min-h-screen flex-col ${inter.variable}`}>
        <Header />
        <main className="flex-1 px-8 py-10 lg:px-16">{children}</main>
      </body>
    </html>
  );
}
