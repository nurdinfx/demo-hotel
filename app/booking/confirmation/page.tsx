"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Download,
  Share2,
  Star,
  Bed,
  Wifi,
  Car,
  Coffee,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useBookings } from "@/contexts/booking-context"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/hooks/use-language"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")
  const { getBookingById } = useBookings()
  const { user } = useAuth()
  const { translations } = useLanguage()
  const [booking, setBooking] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      const bookingData = getBookingById(bookingId)
      setBooking(bookingData)
    }
    setIsLoading(false)
  }, [bookingId, getBookingById])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your booking confirmation...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find the booking you're looking for.</p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDownloadConfirmation = () => {
    // In a real app, this would generate and download a PDF
    alert("Booking confirmation would be downloaded as PDF")
  }

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: "Hotel Booking Confirmation",
        text: `My booking at HotelPro - ${booking.roomName}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Booking link copied to clipboard!")
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

          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600">
              Thank you for choosing HotelPro. Your reservation has been successfully confirmed.
            </p>
            <div className="mt-4">
              <Badge className="bg-green-600 text-lg px-4 py-2">
                Booking ID: #{booking.id.slice(-8).toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Booking Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src="/placeholder.svg?height=120&width=160&text=Room+Image"
                      alt={booking.roomName}
                      className="w-40 h-30 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{booking.roomName}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Check-in</p>
                          <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">3:00 PM</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Check-out</p>
                          <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">11:00 AM</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Guests</p>
                          <p className="font-medium">{booking.guests} guests</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Nights</p>
                          <p className="font-medium">{booking.nights} nights</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600">${booking.totalAmount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Guest Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Primary Guest</p>
                      <p className="font-medium">{booking.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{booking.userEmail}</p>
                    </div>
                    {booking.guestPhone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{booking.guestPhone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Number of Guests</p>
                      <p className="font-medium">{booking.guests}</p>
                    </div>
                  </div>
                  {booking.specialRequests && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Special Requests</p>
                      <p className="font-medium">{booking.specialRequests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Payment Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">{booking.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <Badge className="bg-green-600">Paid</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transaction Date</p>
                      <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="font-medium text-green-600">${booking.totalAmount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleDownloadConfirmation} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Confirmation
                  </Button>
                  <Button onClick={handleShareBooking} variant="outline" className="w-full bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Booking
                  </Button>
                  <Link href="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Bookings
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Hotel Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium">+252 61 234 5678</p>
                      <p className="text-xs text-gray-600">24/7 Support</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium">info@hotelpro.so</p>
                      <p className="text-xs text-gray-600">Email Support</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium">Mogadishu, Somalia</p>
                      <p className="text-xs text-gray-600">Hotel Location</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Room Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Free WiFi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Free Parking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coffee className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Breakfast</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Room Service</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Check-in Policy</p>
                    <p className="text-gray-600">Check-in starts at 3:00 PM. Early check-in subject to availability.</p>
                  </div>
                  <div>
                    <p className="font-medium">Check-out Policy</p>
                    <p className="text-gray-600">
                      Check-out is at 11:00 AM. Late check-out available for additional fee.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Cancellation Policy</p>
                    <p className="text-gray-600">Free cancellation up to 24 hours before check-in.</p>
                  </div>
                  <div>
                    <p className="font-medium">ID Requirement</p>
                    <p className="text-gray-600">Valid government-issued ID required at check-in.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>Here's what you can expect before and during your stay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Confirmation Email</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive a detailed confirmation email with all booking information within 5 minutes.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Pre-arrival Contact</h3>
                  <p className="text-sm text-gray-600">
                    Our team will contact you 24 hours before arrival to confirm details and special requests.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Enjoy Your Stay</h3>
                  <p className="text-sm text-gray-600">
                    Experience our world-class hospitality and don't forget to leave a review after your stay!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="text-center mt-8 space-y-4">
            <p className="text-gray-600">
              Need to make changes to your booking? Contact us at{" "}
              <a href="tel:+252612345678" className="text-blue-600 hover:underline">
                +252 61 234 5678
              </a>{" "}
              or{" "}
              <a href="mailto:info@hotelpro.so" className="text-blue-600 hover:underline">
                info@hotelpro.so
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rooms">
                <Button variant="outline">Book Another Room</Button>
              </Link>
              <Link href="/facilities">
                <Button variant="outline">Explore Hotel Facilities</Button>
              </Link>
              <Link href="/">
                <Button>Return to Homepage</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
