"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Users,
  Bed,
  Filter,
  Calendar,
  MapPin,
  Eye,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { useBookings } from "@/contexts/booking-context"
import { NotificationCenter } from "@/components/notification-center"
import { ChatWidget } from "@/components/chat-widget"
import { useAuth } from "@/contexts/auth-context"

const rooms = [
  {
    id: 1,
    name: "Deluxe Ocean View",
    nameAr: "غرفة فاخرة بإطلالة على المحيط",
    price: 150,
    originalPrice: 200,
    image: "/placeholder.svg?height=300&width=400&text=Deluxe+Ocean+View",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Ocean+View+1",
      "/placeholder.svg?height=300&width=400&text=Ocean+View+2",
      "/placeholder.svg?height=300&width=400&text=Ocean+View+3",
    ],
    rating: 4.8,
    reviews: 124,
    capacity: 2,
    beds: 1,
    size: 45,
    type: "deluxe",
    amenities: ["Ocean View", "King Bed", "Balcony", "Mini Bar", "Free WiFi", "Air Conditioning"],
    description: "Experience luxury with breathtaking ocean views from your private balcony.",
    descriptionAr: "استمتع بالفخامة مع إطلالات خلابة على المحيط من شرفتك الخاصة.",
    features: ["24/7 Room Service", "Premium Bedding", "Marble Bathroom", "Smart TV"],
    location: "Floor 5-8, Ocean Side",
    available: true,
  },
  {
    id: 2,
    name: "Executive Suite",
    nameAr: "جناح تنفيذي",
    price: 250,
    originalPrice: 320,
    image: "/placeholder.svg?height=300&width=400&text=Executive+Suite",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Executive+1",
      "/placeholder.svg?height=300&width=400&text=Executive+2",
      "/placeholder.svg?height=300&width=400&text=Executive+3",
    ],
    rating: 4.9,
    reviews: 89,
    capacity: 4,
    beds: 2,
    size: 75,
    type: "suite",
    amenities: ["City View", "Separate Living Area", "Work Desk", "Premium WiFi", "Kitchenette", "Butler Service"],
    description: "Spacious suite perfect for business travelers and extended stays.",
    descriptionAr: "جناح واسع مثالي لرجال الأعمال والإقامات الطويلة.",
    features: ["Executive Lounge Access", "Complimentary Breakfast", "Airport Transfer", "Meeting Room Access"],
    location: "Floor 10-12, City View",
    available: true,
  },
  {
    id: 3,
    name: "Standard Room",
    nameAr: "غرفة عادية",
    price: 80,
    originalPrice: 100,
    image: "/placeholder.svg?height=300&width=400&text=Standard+Room",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Standard+1",
      "/placeholder.svg?height=300&width=400&text=Standard+2",
    ],
    rating: 4.5,
    reviews: 256,
    capacity: 2,
    beds: 1,
    size: 25,
    type: "standard",
    amenities: ["Garden View", "Queen Bed", "Free WiFi", "Air Conditioning", "Cable TV"],
    description: "Comfortable and affordable accommodation with all essential amenities.",
    descriptionAr: "إقامة مريحة وبأسعار معقولة مع جميع وسائل الراحة الأساسية.",
    features: ["Daily Housekeeping", "Complimentary Toiletries", "Safe Deposit Box"],
    location: "Floor 2-4, Garden View",
    available: true,
  },
  {
    id: 4,
    name: "Family Room",
    nameAr: "غرفة عائلية",
    price: 180,
    originalPrice: 230,
    image: "/placeholder.svg?height=300&width=400&text=Family+Room",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Family+1",
      "/placeholder.svg?height=300&width=400&text=Family+2",
      "/placeholder.svg?height=300&width=400&text=Family+3",
    ],
    rating: 4.7,
    reviews: 167,
    capacity: 6,
    beds: 3,
    size: 60,
    type: "family",
    amenities: ["Connecting Rooms", "Bunk Beds", "Play Area", "Family Bathroom", "Refrigerator", "Microwave"],
    description: "Perfect for families with children, featuring connecting rooms and kid-friendly amenities.",
    descriptionAr: "مثالية للعائلات التي لديها أطفال، تتميز بغرف متصلة ووسائل راحة مناسبة للأطفال.",
    features: ["Kids Welcome Kit", "Babysitting Service", "Children's Menu", "Game Console"],
    location: "Floor 3-5, Family Wing",
    available: true,
  },
  {
    id: 5,
    name: "Presidential Suite",
    nameAr: "الجناح الرئاسي",
    price: 500,
    originalPrice: 600,
    image: "/placeholder.svg?height=300&width=400&text=Presidential+Suite",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Presidential+1",
      "/placeholder.svg?height=300&width=400&text=Presidential+2",
      "/placeholder.svg?height=300&width=400&text=Presidential+3",
    ],
    rating: 5.0,
    reviews: 45,
    capacity: 6,
    beds: 3,
    size: 120,
    type: "suite",
    amenities: ["Panoramic View", "Private Terrace", "Jacuzzi", "Butler Service", "Premium Bar", "Dining Area"],
    description: "Ultimate luxury experience with exclusive amenities and services.",
    descriptionAr: "تجربة فاخرة نهائية مع وسائل الراحة والخدمات الحصرية.",
    features: ["Personal Butler", "Private Chef", "Helicopter Transfer", "VIP Lounge"],
    location: "Floor 15, Penthouse",
    available: true,
  },
  {
    id: 6,
    name: "Business Room",
    nameAr: "غرفة الأعمال",
    price: 120,
    originalPrice: 150,
    image: "/placeholder.svg?height=300&width=400&text=Business+Room",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Business+1",
      "/placeholder.svg?height=300&width=400&text=Business+2",
    ],
    rating: 4.6,
    reviews: 92,
    capacity: 2,
    beds: 1,
    size: 35,
    type: "business",
    amenities: ["City View", "Work Desk", "High-Speed WiFi", "Printer Access", "Coffee Machine", "Meeting Area"],
    description: "Designed for business travelers with work-focused amenities.",
    descriptionAr: "مصممة لرجال الأعمال مع وسائل الراحة المركزة على العمل.",
    features: ["Business Center Access", "Express Check-in", "Late Check-out", "Conference Room"],
    location: "Floor 6-9, Business Wing",
    available: true,
  },
]

