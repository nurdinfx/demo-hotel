"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Room {
  id: string
  name: string
  type: string
  price: number
  image: string
  amenities: string[]
  maxGuests: number
  size: string
  description: string
  available: boolean
  rating: number
  reviews: number
}

export interface Guest {
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  idNumber: string
  specialRequests?: string
}

export interface Booking {
  id: string
  userId: string
  userName: string
  userEmail: string
  roomId: string
  roomName: string
  roomType: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  totalAmount: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  specialRequests?: string
  guestPhone?: string
  createdAt: string
  updatedAt: string
}

interface BookingContextType {
  bookings: Booking[]
  rooms: Room[]
  currentBooking: Booking | null
  isLoading: boolean
  addBooking: (bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">) => string
  updateBooking: (id: string, updates: Partial<Booking>) => void
  cancelBooking: (id: string) => void
  getBookingById: (id: string) => Booking | undefined
  getBookingsByUser: (userId: string) => Booking[]
  getRoomOccupancy: (roomId: string, date: string) => boolean
  getAllBookings: () => Booking[]
  createBooking: (bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  getRoomById: (id: string) => Room | undefined
  checkRoomAvailability: (roomId: string, checkIn: string, checkOut: string) => boolean
  setCurrentBooking: (booking: Booking | null) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

// Sample rooms data
const sampleRooms: Room[] = [
  {
    id: "1",
    name: "Deluxe Ocean View",
    type: "Deluxe",
    price: 150,
    image: "/placeholder.svg?height=300&width=400&text=Deluxe+Ocean+View",
    amenities: ["Ocean View", "King Bed", "WiFi", "Mini Bar", "Balcony"],
    maxGuests: 2,
    size: "35 m²",
    description: "Luxurious room with stunning ocean views and premium amenities.",
    available: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Executive Suite",
    type: "Suite",
    price: 250,
    image: "/placeholder.svg?height=300&width=400&text=Executive+Suite",
    amenities: ["City View", "King Bed", "WiFi", "Mini Bar", "Living Area", "Work Desk"],
    maxGuests: 3,
    size: "55 m²",
    description: "Spacious suite perfect for business travelers with separate living area.",
    available: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "3",
    name: "Standard Room",
    type: "Standard",
    price: 80,
    image: "/placeholder.svg?height=300&width=400&text=Standard+Room",
    amenities: ["Garden View", "Queen Bed", "WiFi", "Air Conditioning"],
    maxGuests: 2,
    size: "25 m²",
    description: "Comfortable standard room with all essential amenities.",
    available: true,
    rating: 4.5,
    reviews: 203,
  },
  {
    id: "4",
    name: "Family Room",
    type: "Family",
    price: 180,
    image: "/placeholder.svg?height=300&width=400&text=Family+Room",
    amenities: ["Garden View", "2 Queen Beds", "WiFi", "Mini Fridge", "Extra Space"],
    maxGuests: 4,
    size: "45 m²",
    description: "Perfect for families with children, featuring two queen beds.",
    available: true,
    rating: 4.7,
    reviews: 156,
  },
]

// Demo bookings for testing
const initialBookings: Booking[] = [
  {
    id: "HTL-2024-001",
    userId: "guest-1",
    userName: "Fatima Ahmed",
    userEmail: "fatima@example.com",
    roomId: "1",
    roomName: "Deluxe Ocean View",
    roomType: "deluxe",
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    guests: 2,
    nights: 3,
    totalAmount: 450,
    status: "confirmed",
    paymentMethod: "ZAAD",
    paymentStatus: "paid",
    specialRequests: "Late check-in requested",
    guestPhone: "+252 61 987 6543",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "HTL-2024-002",
    userId: "guest-1",
    userName: "Fatima Ahmed",
    userEmail: "fatima@example.com",
    roomId: "3",
    roomName: "Standard Room",
    roomType: "standard",
    checkIn: "2024-03-20",
    checkOut: "2024-03-22",
    guests: 1,
    nights: 2,
    totalAmount: 160,
    status: "pending",
    paymentMethod: "EVC Plus",
    paymentStatus: "pending",
    guestPhone: "+252 61 987 6543",
    createdAt: "2024-01-22T14:30:00Z",
    updatedAt: "2024-01-22T14:30:00Z",
  },
  {
    id: "HTL-2024-003",
    userId: "guest-1",
    userName: "Fatima Ahmed",
    userEmail: "fatima@example.com",
    roomId: "2",
    roomName: "Executive Suite",
    roomType: "suite",
    checkIn: "2024-01-10",
    checkOut: "2024-01-13",
    guests: 2,
    nights: 3,
    totalAmount: 750,
    status: "completed",
    paymentMethod: "ZAAD",
    paymentStatus: "paid",
    guestPhone: "+252 61 987 6543",
    createdAt: "2024-01-05T09:00:00Z",
    updatedAt: "2024-01-13T12:00:00Z",
  },
]

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [rooms] = useState<Room[]>(sampleRooms)
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem("hotel-bookings")
    if (savedBookings) {
      try {
        const parsed = JSON.parse(savedBookings)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings(parsed)
        }
      } catch (error) {
        console.error("Error loading bookings:", error)
      }
    }
  }, [])

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem("hotel-bookings", JSON.stringify(bookings))
  }, [bookings])

  const generateBookingId = (): string => {
    return `HTL-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }

  const addBooking = (bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">): string => {
    const newBooking: Booking = {
      ...bookingData,
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setBookings((prev) => [...prev, newBooking])
    return newBooking.id
  }

  const createBooking = async (bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newBooking: Booking = {
        ...bookingData,
        id: generateBookingId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setBookings((prev) => [...prev, newBooking])
      setCurrentBooking(newBooking)
      return true
    } catch (error) {
      console.error("Error creating booking:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, ...updates, updatedAt: new Date().toISOString() } : booking,
      ),
    )
  }

  const cancelBooking = (id: string) => {
    updateBooking(id, { status: "cancelled" })
  }

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((booking) => booking.id === id)
  }

  const getBookingsByUser = (userId: string): Booking[] => {
    return bookings.filter((booking) => booking.userId === userId)
  }

  const getRoomOccupancy = (roomId: string, date: string): boolean => {
    return bookings.some((booking) => {
      if (booking.roomId !== roomId || booking.status === "cancelled") {
        return false
      }

      const checkInDate = new Date(booking.checkIn)
      const checkOutDate = new Date(booking.checkOut)
      const queryDate = new Date(date)

      return queryDate >= checkInDate && queryDate < checkOutDate
    })
  }

  const getAllBookings = (): Booking[] => {
    return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const getRoomById = (id: string): Room | undefined => {
    return rooms.find((room) => room.id === id)
  }

  const checkRoomAvailability = (roomId: string, checkIn: string, checkOut: string): boolean => {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    // Check if room exists
    const room = getRoomById(roomId)
    if (!room || !room.available) return false

    // Check for conflicting bookings
    const conflictingBookings = bookings.filter((booking) => {
      if (booking.roomId !== roomId || booking.status === "cancelled") return false

      const bookingCheckIn = new Date(booking.checkIn)
      const bookingCheckOut = new Date(booking.checkOut)

      // Check for date overlap
      return checkInDate < bookingCheckOut && checkOutDate > bookingCheckIn
    })

    return conflictingBookings.length === 0
  }

  const value: BookingContextType = {
    bookings,
    rooms,
    currentBooking,
    isLoading,
    addBooking,
    updateBooking,
    cancelBooking,
    getBookingById,
    getBookingsByUser,
    getRoomOccupancy,
    getAllBookings,
    createBooking,
    getRoomById,
    checkRoomAvailability,
    setCurrentBooking,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBookings = () => {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider")
  }
  return context
}
