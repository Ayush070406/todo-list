"use client"
import { useGemini } from "@/hooks/use-gemini"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface TaskDescriptionGeneratorProps {
  taskTitle: string
  onDescriptionGenerated: (description: string) => void
}

export function TaskDescriptionGenerator({ taskTitle, onDescriptionGenerated }: TaskDescriptionGeneratorProps) {
  const { generateContent, isLoading, error } = useGemini({
    onSuccess: (data) => {
      try {
        const text = data.candidates[0]?.content?.parts[0]?.text
        if (text) {
          onDescriptionGenerated(text.trim())
        }
      } catch (err) {
        console.error("Failed to parse description:", err)
      }
    },
  })

  const handleGenerateDescription = async () => {
    if (!taskTitle.trim()) return

    const prompt = `Write a brief, practical description (under 100 characters) for a task titled "${taskTitle}". Focus on actionable steps or clarifying the task's purpose.`

    await generateContent(prompt)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerateDescription}
      disabled={isLoading || !taskTitle.trim()}
      className="mt-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-3 w-3 text-purple-500" />
          Generate Description
        </>
      )}
    </Button>
  )
}