export default function RoomsPage() {
  const { language, translations } = useLanguage()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const { getRoomOccupancy } = useBookings()

  // Get search parameters from URL
  const urlCheckIn = searchParams.get("checkIn")
  const urlCheckOut = searchParams.get("checkOut")
  const urlGuests = searchParams.get("guests")
  const isFromSearch = searchParams.get("search") === "true"

  // State for filters
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 600])
  const [roomType, setRoomType] = useState("all")
  const [capacity, setCapacity] = useState(urlGuests || "all")
  const [checkIn, setCheckIn] = useState(urlCheckIn || "")
  const [checkOut, setCheckOut] = useState(urlCheckOut || "")
  const [showFilters, setShowFilters] = useState(false)
  const [showAvailableOnly, setShowAvailableOnly] = useState(isFromSearch)
  const [sortBy, setSortBy] = useState("price-low")

  // Set default dates if coming from search
  useEffect(() => {
    if (isFromSearch && !checkIn && !checkOut) {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const dayAfter = new Date(today)
      dayAfter.setDate(today.getDate() + 2)

      setCheckIn(tomorrow.toISOString().split("T")[0])
      setCheckOut(dayAfter.toISOString().split("T")[0])
    }
  }, [isFromSearch, checkIn, checkOut])

  // Check if room is available for selected dates
  const isRoomAvailable = (roomId: number) => {
    // If no dates selected, show as available
    if (!checkIn || !checkOut) return true

    const start = new Date(checkIn)
    const end = new Date(checkOut)

    // Validate dates
    if (start >= end) return false
    if (start < new Date()) return false

    // Check each day in the range
    const current = new Date(start)
    while (current < end) {
      if (getRoomOccupancy(`room-${roomId}`, current.toISOString().split("T")[0])) {
        return false
      }
      current.setDate(current.getDate() + 1)
    }
    return true
  }

  // Filter rooms based on criteria
  const filteredRooms = rooms
    .filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.nameAr.includes(searchTerm) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.amenities.some((amenity) => amenity.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1]
      const matchesType = roomType === "all" || room.type === roomType
      const matchesCapacity = capacity === "all" || room.capacity >= Number.parseInt(capacity)
      const matchesAvailability = !showAvailableOnly || (room.available && isRoomAvailable(room.id))

      return matchesSearch && matchesPrice && matchesType && matchesCapacity && matchesAvailability
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "capacity":
          return b.capacity - a.capacity
        default:
          return 0
      }
    })

  const buildBookingUrl = (roomId: number) => {
    const params = new URLSearchParams()
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    if (capacity !== "all") params.set("guests", capacity)

    return `/booking/${roomId}?${params.toString()}`
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setPriceRange([0, 600])
    setRoomType("all")
    setCapacity("all")
    setCheckIn("")
    setCheckOut("")
    setShowAvailableOnly(false)
    setSortBy("price-low")
  }

  const hasSearchParams = urlCheckIn || urlCheckOut || urlGuests

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
            <Link href="/rooms" className="text-blue-600 font-medium">
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
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <NotificationCenter />
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline">{translations.dashboard}</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>{translations.signIn}</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{translations.ourRooms}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Discover our carefully curated selection of rooms, each designed to provide comfort and luxury for your
            perfect stay.
          </p>
        </div>

        {/* Search Summary */}
        {hasSearchParams && (
          <Card className="mb-8 border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Your Search</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {urlCheckIn && (
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <p className="font-medium">{new Date(urlCheckIn).toLocaleDateString()}</p>
                  </div>
                )}
                {urlCheckOut && (
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <p className="font-medium">{new Date(urlCheckOut).toLocaleDateString()}</p>
                  </div>
                )}
                {urlGuests && (
                  <div>
                    <span className="text-gray-600">Guests:</span>
                    <p className="font-medium">
                      {urlGuests} {Number.parseInt(urlGuests) === 1 ? "Guest" : "Guests"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="sticky top-24 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filter & Search</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label className="text-base font-medium mb-3 block flex items-center space-x-1">
                    <Search className="w-4 h-4" />
                    <span>Search Rooms</span>
                  </Label>
                  <Input
                    placeholder="Search by name, amenities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>

                <Separator />

                {/* Date Range */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Dates</Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="checkIn" className="text-sm">
                        Check-in
                      </Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut" className="text-sm">
                        Check-out
                      </Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        className="border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={600}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Room Type */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Room Type</Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Capacity */}
                <div>
                  <Label className="text-base font-medium mb-3 block flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Guests</span>
                  </Label>
                  <Select value={capacity} onValueChange={setCapacity}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Number</SelectItem>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3+ Guests</SelectItem>
                      <SelectItem value="4">4+ Guests</SelectItem>
                      <SelectItem value="6">6+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Sort By */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="capacity">Largest Capacity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Availability Filter */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="availableOnly"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="availableOnly" className="text-sm cursor-pointer">
                    Show available rooms only
                  </Label>
                </div>

                {/* Clear Filters */}
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:border-blue-500 bg-transparent"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{language === "en" ? "Available Rooms" : "الغرف المتاحة"}</h2>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} found
              </Badge>
            </div>

            {filteredRooms.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={clearAllFilters} size="lg">
                  Clear All Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRooms.map((room) => {
                  const roomAvailable = isRoomAvailable(room.id)

                  return (
                    <Card
                      key={room.id}
                      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:shadow-blue-100/50 hover:-translate-y-2"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={room.image || "/placeholder.svg"}
                          alt={language === "en" ? room.name : room.nameAr}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Overlay with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Availability Badge */}
                        <div className="absolute top-4 left-4">
                          {roomAvailable ? (
                            <Badge className="bg-green-600 text-white font-semibold px-3 py-1">Available</Badge>
                          ) : (
                            <Badge variant="destructive" className="font-semibold px-3 py-1">
                              Booked
                            </Badge>
                          )}
                        </div>

                        {/* Discount Badge */}
                        {room.originalPrice > room.price && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-red-500 text-white font-semibold px-3 py-1 text-sm">
                              {Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>
                        )}

                        {/* Favorite Button */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-16 right-4 w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>

                        {/* View Details Button - Appears on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Link href={buildBookingUrl(room.id)}>
                            <Button
                              size="lg"
                              className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl transform scale-95 group-hover:scale-100 transition-all duration-300 font-semibold px-8"
                            >
                              <Eye className="w-5 h-5 mr-2" />
                              View Details
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Room Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
                              {language === "en" ? room.name : room.nameAr}
                            </h3>
                            <div className="flex items-center space-x-1 mb-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{room.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{room.rating}</span>
                              <span className="text-sm text-gray-600">({room.reviews})</span>
                            </div>
                          </div>
                        </div>

                        {/* Room Info */}
                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{room.capacity} guests</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bed className="w-4 h-4" />
                            <span>
                              {room.beds} bed{room.beds > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>{room.size}m²</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {language === "en" ? room.description : room.descriptionAr}
                        </p>

                        {/* Amenities */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {amenity}
                              </Badge>
                            ))}
                            {room.amenities.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                +{room.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Pricing and CTA */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <div className="flex items-center space-x-2">
                              {room.originalPrice > room.price && (
                                <span className="text-sm text-gray-400 line-through">${room.originalPrice}</span>
                              )}
                              <span className="text-2xl font-bold text-blue-600">${room.price}</span>
                            </div>
                            <span className="text-sm text-gray-600">per night</span>
                          </div>

                          {roomAvailable ? (
                            <Link href={buildBookingUrl(room.id)}>
                              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Book Now
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              disabled
                              className="bg-gray-300 text-gray-500 cursor-not-allowed px-6 py-2 rounded-lg"
                            >
                              Not Available
                            </Button>
                          )}
                        </div>

                        {/* Availability Status */}
                        {checkIn && checkOut && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {roomAvailable ? (
                                  <span className="text-green-600">✓ Available for your dates</span>
                                ) : (
                                  <span className="text-red-600">✗ Not available for selected dates</span>
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  )
}
