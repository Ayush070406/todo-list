"use client"

import { useEffect, useState } from "react"
import { TaskForm } from "./task-form"
import { TaskList } from "./task-list"
import { TaskFilters } from "./task-filters"
import { TaskSuggestions } from "./task-suggestions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type Task = {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: number
}

export type FilterType = "all" | "active" | "completed"

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Failed to parse saved tasks:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const startEditingTask = (task: Task) => {
    setEditingTask(task)
    setShowSuggestions(false)
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setShowSuggestions(true)
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "active") return !task.completed
    if (activeFilter === "completed") return task.completed
    return true
  })

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-center">Task Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskForm onSubmit={editingTask ? updateTask : addTask} editingTask={editingTask} onCancel={cancelEditing} />

        {showSuggestions && <TaskSuggestions onAddTask={addTask} />}

        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          taskCounts={{
            all: tasks.length,
            active: tasks.filter((t) => !t.completed).length,
            completed: tasks.filter((t) => t.completed).length,
          }}
        />

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={toggleTaskCompletion}
          onDelete={deleteTask}
          onEdit={startEditingTask}
        />
      </CardContent>
    </Card>
  )
}
