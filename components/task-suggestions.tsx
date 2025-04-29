"use client"

import { useState } from "react"
import { useGemini } from "@/hooks/use-gemini"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TaskSuggestionsProps {
  onAddTask: (title: string, description: string) => void
}

export function TaskSuggestions({ onAddTask }: TaskSuggestionsProps) {
  const [topic, setTopic] = useState("")
  const [suggestions, setSuggestions] = useState<{ title: string; description: string }[]>([])

  const { generateContent, isLoading, error } = useGemini({
    onSuccess: (data) => {
      try {
        // Extract the text from the response
        const text = data.candidates[0]?.content?.parts[0]?.text

        if (!text) {
          throw new Error("No suggestions generated")
        }

        // Parse the suggestions from the text
        // Expecting format like:
        // 1. Title: Description
        // 2. Title: Description
        const lines = text.split("\n").filter((line) => line.trim())
        const parsedSuggestions = lines
          .map((line) => {
            // Remove numbers and other formatting
            const cleanLine = line.replace(/^\d+\.\s*/, "")
            const parts = cleanLine.split(":")

            if (parts.length >= 2) {
              return {
                title: parts[0].trim(),
                description: parts.slice(1).join(":").trim(),
              }
            }
            return null
          })
          .filter(Boolean) as { title: string; description: string }[]

        setSuggestions(parsedSuggestions.slice(0, 5)) // Limit to 5 suggestions
      } catch (err) {
        console.error("Failed to parse suggestions:", err)
        setSuggestions([])
      }
    },
  })

  const handleGenerateSuggestions = async () => {
    if (!topic.trim()) return

    const prompt = `Generate 5 specific task ideas related to "${topic}". Format each task as "Task Title: Brief description of the task." Keep titles under 10 words and descriptions under 25 words. Make tasks practical and actionable.`

    await generateContent(prompt)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Task Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Enter a topic for task suggestions (e.g., 'home organization', 'work project', 'learning JavaScript')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleGenerateSuggestions} disabled={!topic.trim() || isLoading} className="self-end">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Suggestions:</h3>
              <div className="grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAddTask(suggestion.title, suggestion.description)}
                      className="ml-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Powered by Google Gemini AI</CardFooter>
    </Card>
  )
}
