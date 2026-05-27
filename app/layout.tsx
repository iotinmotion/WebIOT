import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "./_components/LangContext";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IOT in Motion — Soluciones IoT a medida",
  description:
    "Diseñamos y construimos soluciones digitales IoT con las últimas tecnologías de comunicación. Plataforma SIM, LoRaWAN, Smart City, Industria, Salud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`} style={{ fontFamily: "var(--font-geist-sans), Inter, -apple-system, sans-serif" }}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
