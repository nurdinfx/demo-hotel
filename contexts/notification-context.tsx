"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  priority: "low" | "medium" | "high"
  read: boolean
  createdAt: string
  actionUrl?: string
  actionLabel?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void
  getNotificationsByType: (type: string) => Notification[]
  getNotificationsByPriority: (priority: string) => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Booking Confirmed",
    message: "Your reservation for Deluxe Ocean View has been confirmed for Feb 15-18, 2024.",
    type: "success",
    priority: "high",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    actionUrl: "/dashboard",
    actionLabel: "View Booking",
  },
  {
    id: "notif-2",
    title: "Payment Reminder",
    message:
      "Payment for your upcoming stay is due in 24 hours. Please complete your payment to secure your reservation.",
    type: "warning",
    priority: "high",
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    actionUrl: "/booking/payment",
    actionLabel: "Pay Now",
  },
  {
    id: "notif-3",
    title: "Special Offer",
    message: "Enjoy 20% off your next booking! Use code SAVE20 at checkout. Valid until end of month.",
    type: "info",
    priority: "medium",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    actionUrl: "/rooms",
    actionLabel: "Book Now",
  },
  {
    id: "notif-4",
    title: "Check-in Reminder",
    message: "Your check-in is tomorrow at 3:00 PM. We look forward to welcoming you!",
    type: "info",
    priority: "medium",
    read: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: "notif-5",
    title: "Loyalty Points Earned",
    message: "Congratulations! You've earned 150 loyalty points from your recent stay. Total: 1,250 points.",
    type: "success",
    priority: "low",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    actionUrl: "/dashboard",
    actionLabel: "View Points",
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("hotel-notifications")
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed)
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("hotel-notifications", JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (notificationData: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationsByType = (type: string) => {
    if (type === "all") return notifications
    return notifications.filter((notif) => notif.type === type)
  }

  const getNotificationsByPriority = (priority: string) => {
    if (priority === "all") return notifications
    return notifications.filter((notif) => notif.priority === priority)
  }

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByPriority,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
