import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { authOptions } from "@/lib/auth/options";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal de la Secretaría General",
  description:
    "Portal institucional de la Secretaría General de la Universidad [Nombre]. Acceda al sistema oficial para la gestión de títulos universitarios, inicio y seguimiento de solicitudes, y emisión de certificaciones académicas.",
  keywords: [
    "Portal Secretaría General",
    "Sistema de gestión de títulos",
    "Trámites universitarios online",
    "Solicitud de título universitario",
    "Emisión de títulos",
    "Universidad pública argentina",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 text-slate-900`}
      >
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
