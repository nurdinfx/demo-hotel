"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Utensils,
  SpadeIcon as Spa,
  Users,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/contexts/auth-context"
import { NotificationCenter } from "@/components/notification-center"

const facilities = [
  {
    id: 1,
    name: "Swimming Pool & Spa",
    nameAr: "المسبح والسبا",
    description:
      "Olympic-size swimming pool with adjacent spa and wellness center featuring massage therapy, sauna, and relaxation areas.",
    descriptionAr: "مسبح بحجم أولمبي مع سبا ومركز عافية مجاور يضم العلاج بالتدليك والساونا ومناطق الاسترخاء.",
    icon: Waves,
    category: "wellness",
    hours: "6:00 AM - 10:00 PM",
    location: "Ground Floor, West Wing",
    features: ["Olympic Pool", "Hot Tub", "Sauna", "Steam Room", "Massage Therapy", "Poolside Bar"],
    image: "/placeholder.svg?height=300&width=500&text=Swimming+Pool",
    rating: 4.9,
    price: "Free for guests",
    bookable: true,
  },
  {
    id: 2,
    name: "Fitness Center",
    nameAr: "مركز اللياقة البدنية",
    description: "State-of-the-art fitness center with modern equipment, personal trainers, and group fitness classes.",
    descriptionAr: "مركز لياقة بدنية حديث مع معدات عصرية ومدربين شخصيين وفصول لياقة جماعية.",
    icon: Dumbbell,
    category: "fitness",
    hours: "24/7",
    location: "2nd Floor, East Wing",
    features: [
      "Cardio Equipment",
      "Weight Training",
      "Personal Trainers",
      "Group Classes",
      "Yoga Studio",
      "Locker Rooms",
    ],
    image: "/placeholder.svg?height=300&width=500&text=Fitness+Center",
    rating: 4.8,
    price: "Free for guests",
    bookable: true,
  },
  {
    id: 3,
    name: "Ocean View Restaurant",
    nameAr: "مطعم إطلالة المحيط",
    description:
      "Fine dining restaurant serving international cuisine with panoramic ocean views and live entertainment.",
    descriptionAr: "مطعم راقي يقدم المأكولات العالمية مع إطلالات بانورامية على المحيط وترفيه مباشر.",
    icon: Utensils,
    category: "dining",
    hours: "6:00 AM - 11:00 PM",
    location: "3rd Floor, Ocean Side",
    features: ["International Cuisine", "Ocean Views", "Live Music", "Private Dining", "Wine Cellar", "Chef's Table"],
    image: "/placeholder.svg?height=300&width=500&text=Restaurant",
    rating: 4.9,
    price: "À la carte",
    bookable: true,
  },
  {
    id: 4,
    name: "Business Center",
    nameAr: "مركز الأعمال",
    description: "Fully equipped business center with meeting rooms, high-speed internet, and professional services.",
    descriptionAr: "مركز أعمال مجهز بالكامل مع قاعات اجتماعات وإنترنت عالي السرعة وخدمات مهنية.",
    icon: Users,
    category: "business",
    hours: "24/7",
    location: "1st Floor, Main Building",
    features: [
      "Meeting Rooms",
      "High-Speed WiFi",
      "Printing Services",
      "Video Conferencing",
      "Secretary Services",
      "Catering",
    ],
    image: "/placeholder.svg?height=300&width=500&text=Business+Center",
    rating: 4.7,
    price: "Varies by service",
    bookable: true,
  },
  {
    id: 5,
    name: "Rooftop Lounge",
    nameAr: "صالة السطح",
    description: "Exclusive rooftop lounge with cocktail bar, city views, and evening entertainment.",
    descriptionAr: "صالة حصرية على السطح مع بار كوكتيل وإطلالات على المدينة وترفيه مسائي.",
    icon: Coffee,
    category: "entertainment",
    hours: "5:00 PM - 2:00 AM",
    location: "Rooftop, Main Building",
    features: ["Cocktail Bar", "City Views", "DJ Nights", "Private Events", "Outdoor Seating", "Hookah Lounge"],
    image: "/placeholder.svg?height=300&width=500&text=Rooftop+Lounge",
    rating: 4.8,
    price: "Premium pricing",
    bookable: true,
  },
  {
    id: 6,
    name: "Kids Club",
    nameAr: "نادي الأطفال",
    description: "Supervised kids club with games, activities, and educational programs for children aged 4-12.",
    descriptionAr: "نادي أطفال تحت الإشراف مع ألعاب وأنشطة وبرامج تعليمية للأطفال من سن 4-12.",
    icon: Users,
    category: "family",
    hours: "9:00 AM - 6:00 PM",
    location: "Ground Floor, Family Wing",
    features: ["Supervised Activities", "Educational Games", "Arts & Crafts", "Movie Room", "Playground", "Snack Area"],
    image: "/placeholder.svg?height=300&width=500&text=Kids+Club",
    rating: 4.6,
    price: "Free for guests",
    bookable: false,
  },
]

