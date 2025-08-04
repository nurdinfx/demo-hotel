"use client"

import { CalendarView } from "@/components/calendar-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Filter, Download } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/contexts/auth-context"
import { NotificationCenter } from "@/components/notification-center"

export default function AdminCalendarPage() {
  const { translations } = useLanguage()
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
            <Link href="/login">
              <Button>Login as Admin</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold">HotelPro Admin</span>
          </Link>

          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <Link href="/admin">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">{translations.liveCalendar}</h1>
              <p className="text-gray-600">Real-time room availability and booking management</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Check-ins</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Badge className="bg-green-600">+3 from yesterday</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Check-outs</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Badge className="bg-blue-600">On schedule</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold">76%</p>
                </div>
                <Badge className="bg-orange-600">+5% this week</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Rooms</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Badge variant="outline">Ready for booking</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Component */}
        <CalendarView />
      </div>
    </div>
  )
}
