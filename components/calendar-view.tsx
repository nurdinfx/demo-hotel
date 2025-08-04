"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface BookingEvent {
  id: string
  roomNumber: string
  guestName: string
  checkIn: Date
  checkOut: Date
  status: "confirmed" | "pending" | "cancelled"
  roomType: string
}

interface RoomStatus {
  roomNumber: string
  status: "available" | "occupied" | "maintenance" | "cleaning"
  guestName?: string
  checkOut?: Date
}

const mockBookings: BookingEvent[] = [
  {
    id: "1",
    roomNumber: "101",
    guestName: "Ahmed Hassan",
    checkIn: new Date(2024, 0, 15),
    checkOut: new Date(2024, 0, 18),
    status: "confirmed",
    roomType: "Deluxe",
  },
  {
    id: "2",
    roomNumber: "102",
    guestName: "Fatima Ali",
    checkIn: new Date(2024, 0, 16),
    checkOut: new Date(2024, 0, 20),
    status: "confirmed",
    roomType: "Suite",
  },
  {
    id: "3",
    roomNumber: "201",
    guestName: "Mohamed Omar",
    checkIn: new Date(2024, 0, 17),
    checkOut: new Date(2024, 0, 19),
    status: "pending",
    roomType: "Standard",
  },
]

const mockRoomStatuses: RoomStatus[] = [
  { roomNumber: "101", status: "occupied", guestName: "Ahmed Hassan", checkOut: new Date(2024, 0, 18) },
  { roomNumber: "102", status: "available" },
  { roomNumber: "103", status: "maintenance" },
  { roomNumber: "201", status: "occupied", guestName: "Fatima Ali", checkOut: new Date(2024, 0, 20) },
  { roomNumber: "202", status: "cleaning" },
  { roomNumber: "203", status: "available" },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<"month" | "week">("month")
  const { translations } = useLanguage()

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push({ date: prevMonthDay, isCurrentMonth: false })
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    // Add empty cells to complete the grid
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i)
      days.push({ date: nextMonthDay, isCurrentMonth: false })
    }

    return days
  }

  const getBookingsForDate = (date: Date) => {
    return mockBookings.filter((booking) => {
      const bookingStart = new Date(booking.checkIn)
      const bookingEnd = new Date(booking.checkOut)
      return date >= bookingStart && date <= bookingEnd
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      case "occupied":
        return "bg-red-500"
      case "available":
        return "bg-green-500"
      case "maintenance":
        return "bg-orange-500"
      case "cleaning":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              {translations.today}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={viewType === "month" ? "default" : "outline"} size="sm" onClick={() => setViewType("month")}>
            {translations.month}
          </Button>
          <Button variant={viewType === "week" ? "default" : "outline"} size="sm" onClick={() => setViewType("week")}>
            {translations.week}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="calendar-grid">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-4 bg-gray-50 font-semibold text-center text-sm">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {days.map((day, index) => {
                  const bookings = getBookingsForDate(day.date)
                  const todayClass = isToday(day.date) ? "today" : ""
                  const otherMonthClass = !day.isCurrentMonth ? "other-month" : ""

                  return (
                    <div key={index} className={`calendar-cell ${todayClass} ${otherMonthClass}`}>
                      <div className="font-medium text-sm mb-2">{day.date.getDate()}</div>

                      <div className="space-y-1">
                        {bookings.slice(0, 3).map((booking) => (
                          <div
                            key={booking.id}
                            className={`text-xs px-2 py-1 rounded text-white truncate ${getStatusColor(booking.status)}`}
                            title={`${booking.guestName} - Room ${booking.roomNumber}`}
                          >
                            {booking.roomNumber}: {booking.guestName}
                          </div>
                        ))}
                        {bookings.length > 3 && (
                          <div className="text-xs text-gray-500">+{bookings.length - 3} more</div>
                        )}
                      </div>

                      {/* Room availability indicator */}
                      <div className="booking-indicator available"></div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Room Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Room Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRoomStatuses.map((room) => (
                <div key={room.roomNumber} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Room {room.roomNumber}</div>
                    {room.guestName && <div className="text-sm text-gray-600">{room.guestName}</div>}
                    {room.checkOut && (
                      <div className="text-xs text-gray-500">Until {room.checkOut.toLocaleDateString()}</div>
                    )}
                  </div>
                  <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Check-ins */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Check-ins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockBookings
                .filter((booking) => {
                  const today = new Date()
                  return booking.checkIn.toDateString() === today.toDateString()
                })
                .map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{booking.guestName}</div>
                      <div className="text-sm text-gray-600">Room {booking.roomNumber}</div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Today's Check-outs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Check-outs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockBookings
                .filter((booking) => {
                  const today = new Date()
                  return booking.checkOut.toDateString() === today.toDateString()
                })
                .map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{booking.guestName}</div>
                      <div className="text-sm text-gray-600">Room {booking.roomNumber}</div>
                    </div>
                    <Badge variant="outline">Check-out</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Available/Confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm">Maintenance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Cleaning</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
