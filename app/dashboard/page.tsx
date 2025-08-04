"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Star, MapPin, Phone, Edit, LogOut, Gift, Clock, CheckCircle, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useBookings } from "@/contexts/booking-context"
import { useLanguage } from "@/hooks/use-language"
import { NotificationCenter } from "@/components/notification-center"
import { ChatWidget } from "@/components/chat-widget"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { getBookingsByUser } = useBookings()
  const { language, translations } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user) {
    router.push("/login")
    return null
  }

  const userBookings = getBookingsByUser(user.id)
  const upcomingBookings = userBookings.filter(
    (booking) => new Date(booking.checkIn) > new Date() && booking.status !== "cancelled",
  )
  const pastBookings = userBookings.filter(
    (booking) => new Date(booking.checkOut) < new Date() || booking.status === "completed",
  )
  const currentBookings = userBookings.filter(
    (booking) =>
      new Date(booking.checkIn) <= new Date() &&
      new Date(booking.checkOut) > new Date() &&
      booking.status === "confirmed",
  )

  const handleLogout = () => {
    logout()
    router.push("/")
  }

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
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLoyaltyBadgeColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "bronze":
        return "bg-amber-600"
      case "silver":
        return "bg-gray-500"
      case "gold":
        return "bg-yellow-500"
      case "platinum":
        return "bg-purple-600"
      default:
        return "bg-blue-600"
    }
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
            <span className="text-xl font-bold">HotelPro</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              {translations.home}
            </Link>
            <Link href="/rooms" className="text-gray-600 hover:text-gray-900 transition-colors">
              {translations.rooms}
            </Link>
            <Link href="/facilities" className="text-gray-600 hover:text-gray-900 transition-colors">
              {translations.facilities}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              {translations.contact}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <NotificationCenter />
            {user.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline">Admin Panel</Button>
              </Link>
            )}
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-lg font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={getLoyaltyBadgeColor(user.loyaltyTier || "")}>{user.loyaltyTier} Member</Badge>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Gift className="w-4 h-4" />
                    <span>{user.loyaltyPoints} points</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(user.joinedDate || "").toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                      <p className="text-sm text-gray-600">Upcoming Stays</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{pastBookings.length}</p>
                      <p className="text-sm text-gray-600">Completed Stays</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{user.loyaltyPoints}</p>
                      <p className="text-sm text-gray-600">Loyalty Points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{user.loyaltyTier}</p>
                      <p className="text-sm text-gray-600">Member Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Current Bookings */}
              {currentBookings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Current Stay</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{booking.roomName}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.guests} guests • {booking.nights} nights
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status)}
                          <p className="text-lg font-semibold mt-1">${booking.totalAmount}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Upcoming Bookings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                      <p className="text-gray-600 mb-4">Ready to plan your next stay?</p>
                      <Link href="/rooms">
                        <Button>Browse Rooms</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{booking.roomName}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.guests} guests • {booking.nights} nights
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(booking.status)}
                            <p className="text-lg font-semibold mt-1">${booking.totalAmount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/rooms">
                      <Button className="w-full h-16 flex flex-col space-y-1">
                        <Calendar className="w-5 h-5" />
                        <span>Book a Room</span>
                      </Button>
                    </Link>
                    <Link href="/facilities">
                      <Button variant="outline" className="w-full h-16 flex flex-col space-y-1 bg-transparent">
                        <MapPin className="w-5 h-5" />
                        <span>Explore Facilities</span>
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full h-16 flex flex-col space-y-1 bg-transparent">
                        <Phone className="w-5 h-5" />
                        <span>Contact Support</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                  <CardDescription>View and manage all your hotel bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {userBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                      <p className="text-gray-600 mb-4">Start planning your perfect getaway!</p>
                      <Link href="/rooms">
                        <Button>Browse Rooms</Button>
                      </Link>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Room</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Guests</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Booked On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.roomName}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                                <div className="text-gray-500">
                                  to {new Date(booking.checkOut).toLocaleDateString()}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{booking.guests}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell className="font-semibold">${booking.totalAmount}</TableCell>
                            <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-xl font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      {user.phone && <p className="text-gray-600">{user.phone}</p>}
                      <Badge className={`mt-2 ${getLoyaltyBadgeColor(user.loyaltyTier || "")}`}>
                        {user.loyaltyTier} Member
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <p className="mt-1 text-sm text-gray-900">{user.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Member Since</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(user.joinedDate || "").toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Last Login</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(user.lastLogin || "").toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Account Type</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full md:w-auto">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span>Loyalty Program</span>
                  </CardTitle>
                  <CardDescription>Earn points and unlock exclusive benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 mb-4">
                      <Badge className={`text-lg px-4 py-2 ${getLoyaltyBadgeColor(user.loyaltyTier || "")}`}>
                        {user.loyaltyTier} Member
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{user.loyaltyPoints} Points</p>
                    <p className="text-gray-600">Available for redemption</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Gift className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Bronze</h3>
                      <p className="text-sm text-gray-600">0 - 999 points</p>
                      <p className="text-xs text-gray-500 mt-1">5% discount on bookings</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Gift className="w-6 h-6 text-gray-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Silver</h3>
                      <p className="text-sm text-gray-600">1,000 - 2,999 points</p>
                      <p className="text-xs text-gray-500 mt-1">10% discount + free breakfast</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-yellow-50">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Gift className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Gold</h3>
                      <p className="text-sm text-gray-600">3,000+ points</p>
                      <p className="text-xs text-gray-500 mt-1">15% discount + premium perks</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">How to Earn Points</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Earn 10 points for every $1 spent on bookings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Bonus 500 points for social media sign-up</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Double points on weekend bookings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Birthday bonus: 1,000 points annually</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ChatWidget />
    </div>
  )
}
