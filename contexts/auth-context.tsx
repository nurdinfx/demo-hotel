"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "admin" | "guest"
  avatar?: string
  loyaltyPoints: number
  loyaltyTier: string
  joinedDate: string
  lastLogin: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: { name: string; email: string; phone?: string; password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users
const demoUsers: (User & { password: string })[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@hotelpro.so",
    phone: "+252 61 123 4567",
    role: "admin",
    password: "admin123",
    loyaltyPoints: 0,
    loyaltyTier: "Platinum",
    joinedDate: "2024-01-01T00:00:00.000Z",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "guest-1",
    name: "Fatima Ahmed",
    email: "fatima@example.com",
    phone: "+252 61 987 6543",
    role: "guest",
    password: "user123",
    loyaltyPoints: 1250,
    loyaltyTier: "Silver",
    joinedDate: "2024-06-15T00:00:00.000Z",
    lastLogin: new Date().toISOString(),
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("hotel-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error loading user:", error)
        localStorage.removeItem("hotel-user")
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("hotel-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("hotel-user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check demo users
      const demoUser = demoUsers.find((u) => u.email === email && u.password === password)
      if (demoUser) {
        const { password: _, ...userWithoutPassword } = demoUser
        const userWithUpdatedLogin = {
          ...userWithoutPassword,
          lastLogin: new Date().toISOString(),
        }
        setUser(userWithUpdatedLogin)
        return true
      }

      // Check registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("hotel-registered-users") || "[]")
      const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password)
      if (registeredUser) {
        const { password: _, ...userWithoutPassword } = registeredUser
        const userWithUpdatedLogin = {
          ...userWithoutPassword,
          lastLogin: new Date().toISOString(),
        }
        setUser(userWithUpdatedLogin)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: {
    name: string
    email: string
    phone?: string
    password: string
  }): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingDemoUser = demoUsers.find((u) => u.email === userData.email)
      if (existingDemoUser) {
        return false
      }

      const registeredUsers = JSON.parse(localStorage.getItem("hotel-registered-users") || "[]")
      const existingRegisteredUser = registeredUsers.find((u: any) => u.email === userData.email)
      if (existingRegisteredUser) {
        return false
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: "guest" as const,
        password: userData.password,
        loyaltyPoints: 100, // Welcome bonus
        loyaltyTier: "Bronze",
        joinedDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      // Save to registered users
      registeredUsers.push(newUser)
      localStorage.setItem("hotel-registered-users", JSON.stringify(registeredUsers))

      // Log in the new user
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)

      // Update in registered users if applicable
      const registeredUsers = JSON.parse(localStorage.getItem("hotel-registered-users") || "[]")
      const userIndex = registeredUsers.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updates }
        localStorage.setItem("hotel-registered-users", JSON.stringify(registeredUsers))
      }

      return true
    } catch (error) {
      console.error("Profile update error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
