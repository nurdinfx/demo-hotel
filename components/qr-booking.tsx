"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, X, Scan } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface QRBookingProps {
  roomId?: string
  onClose?: () => void
}

export function QRBooking({ roomId, onClose }: QRBookingProps) {
  const [showQR, setShowQR] = useState(false)
  const [bookingData, setBookingData] = useState({
    roomId: roomId || "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  })
  const { translations } = useLanguage()

  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    const qrData = {
      type: "hotel_booking",
      roomId: bookingData.roomId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      timestamp: new Date().toISOString(),
    }

    console.log("QR Code Data:", qrData)
    setShowQR(true)
  }

  const handleScanQR = () => {
    // In a real app, this would open camera for QR scanning
    alert("QR Scanner would open here. This would use the device camera to scan booking QR codes.")
  }

  if (showQR) {
    return (
      <div className="qr-overlay" onClick={() => setShowQR(false)}>
        <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{translations.qrBooking}</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowQR(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* QR Code Placeholder */}
          <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
            <div className="text-center">
              <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">QR Code</p>
              <p className="text-xs text-gray-500">Room {bookingData.roomId}</p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Booking Details:</p>
            <p className="text-xs text-gray-600">Room: {bookingData.roomId}</p>
            <p className="text-xs text-gray-600">Check-in: {bookingData.checkIn}</p>
            <p className="text-xs text-gray-600">Check-out: {bookingData.checkOut}</p>
            <p className="text-xs text-gray-600">Guests: {bookingData.guests}</p>
          </div>

          <div className="flex space-x-2 mt-6">
            <Button onClick={() => setShowQR(false)} className="flex-1">
              Close
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Share
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="w-5 h-5" />
          <span>{translations.qrBooking}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn">{translations.checkIn}</Label>
            <Input
              id="checkIn"
              type="date"
              value={bookingData.checkIn}
              onChange={(e) => setBookingData((prev) => ({ ...prev, checkIn: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="checkOut">{translations.checkOut}</Label>
            <Input
              id="checkOut"
              type="date"
              value={bookingData.checkOut}
              onChange={(e) => setBookingData((prev) => ({ ...prev, checkOut: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="guests">{translations.guests}</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max="10"
            value={bookingData.guests}
            onChange={(e) => setBookingData((prev) => ({ ...prev, guests: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="roomId">Room ID</Label>
          <Input
            id="roomId"
            value={bookingData.roomId}
            onChange={(e) => setBookingData((prev) => ({ ...prev, roomId: e.target.value }))}
            placeholder="Enter room number"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={generateQRCode}
            className="flex-1"
            disabled={!bookingData.roomId || !bookingData.checkIn || !bookingData.checkOut}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {translations.generateQR}
          </Button>
          <Button onClick={handleScanQR} variant="outline" className="flex-1 bg-transparent">
            <Scan className="w-4 h-4 mr-2" />
            {translations.scanQR}
          </Button>
        </div>

        {onClose && (
          <Button onClick={onClose} variant="ghost" className="w-full">
            {translations.cancel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
