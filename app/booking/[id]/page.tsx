"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Star, ArrowLeft, Calendar, Users, Bed } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/contexts/auth-context"
import { useBookings } from "@/contexts/booking-context"
import { useRouter } from "next/navigation"
import { DemoPayment } from "@/components/demo-payment"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function BookingPage({ params }: { params: { id: string } }) {
  const { language, translations } = useLanguage()
  const { user } = useAuth()
  const { addBooking, getRoomOccupancy, getRoomById } = useBookings()
  const { toast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState<"details" | "payment">("details")
  const room = getRoomById(params.id)

  useEffect(() => {
    if (!room) {
      toast({
        title: "Room Not Found",
        description: "The selected room does not exist.",
        variant: "destructive",
      })
      router.push("/rooms")
    }
  }, [room, toast, router])

  // Set default dates (today + 1 for check-in, today + 2 for check-out)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const dayAfter = new Date(today)
  dayAfter.setDate(today.getDate() + 2)

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split("T")[0])
  const [checkOut, setCheckOut] = useState(dayAfter.toISOString().split("T")[0])
  const [guests, setGuests] = useState("2")
  const [specialRequests, setSpecialRequests] = useState("")
  const [guestInfo, setGuestInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const subtotal = room ? nights * room.price : 0

  // Check if room is available for selected dates
  const isRoomAvailable = () => {
    if (!room || !checkIn || !checkOut) return true

    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const current = new Date(start)

    while (current < end) {
      if (getRoomOccupancy(room.id, current.toISOString().split("T")[0])) {
        return false
      }
      current.setDate(current.getDate() + 1)
    }
    return true
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!checkIn || !checkOut || !guestInfo.firstName || !guestInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      })
      return
    }

    if (new Date(checkIn) < new Date()) {
      toast({
        title: "Invalid Date",
        description: "Check-in date cannot be in the past.",
        variant: "destructive",
      })
      return
    }

    if (!isRoomAvailable()) {
      toast({
        title: "Room Not Available",
        description: "This room is not available for the selected dates. Please choose different dates.",
        variant: "destructive",
      })
      return
    }

    setStep("payment")
  }

  const handlePaymentSuccess = () => {
    if (!room) return
    // Create booking record
    const bookingId = addBooking({
      userId: user?.id || "guest-user",
      userName: `${guestInfo.firstName} ${guestInfo.lastName}`,
      userEmail: guestInfo.email,
      roomId: room.id,
      roomName: room.name,
      roomType: room.type,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: Number.parseInt(guests),
      nights: nights,
      totalAmount: subtotal,
      status: "confirmed",
      paymentMethod: "Demo Payment",
      paymentStatus: "paid",
      specialRequests: specialRequests,
      guestPhone: guestInfo.phone,
    })

    toast({
      title: "Booking Confirmed!",
      description: `Your booking has been confirmed. Booking ID: ${bookingId.slice(-8).toUpperCase()}`,
    })

    router.push(`/booking/confirmation?id=${bookingId}`)
  }

  const handlePaymentCancel = () => {
    setStep("details")
  }

  // Get minimum date (today)
  const minDate = new Date().toISOString().split("T")[0]

  if (!room) {
    return null // or a loading spinner if you want
  }

  if (step === "payment") {
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
              <Button variant="outline" onClick={() => setStep("details")}> 
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
              <p className="text-gray-600">Secure your booking with our demo payment system</p>
            </div>

            <DemoPayment
              amount={subtotal}
              bookingId={`HTL-${Date.now()}`}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
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
            <span className="text-xl font-bold">HotelPro</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/rooms">
              <Button variant="outline">Back to Rooms</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={guestInfo.firstName}
                          onChange={(e) => setGuestInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={guestInfo.lastName}
                          onChange={(e) => setGuestInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+252 61 234 5678"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="checkIn">{translations.checkIn} *</Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={checkIn}
                          min={minDate}
                          onChange={(e) => setCheckIn(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkOut">{translations.checkOut} *</Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={checkOut}
                          min={checkIn || minDate}
                          onChange={(e) => setCheckOut(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="guests">{translations.guests}</Label>
                        <Select value={guests} onValueChange={setGuests}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Guest</SelectItem>
                            <SelectItem value="2">2 Guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                      <Textarea
                        id="specialRequests"
                        placeholder="Any special requests or preferences..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Room Availability Status */}
                    {checkIn && checkOut && (
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-medium">Availability Status:</span>
                          {isRoomAvailable() ? (
                            <Badge className="bg-green-600">Available</Badge>
                          ) : (
                            <Badge variant="destructive">Not Available</Badge>
                          )}
                        </div>
                        {!isRoomAvailable() && (
                          <p className="text-sm text-red-600 mt-2">
                            This room is not available for the selected dates. Please choose different dates.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!checkIn || !checkOut || !guestInfo.firstName || !guestInfo.email || !isRoomAvailable()}
                >
                  Continue to Payment - ${subtotal.toFixed(2)}
                </Button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Room Details */}
                  <div className="flex space-x-4">
                    <img
                      src={room.image || "/placeholder.svg"}
                      alt={language === "en" ? room.name : room.nameAr}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{language === "en" ? room.name : room.nameAr}</h3>
                      <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>{room.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{room.capacity}</span>
                        </div>
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{room.beds}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Info */}
                  {checkIn && checkOut && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Check-in:</span>
                        <span className="font-medium">{new Date(checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Check-out:</span>
                        <span className="font-medium">{new Date(checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nights:</span>
                        <span className="font-medium">{nights}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Guests:</span>
                        <span className="font-medium">{guests}</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  {nights > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>
                          ${room.price} × {nights} nights
                        </span>
                        <span>${subtotal}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>{translations.totalPrice}</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  <div>
                    <h4 className="font-medium mb-2">Room Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
