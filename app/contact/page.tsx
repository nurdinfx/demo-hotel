"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Globe,
  Car,
  Plane,
  Navigation,
  CheckCircle,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/contexts/auth-context"
import { NotificationCenter } from "@/components/notification-center"
import { useToast } from "@/hooks/use-toast"

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    titleAr: "الهاتف",
    details: ["+252 61 234 5678", "+252 61 234 5679"],
    description: "Available 24/7 for reservations and support",
    descriptionAr: "متاح 24/7 للحجوزات والدعم",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Mail,
    title: "Email",
    titleAr: "البريد الإلكتروني",
    details: ["info@hotelpro.so", "reservations@hotelpro.so"],
    description: "We respond within 2 hours",
    descriptionAr: "نرد خلال ساعتين",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    titleAr: "الدردشة المباشرة",
    details: ["Available on website", "Instant responses"],
    description: "Chat with our support team",
    descriptionAr: "تحدث مع فريق الدعم",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Globe,
    title: "Social Media",
    titleAr: "وسائل التواصل الاجتماعي",
    details: ["@HotelProSomalia", "Facebook, Instagram, Twitter"],
    description: "Follow us for updates",
    descriptionAr: "تابعنا للحصول على التحديثات",
    color: "bg-orange-100 text-orange-600",
  },
]

const departments = [
  { value: "general", label: "General Inquiry", labelAr: "استفسار عام" },
  { value: "reservations", label: "Reservations", labelAr: "الحجوزات" },
  { value: "events", label: "Events & Meetings", labelAr: "الفعاليات والاجتماعات" },
  { value: "facilities", label: "Facilities", labelAr: "المرافق" },
  { value: "feedback", label: "Feedback", labelAr: "التعليقات" },
  { value: "support", label: "Technical Support", labelAr: "الدعم الفني" },
]

export default function ContactPage() {
  const { language, translations } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 2 hours.",
    })

    setIsSubmitting(false)
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      department: "",
      subject: "",
      message: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
            <Link href="/facilities" className="text-gray-600 hover:text-gray-900">
              {translations.facilities}
            </Link>
            <Link href="/contact" className="text-blue-600 font-medium">
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
      <section className="relative h-[400px] bg-gradient-to-r from-teal-900 via-blue-900 to-indigo-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/placeholder.svg?height=400&width=1200&text=Contact+Us')",
          }}
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl mb-8 opacity-90">
              We're here to help make your stay exceptional. Contact us anytime for assistance, reservations, or
              inquiries.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Multilingual Staff</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Quick Response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+252 61 234 5678"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => handleInputChange("department", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {language === "en" ? dept.label : dept.labelAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                      className="mt-1 min-h-[120px]"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="w-5 h-5 mr-2 animate-pulse" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${method.color}`}>
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {language === "en" ? method.title : method.titleAr}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {language === "en" ? method.description : method.descriptionAr}
                        </p>
                        {method.details.map((detail, idx) => (
                          <p key={idx} className="text-sm font-medium text-gray-900">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Location & Hours */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Location & Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Address</h4>
                  <p className="text-gray-600">
                    123 Ocean Drive
                    <br />
                    Mogadishu, Somalia
                    <br />
                    Postal Code: 00252
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Operating Hours</span>
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Front Desk:</span>
                      <span className="font-medium">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Restaurant:</span>
                      <span className="font-medium">6:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spa & Wellness:</span>
                      <span className="font-medium">8:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Business Center:</span>
                      <span className="font-medium">24/7</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transportation */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="w-5 h-5 text-green-600" />
                  <span>Transportation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Plane className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium">From Airport</p>
                    <p className="text-sm text-gray-600">15 minutes by car</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium">Free Parking</p>
                    <p className="text-sm text-gray-600">Available for guests</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Navigation className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium">Airport Shuttle</p>
                    <p className="text-sm text-gray-600">Available on request</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Preview */}
            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex justify-center items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                  <p className="text-sm text-gray-600 mb-4">Based on 1,247 reviews</p>
                  <p className="text-sm italic text-gray-700">
                    "Exceptional service and beautiful facilities. The staff went above and beyond!"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Recent Guest</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about our hotel and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">What are your check-in/check-out times?</h3>
              <p className="text-gray-600 text-sm">
                Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available
                upon request.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Do you offer airport transportation?</h3>
              <p className="text-gray-600 text-sm">
                Yes, we provide complimentary airport shuttle service. Please contact us 24 hours in advance to arrange
                pickup.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Is WiFi available throughout the hotel?</h3>
              <p className="text-gray-600 text-sm">
                Yes, high-speed WiFi is complimentary for all guests throughout the hotel, including rooms and public
                areas.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, local mobile payments (ZAAD, EVC Plus), and cash payments in USD and
                local currency.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
