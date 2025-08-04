"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Loader2 } from "lucide-react"

interface DemoPaymentProps {
  amount: number
  bookingId: string
  onSuccess: () => void
  onCancel: () => void
}

export function DemoPayment({ amount, bookingId, onSuccess, onCancel }: DemoPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [mobileDetails, setMobileDetails] = useState({
    provider: "",
    number: "",
  })

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Demo: 90% success rate
    const isSuccess = Math.random() > 0.1

    setIsProcessing(false)

    if (isSuccess) {
      onSuccess()
    } else {
      // Show error state briefly then reset
      setTimeout(() => {
        setIsProcessing(false)
      }, 2000)
    }
  }

  const isCardValid =
    paymentMethod === "card" &&
    cardDetails.number.length >= 16 &&
    cardDetails.expiry.length >= 5 &&
    cardDetails.cvv.length >= 3 &&
    cardDetails.name.length > 0

  const isMobileValid = paymentMethod === "mobile" && mobileDetails.provider && mobileDetails.number.length >= 9

  const isFormValid = paymentMethod === "card" ? isCardValid : isMobileValid

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span className="font-mono text-sm">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={paymentMethod === "card" ? "default" : "outline"}
              onClick={() => setPaymentMethod("card")}
              className="h-16 flex flex-col items-center space-y-1"
            >
              <CreditCard className="w-6 h-6" />
              <span>Credit Card</span>
            </Button>
            <Button
              variant={paymentMethod === "mobile" ? "default" : "outline"}
              onClick={() => setPaymentMethod("mobile")}
              className="h-16 flex flex-col items-center space-y-1"
            >
              <Smartphone className="w-6 h-6" />
              <span>Mobile Money</span>
            </Button>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                    setCardDetails((prev) => ({ ...prev, number: value }))
                  }}
                  maxLength={16}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "")
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2, 4)
                      }
                      setCardDetails((prev) => ({ ...prev, expiry: value }))
                    }}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 3)
                      setCardDetails((prev) => ({ ...prev, cvv: value }))
                    }}
                    maxLength={3}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Mobile Money Form */}
          {paymentMethod === "mobile" && (
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="provider">Mobile Money Provider</Label>
                <Select
                  value={mobileDetails.provider}
                  onValueChange={(value) => setMobileDetails((prev) => ({ ...prev, provider: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zaad">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                        <span>ZAAD Service</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="evc">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        <span>EVC Plus</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sahal">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-600 rounded"></div>
                        <span>Sahal Service</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  placeholder="+252 61 234 5678"
                  value={mobileDetails.number}
                  onChange={(e) => setMobileDetails((prev) => ({ ...prev, number: e.target.value }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-800 text-sm font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Demo Payment System</h4>
              <p className="text-sm text-yellow-700">
                This is a demonstration payment system. No real charges will be made. The system simulates a 90% success
                rate for testing purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button onClick={handlePayment} disabled={!isFormValid || isProcessing} className="flex-1">
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
