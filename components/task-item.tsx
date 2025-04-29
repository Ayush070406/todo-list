"use client"

import type { Task } from "./todo-app"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskItem({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) {
  const timeAgo = formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })

  return (
    <Card className={`transition-all ${task.completed ? "bg-muted/50" : ""}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start gap-2">
        <div className="flex items-center h-6 mt-0.5">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          />
        </div>
        <div className="flex-1">
          <CardTitle className={`text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Created {timeAgo}</p>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="p-4 pt-0 pl-12">
          <p className={`text-sm ${task.completed ? "text-muted-foreground" : ""}`}>{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(task)} aria-label="Edit task">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)} aria-label="Delete task">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
