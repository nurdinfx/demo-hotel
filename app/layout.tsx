import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { BookingProvider } from "@/contexts/booking-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { Toaster } from "@/components/ui/toaster"
import { PWAInstall } from "@/components/pwa-install"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HotelPro - Premium Hotel Management System",
  description: "Complete hotel management solution with booking, payments, and guest services",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <BookingProvider>
              {children}
              <Toaster />
              <PWAInstall />
            </BookingProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
