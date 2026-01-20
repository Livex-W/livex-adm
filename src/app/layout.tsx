import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Livex ADM - Backoffice para Administradores",
  description: "Gestiona tu resort, experiencias y reservas con Livex",
  icons: {
    icon: [
      { url: '/adm/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/adm/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/adm/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/adm/favicon/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/adm/favicon/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/adm/favicon/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/adm/favicon/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/adm/favicon/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/adm/favicon/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/adm/favicon/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/adm/favicon/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/adm/favicon/apple-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'apple-touch-icon', url: '/adm/favicon/apple-icon-180x180.png' },
      { rel: 'android-chrome', url: '/adm/favicon/android-icon-192x192.png', sizes: '192x192' },
    ],
  },
  manifest: '/adm/favicon/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950`}>
        <Providers>
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
