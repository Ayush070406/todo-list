"use client"

import { useState } from "react"

interface UseGeminiProps {
  onSuccess?: (response: any) => void
}

export function useGemini({ onSuccess }: UseGeminiProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<any>(null)

  const generateContent = async (prompt: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      setResponse(data)

      if (onSuccess) {
        onSuccess(data)
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateContent,
    isLoading,
    error,
    response,
  }
}
