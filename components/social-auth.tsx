"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Chrome, Github, Facebook, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SocialAuth() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSocialAuth = async (provider: string) => {
    setLoadingProvider(provider)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Coming Soon!",
      description: `${provider} authentication will be available soon.`,
    })

    setLoadingProvider(null)
  }

  const providers = [
    {
      name: "Google",
      icon: Chrome,
      color: "hover:bg-red-50 hover:border-red-200",
    },
    {
      name: "GitHub",
      icon: Github,
      color: "hover:bg-gray-50 hover:border-gray-200",
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-50 hover:border-blue-200",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {providers.map((provider) => {
        const Icon = provider.icon
        const isLoading = loadingProvider === provider.name

        return (
          <Button
            key={provider.name}
            variant="outline"
            onClick={() => handleSocialAuth(provider.name)}
            disabled={!!loadingProvider}
            className={`h-10 ${provider.color} transition-colors`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
          </Button>
        )
      })}
    </div>
  )
}
