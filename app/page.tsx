"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Waves,
  Dumbbell,
  Calendar,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Search,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { NotificationCenter } from "@/components/notification-center"
import { ChatWidget } from "@/components/chat-widget"
import { PWAInstall } from "@/components/pwa-install"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const featuredRooms = [
  {
    id: 1,
    name: "Deluxe Ocean View",
    nameAr: "غرفة فاخرة بإطلالة على المحيط",
    price: 150,
    originalPrice: 180,
    image: "/placeholder.svg?height=300&width=400&text=Ocean+View",
    rating: 4.8,
    reviews: 124,
    amenities: ["Ocean View", "King Bed", "Balcony", "Mini Bar"],
  },
  {
    id: 2,
    name: "Executive Suite",
    nameAr: "جناح تنفيذي",
    price: 250,
    originalPrice: 300,
    image: "/placeholder.svg?height=300&width=400&text=Executive+Suite",
    rating: 4.9,
    reviews: 89,
    amenities: ["City View", "Living Area", "Work Desk", "Premium Bath"],
  },
  {
    id: 3,
    name: "Family Room",
    nameAr: "غرفة عائلية",
    price: 120,
    originalPrice: 150,
    image: "/placeholder.svg?height=300&width=400&text=Family+Room",
    rating: 4.7,
    reviews: 178,
    amenities: ["Garden View", "Twin Beds", "Family Bath", "Mini Fridge"],
  },
]

const testimonials = [
  {
    name: "Ahmed Hassan",
    location: "Mogadishu, Somalia",
    rating: 5,
    comment:
      "Exceptional service and beautiful ocean views. The staff went above and beyond to make our stay memorable.",
    avatar: "/placeholder.svg?height=60&width=60&text=AH",
  },
  {
    name: "Fatima Ali",
    location: "Hargeisa, Somalia",
    rating: 5,
    comment: "Perfect location and amazing amenities. The breakfast was outstanding and the rooms were spotless.",
    avatar: "/placeholder.svg?height=60&width=60&text=FA",
  },
  {
    name: "Mohamed Omar",
    location: "Bosaso, Somalia",
    rating: 4,
    comment: "Great value for money. The hotel exceeded our expectations in every way. Highly recommended!",
    avatar: "/placeholder.svg?height=60&width=60&text=MO",
  },
]

