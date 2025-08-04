"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bell,
  Search,
  Filter,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  X,
  ExternalLink,
} from "lucide-react"
import { useNotifications } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByPriority,
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter

    return matchesSearch && matchesType && matchesPriority
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeCount = (type: string) => {
    return getNotificationsByType(type).length
  }

  const getPriorityCount = (priority: string) => {
    return getNotificationsByPriority(priority).length
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                    : "You're all caught up!"}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                      <span className="flex-1">All Types</span>
                      <Badge variant="secondary" className="ml-2">
                        {getTypeCount("all")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("info")}>
                      <Info className="w-3 h-3 mr-2 text-blue-600" />
                      <span className="flex-1">Info</span>
                      <Badge variant="secondary" className="ml-2">
                        {getTypeCount("info")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("success")}>
                      <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                      <span className="flex-1">Success</span>
                      <Badge variant="secondary" className="ml-2">
                        {getTypeCount("success")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("warning")}>
                      <AlertTriangle className="w-3 h-3 mr-2 text-yellow-600" />
                      <span className="flex-1">Warning</span>
                      <Badge variant="secondary" className="ml-2">
                        {getTypeCount("warning")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("error")}>
                      <AlertCircle className="w-3 h-3 mr-2 text-red-600" />
                      <span className="flex-1">Error</span>
                      <Badge variant="secondary" className="ml-2">
                        {getTypeCount("error")}
                      </Badge>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                      <span className="flex-1">All Priorities</span>
                      <Badge variant="secondary" className="ml-2">
                        {getPriorityCount("all")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                      <span className="flex-1">High Priority</span>
                      <Badge variant="secondary" className="ml-2">
                        {getPriorityCount("high")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
                      <span className="flex-1">Medium Priority</span>
                      <Badge variant="secondary" className="ml-2">
                        {getPriorityCount("medium")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                      <span className="flex-1">Low Priority</span>
                      <Badge variant="secondary" className="ml-2">
                        {getPriorityCount("low")}
                      </Badge>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearAllNotifications} className="text-red-600 focus:text-red-600">
                      <Trash2 className="w-3 h-3 mr-2" />
                      Clear All
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            {/* Active Filters */}
            {(typeFilter !== "all" || priorityFilter !== "all") && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500">Active filters:</span>
                {typeFilter !== "all" && (
                  <Badge variant="outline" className="capitalize">
                    {typeFilter}
                    <button onClick={() => setTypeFilter("all")} className="ml-1 hover:text-red-600">
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                )}
                {priorityFilter !== "all" && (
                  <Badge variant="outline" className="capitalize">
                    {priorityFilter} Priority
                    <button onClick={() => setPriorityFilter("all")} className="ml-1 hover:text-red-600">
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery || typeFilter !== "all" || priorityFilter !== "all"
                      ? "No notifications found"
                      : "No notifications yet"}
                  </h3>
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    {searchQuery || typeFilter !== "all" || priorityFilter !== "all"
                      ? "Try adjusting your search terms or filter criteria to find what you're looking for."
                      : "When you receive notifications about bookings, payments, or updates, they'll appear here."}
                  </p>
                  {(searchQuery || typeFilter !== "all" || priorityFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setTypeFilter("all")
                        setPriorityFilter("all")
                      }}
                      className="mt-4"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4
                                  className={`text-sm font-medium ${
                                    !notification.read ? "text-gray-900" : "text-gray-700"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                              </div>

                              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPriorityColor(notification.priority)}`}
                                >
                                  {notification.priority} priority
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </span>
                              </div>

                              {notification.actionUrl && notification.actionLabel && (
                                <Link
                                  href={notification.actionUrl}
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-2"
                                >
                                  {notification.actionLabel}
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </Link>
                              )}
                            </div>

                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
