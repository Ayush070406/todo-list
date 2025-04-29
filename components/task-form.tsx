"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "./todo-app"
import { PlusCircle, Save, X } from "lucide-react"
import { TaskDescriptionGenerator } from "./task-description-generator"

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void | ((task: Task) => void)
  editingTask: Task | null
  onCancel: () => void
}

export function TaskForm({ onSubmit, editingTask, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const isEditing = !!editingTask

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description)
    } else {
      setTitle("")
      setDescription("")
    }
  }, [editingTask])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    if (isEditing && editingTask) {
      onSubmit({
        ...editingTask,
        title,
        description,
      })
    } else {
      onSubmit(title, description)
    }

    setTitle("")
    setDescription("")
  }

  const handleDescriptionGenerated = (generatedDescription: string) => {
    setDescription(generatedDescription)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <Input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
          required
          aria-label="Task title"
        />
      </div>
      <div>
        <Textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
          rows={3}
          aria-label="Task description"
        />
        {title.trim() && !isEditing && (
          <TaskDescriptionGenerator taskTitle={title} onDescriptionGenerated={handleDescriptionGenerated} />
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Task
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </>
          )}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
