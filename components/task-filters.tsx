"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import type { FilterType } from "./todo-app"
import { CheckCircle, Circle, ListFilter } from "lucide-react"

interface TaskFiltersProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  taskCounts: {
    all: number
    active: number
    completed: number
  }
}

export function TaskFilters({ activeFilter, onFilterChange, taskCounts }: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 p-2 bg-muted/30 rounded-md">
      <div className="flex items-center gap-1">
        <ListFilter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter:</span>
      </div>
      <div className="flex gap-2">
        <FilterButton
          label="All"
          count={taskCounts.all}
          isActive={activeFilter === "all"}
          onClick={() => onFilterChange("all")}
          icon={<ListFilter className="h-4 w-4" />}
        />
        <FilterButton
          label="Active"
          count={taskCounts.active}
          isActive={activeFilter === "active"}
          onClick={() => onFilterChange("active")}
          icon={<Circle className="h-4 w-4" />}
        />
        <FilterButton
          label="Completed"
          count={taskCounts.completed}
          isActive={activeFilter === "completed"}
          onClick={() => onFilterChange("completed")}
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </div>
    </div>
  )
}

interface FilterButtonProps {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
}

function FilterButton({ label, count, isActive, onClick, icon }: FilterButtonProps) {
  return (
    <Button variant={isActive ? "default" : "outline"} size="sm" onClick={onClick} className="flex items-center gap-1">
      {icon}
      {label}
      <span className="ml-1 text-xs bg-background/20 px-1.5 py-0.5 rounded-full">{count}</span>
    </Button>
  )
}
