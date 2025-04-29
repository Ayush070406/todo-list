import type { Task } from "./todo-app"
import { TaskItem } from "./task-item"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClipboardList } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskList({ tasks, onToggleComplete, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Alert className="mt-4 bg-muted/50">
        <ClipboardList className="h-4 w-4" />
        <AlertDescription>No tasks found. Add a new task to get started!</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  )
}