const categories = [
  { id: "all", name: "All Facilities", nameAr: "جميع المرافق" },
  { id: "wellness", name: "Wellness & Spa", nameAr: "العافية والسبا" },
  { id: "fitness", name: "Fitness", nameAr: "اللياقة البدنية" },
  { id: "dining", name: "Dining", nameAr: "المطاعم" },
  { id: "business", name: "Business", nameAr: "الأعمال" },
  { id: "entertainment", name: "Entertainment", nameAr: "الترفيه" },
  { id: "family", name: "Family", nameAr: "العائلة" },
]

export default function FacilitiesPage() {
  const { language, translations } = useLanguage()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookingFacility, setBookingFacility] = useState<number | null>(null)

  const filteredFacilities =
    selectedCategory === "all" ? facilities : facilities.filter((facility) => facility.category === selectedCategory)

  const handleBookFacility = (facilityId: number) => {
    setBookingFacility(facilityId)
    // In a real app, this would open a booking modal or redirect to booking page
    setTimeout(() => {
      setBookingFacility(null)
      alert("Facility booking request sent! You'll receive a confirmation shortly.")
    }, 2000)
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
            <Link href="/rooms" className="text-gray-600 hover:text-gray-900">
              {translations.rooms}
            </Link>
            <Link href="/facilities" className="text-blue-600 font-medium">
              {translations.facilities}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              {translations.contact}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user && <NotificationCenter />}

            {user ? (
              <div className="flex items-center space-x-2">
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button variant="outline">{translations.dashboard}</Button>
                </Link>
                <span className="text-sm text-gray-600">Hi, {user.name.split(" ")[0]}</span>
              </div>
            ) : (
              <Link href="/login">
                <Button>{translations.login}</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('/placeholder.svg?height=400&width=1200&text=Hotel+Facilities')",
          }}
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl font-bold mb-6">World-Class Facilities</h1>
            <p className="text-xl mb-8 opacity-90">
              Experience luxury and comfort with our premium amenities designed to make your stay unforgettable.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Professional Staff</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-none lg:flex">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm">
                  {language === "en" ? category.name : category.nameAr}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={facility.image || "/placeholder.svg"}
                  alt={language === "en" ? facility.name : facility.nameAr}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-900">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    {facility.rating}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-blue-600/90 rounded-full flex items-center justify-center">
                    <facility.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{language === "en" ? facility.name : facility.nameAr}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === "en" ? facility.description : facility.descriptionAr}
                    </p>
                  </div>
                </div>

                {/* Facility Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{facility.hours}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{facility.location}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Features & Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {facility.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing and Booking */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Pricing</p>
                    <p className="font-semibold text-lg">{facility.price}</p>
                  </div>

                  {facility.bookable && (
                    <Button
                      onClick={() => handleBookFacility(facility.id)}
                      disabled={bookingFacility === facility.id}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {bookingFacility === facility.id ? (
                        <>
                          <Calendar className="w-4 h-4 mr-2 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Now
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enhance your stay with our premium services and personalized experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Spa className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Concierge Service</h3>
              <p className="text-gray-600 mb-4">Personal assistance for reservations, tours, and special requests.</p>
              <Button variant="outline" className="bg-transparent">
                Learn More
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transportation</h3>
              <p className="text-gray-600 mb-4">Airport transfers, car rentals, and city tour arrangements.</p>
              <Button variant="outline" className="bg-transparent">
                Learn More
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium WiFi</h3>
              <p className="text-gray-600 mb-4">High-speed internet access throughout the hotel premises.</p>
              <Button variant="outline" className="bg-transparent">
                Learn More
              </Button>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Information?</h2>
          <p className="text-xl mb-6 opacity-90">Our team is ready to help you plan the perfect experience.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </Link>
            <Link href="/rooms">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Stay
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
