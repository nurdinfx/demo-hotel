"use client"

import { useState, useEffect } from "react"

export interface Translations {
  // Navigation
  home: string
  rooms: string
  facilities: string
  contact: string
  dashboard: string
  admin: string

  // Authentication
  login: string
  signup: string
  logout: string
  email: string
  password: string
  name: string
  phone: string

  // Booking
  checkIn: string
  checkOut: string
  guests: string
  book: string
  booking: string
  bookings: string

  // Common
  welcome: string
  loading: string
  error: string
  success: string
  cancel: string
  confirm: string
  save: string
  edit: string
  delete: string
  search: string
  filter: string

  // Hotel specific
  deluxeRoom: string
  standardRoom: string
  suite: string
  familyRoom: string
  oceanView: string
  cityView: string
  gardenView: string

  // Status
  confirmed: string
  pending: string
  cancelled: string
  completed: string
}

const englishTranslations: Translations = {
  // Navigation
  home: "Home",
  rooms: "Rooms",
  facilities: "Facilities",
  contact: "Contact",
  dashboard: "Dashboard",
  admin: "Admin",

  // Authentication
  login: "Login",
  signup: "Sign Up",
  logout: "Logout",
  email: "Email",
  password: "Password",
  name: "Name",
  phone: "Phone",

  // Booking
  checkIn: "Check In",
  checkOut: "Check Out",
  guests: "Guests",
  book: "Book",
  booking: "Booking",
  bookings: "Bookings",

  // Common
  welcome: "Welcome",
  loading: "Loading",
  error: "Error",
  success: "Success",
  cancel: "Cancel",
  confirm: "Confirm",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
  search: "Search",
  filter: "Filter",

  // Hotel specific
  deluxeRoom: "Deluxe Room",
  standardRoom: "Standard Room",
  suite: "Suite",
  familyRoom: "Family Room",
  oceanView: "Ocean View",
  cityView: "City View",
  gardenView: "Garden View",

  // Status
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
}

const somaliTranslations: Translations = {
  // Navigation
  home: "Guriga",
  rooms: "Qolalka",
  facilities: "Adeegyada",
  contact: "Xiriir",
  dashboard: "Shabakada",
  admin: "Maamule",

  // Authentication
  login: "Gal",
  signup: "Isdiiwaangeli",
  logout: "Ka bax",
  email: "Iimaylka",
  password: "Sirta",
  name: "Magaca",
  phone: "Telefoonka",

  // Booking
  checkIn: "Soo gal",
  checkOut: "Ka bax",
  guests: "Martida",
  book: "Buugi",
  booking: "Buuginta",
  bookings: "Buugitaannada",

  // Common
  welcome: "Soo dhawoow",
  loading: "Raraya",
  error: "Qalad",
  success: "Guul",
  cancel: "Jooji",
  confirm: "Xaqiiji",
  save: "Kaydi",
  edit: "Wax ka beddel",
  delete: "Tirtir",
  search: "Raadi",
  filter: "Kala saar",

  // Hotel specific
  deluxeRoom: "Qol Raaxo leh",
  standardRoom: "Qol Caadi ah",
  suite: "Qol weyn",
  familyRoom: "Qol Qoys",
  oceanView: "Muuqaal Badda",
  cityView: "Muuqaal Magaalada",
  gardenView: "Muuqaal Beerta",

  // Status
  confirmed: "La xaqiijiyay",
  pending: "La sugayaa",
  cancelled: "La joojiyay",
  completed: "La dhammeeyay",
}

export function useLanguage() {
  const [language, setLanguage] = useState<"en" | "so">("en")
  const [translations, setTranslations] = useState<Translations>(englishTranslations)

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("hotel-language") as "en" | "so"
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "so")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(language === "so" ? somaliTranslations : englishTranslations)

    // Save language preference
    localStorage.setItem("hotel-language", language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "so" : "en"))
  }

  const setLanguagePreference = (lang: "en" | "so") => {
    setLanguage(lang)
  }

  return {
    language,
    translations,
    toggleLanguage,
    setLanguagePreference,
  }
}
