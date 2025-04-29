import TodoApp from "@/components/todo-app"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <TodoApp />
      </div>
    </main>
  )
}
