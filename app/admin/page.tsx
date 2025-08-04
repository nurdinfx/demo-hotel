"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Bed, DollarSign, Calendar, TrendingUp, Settings, Plus, Edit, Trash2, Eye, Download } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/contexts/auth-context"
import { useBookings } from "@/contexts/booking-context"
import { NotificationCenter } from "@/components/notification-center"

export default function AdminDashboard() {
  const { language, translations } = useLanguage()
  const { user } = useAuth()
  const { getAllBookings, getBookingsByDateRange } = useBookings()
  const [activeTab, setActiveTab] = useState("dashboard")

  // Get real booking data
  const allBookings = getAllBookings()
  const today = new Date()
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const monthlyBookings = getBookingsByDateRange(
    thisMonth.toISOString().split("T")[0],
    nextMonth.toISOString().split("T")[0],
  )

  // Calculate real statistics
  const dashboardStats = {
    totalRooms: 50,
    occupiedRooms: allBookings.filter(
      (b) => b.status === "confirmed" && new Date(b.checkIn) <= today && new Date(b.checkOut) > today,
    ).length,
    totalBookings: monthlyBookings.length,
    monthlyRevenue: monthlyBookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
    occupancyRate: Math.round(
      (allBookings.filter(
        (b) => b.status === "confirmed" && new Date(b.checkIn) <= today && new Date(b.checkOut) > today,
      ).length /
        50) *
        100,
    ),
    avgRoomRate:
      monthlyBookings.length > 0
        ? Math.round(
            monthlyBookings.reduce((sum, booking) => sum + booking.totalAmount / booking.nights, 0) /
              monthlyBookings.length,
          )
        : 145,
  }

  // Get recent bookings (last 10)
  const recentBookings = allBookings.slice(0, 10)

  // Mock room data with some real occupancy
  const rooms = [
    { id: 1, number: "101", type: "Standard Double", status: "occupied", price: 80, lastCleaned: "2024-01-15" },
    { id: 2, number: "102", type: "Deluxe Ocean View", status: "available", price: 150, lastCleaned: "2024-01-15" },
    { id: 3, number: "201", type: "Executive Suite", status: "maintenance", price: 250, lastCleaned: "2024-01-14" },
    { id: 4, number: "202", type: "Family Room", status: "occupied", price: 120, lastCleaned: "2024-01-15" },
  ]

  // Generate revenue data from real bookings
  const generateRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month) => {
      const monthIndex = months.indexOf(month)
      const monthStart = new Date(2024, monthIndex, 1)
      const monthEnd = new Date(2024, monthIndex + 1, 0)
      const monthBookings = getBookingsByDateRange(
        monthStart.toISOString().split("T")[0],
        monthEnd.toISOString().split("T")[0],
      )

      return {
        month,
        revenue: monthBookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
        bookings: monthBookings.length,
      }
    })
  }

  const revenueData = generateRevenueData()

  const roomTypeData = [
    { name: "Standard", value: 20, color: "#8884d8" },
    { name: "Deluxe", value: 15, color: "#82ca9d" },
    { name: "Suite", value: 10, color: "#ffc658" },
    { name: "Family", value: 5, color: "#ff7300" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-600">Completed</Badge>
      case "occupied":
        return <Badge className="bg-red-600">Occupied</Badge>
      case "available":
        return <Badge className="bg-green-600">Available</Badge>
      case "maintenance":
        return <Badge className="bg-orange-600">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

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
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Link href="/">
              <Button variant="outline">View Site</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalRooms}</div>
                  <p className="text-xs text-muted-foreground">{dashboardStats.occupiedRooms} occupied</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardStats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.occupancyRate}%</div>
                  <p className="text-xs text-muted-foreground">Current occupancy</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Room Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roomTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roomTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking activities with real data</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Booked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.userName}</TableCell>
                        <TableCell>{booking.roomName}</TableCell>
                        <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>${booking.totalAmount}</TableCell>
                        <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Manage Bookings</h1>
              <div className="flex space-x-2">
                <Input placeholder="Search bookings..." className="w-64" />
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>#{booking.id.slice(-8).toUpperCase()}</TableCell>
                        <TableCell className="font-medium">{booking.userName}</TableCell>
                        <TableCell>{booking.roomName}</TableCell>
                        <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>${booking.totalAmount}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs remain the same... */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Manage Rooms</h1>
              <div className="flex space-x-2">
                <Input placeholder="Search rooms..." className="w-64" />
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Last Cleaned</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.number}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>{getStatusBadge(room.status)}</TableCell>
                        <TableCell>${room.price}</TableCell>
                        <TableCell>{room.lastCleaned}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users and Reports tabs would be similar... */}
          <TabsContent value="users" className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">User Management</h2>
              <p className="text-gray-600">User management features coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Advanced Reports</h2>
              <p className="text-gray-600">Advanced reporting features coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