export default function HomePage() {
  const { language, translations, toggleLanguage } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  // Search form state
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const [isSearching, setIsSearching] = useState(false)

  // Set default dates (today + 1 for check-in, today + 2 for check-out)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const dayAfter = new Date(today)
  dayAfter.setDate(today.getDate() + 2)

  const defaultCheckIn = tomorrow.toISOString().split("T")[0]
  const defaultCheckOut = dayAfter.toISOString().split("T")[0]

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Validate dates
    const searchCheckIn = checkIn || defaultCheckIn
    const searchCheckOut = checkOut || defaultCheckOut

    if (new Date(searchCheckOut) <= new Date(searchCheckIn)) {
      alert("Check-out date must be after check-in date")
      setIsSearching(false)
      return
    }

    // Build search parameters
    const searchParams = new URLSearchParams({
      checkIn: searchCheckIn,
      checkOut: searchCheckOut,
      guests: guests,
      search: "true",
    })

    // Add a small delay for better UX
    setTimeout(() => {
      router.push(`/rooms?${searchParams.toString()}`)
      setIsSearching(false)
    }, 500)
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
            <Link href="/" className="text-blue-600 font-medium">
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
            <Button variant="ghost" onClick={toggleLanguage} className="text-sm">
              {language === "en" ? "SO" : "EN"}
            </Button>
            <NotificationCenter />
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="outline">{translations.dashboard}</Button>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline">Admin</Button>
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button>{translations.signIn}</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Active Search */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {language === "en" ? "Welcome to HotelPro" : "Ku soo dhawoow HotelPro"}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                {language === "en"
                  ? "Experience luxury and comfort in the heart of Somalia's most beautiful destinations"
                  : "La kulmo raaxada iyo quruxda xarunta meelaha ugu quruxda badan ee Soomaaliya"}
              </p>
            </div>

            {/* Enhanced Quick Booking Form */}
            <Card className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-800 flex items-center justify-center space-x-2">
                  <Search className="w-6 h-6 text-blue-600" />
                  <span>Find Your Perfect Room</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleQuickSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Check-in Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{translations.checkIn}</span>
                      </label>
                      <Input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="text-gray-900 border-2 border-gray-200 focus:border-blue-500 h-12"
                        required
                      />
                    </div>

                    {/* Check-out Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{translations.checkOut}</span>
                      </label>
                      <Input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        className="text-gray-900 border-2 border-gray-200 focus:border-blue-500 h-12"
                        required
                      />
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{translations.guests}</span>
                      </label>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger className="text-gray-900 border-2 border-gray-200 focus:border-blue-500 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                          <SelectItem value="4">4 Guests</SelectItem>
                          <SelectItem value="5">5 Guests</SelectItem>
                          <SelectItem value="6">6+ Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search Button */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-transparent">Search</label>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        disabled={isSearching}
                      >
                        {isSearching ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Searching...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Search className="w-5 h-5" />
                            <span>{translations.searchRooms}</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">50+</div>
                      <div className="text-sm text-gray-600">Luxury Rooms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">4.9</div>
                      <div className="text-sm text-gray-600">Guest Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">24/7</div>
                      <div className="text-sm text-gray-600">Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">Free</div>
                      <div className="text-sm text-gray-600">WiFi & Parking</div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center items-center space-x-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>5-Star Rated</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Prime Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Instant Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{translations.whyChooseUs}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes HotelPro the perfect choice for your stay in Somalia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
              <p className="text-gray-600">
                Located in the heart of the city with easy access to major attractions and business districts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5-Star Service</h3>
              <p className="text-gray-600">
                Experience world-class hospitality with our dedicated staff committed to your comfort.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Amenities</h3>
              <p className="text-gray-600">
                Enjoy complimentary WiFi, fitness center, swimming pool, and premium room amenities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer service and concierge assistance for all your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{translations.featuredRooms}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular rooms, each designed to provide the ultimate comfort and luxury
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{language === "en" ? room.name : room.nameAr}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">{room.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({room.reviews})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-600">${room.price}</span>
                        <span className="text-sm text-gray-500 line-through">${room.originalPrice}</span>
                      </div>
                      <span className="text-sm text-gray-600">per night</span>
                    </div>
                  </div>

                  <Link href={`/booking/${room.id}`} className="w-full">
                    <Button className="w-full">
                      {translations.bookNow}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/rooms">
              <Button variant="outline" size="lg">
                {translations.viewAllRooms}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hotel Amenities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">World-Class Amenities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience luxury and convenience with our comprehensive range of hotel facilities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Free WiFi</h3>
              <p className="text-sm text-gray-600">High-speed internet</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Free Parking</h3>
              <p className="text-sm text-gray-600">Secure parking space</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-1">Breakfast</h3>
              <p className="text-sm text-gray-600">Complimentary breakfast</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-1">Restaurant</h3>
              <p className="text-sm text-gray-600">Fine dining experience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Swimming Pool</h3>
              <p className="text-sm text-gray-600">Outdoor pool & spa</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-1">Fitness Center</h3>
              <p className="text-sm text-gray-600">24/7 gym access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read reviews from our satisfied guests who have experienced our exceptional hospitality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience HotelPro?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Book your stay today and discover why we're Somalia's premier hospitality destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rooms">
              <Button size="lg" variant="secondary">
                <Calendar className="w-5 h-5 mr-2" />
                Book Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="text-xl font-bold">HotelPro</span>
              </div>
              <p className="text-gray-400 mb-4">
                Experience luxury and comfort in Somalia's premier hotel destination.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/rooms" className="text-gray-400 hover:text-white transition-colors">
                    Rooms & Suites
                  </Link>
                </li>
                <li>
                  <Link href="/facilities" className="text-gray-400 hover:text-white transition-colors">
                    Facilities
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Room Service</li>
                <li className="text-gray-400">Concierge</li>
                <li className="text-gray-400">Airport Transfer</li>
                <li className="text-gray-400">Event Planning</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-gray-400">+252 61 234 5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-gray-400">info@hotelpro.so</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-gray-400">Mogadishu, Somalia</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 HotelPro. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
      <PWAInstall />
    </div>
  )
}
