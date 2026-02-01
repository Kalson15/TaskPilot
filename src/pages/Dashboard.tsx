import { useState } from 'react'
import { Plus } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal, TaskFormData } from '@/components/tasks/TaskModal'
import { useAuth } from '@/hooks/useAuth'
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useTaskStats,
} from '@/hooks/useTasks'
import { Task, TaskStatus } from '@/types/database.types'

const tabs: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Tasks', value: 'todo' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Done', value: 'done' },
]

export function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('todo')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const { data: stats } = useTaskStats(user?.id)
  const { data: tasks = [], isLoading } = useTasks(
    user?.id,
    activeTab === 'all' ? undefined : activeTab
  )
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const handleCreateTask = async (data: TaskFormData) => {
    if (!user) return

    try {
      await createTask.mutateAsync({
        ...data,
        user_id: user.id,
        due_date: data.due_date || null,
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return

    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        ...data,
        due_date: data.due_date || null,
      })
      setIsModalOpen(false)
      setEditingTask(undefined)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(undefined)
  }

  return (
    <MainLayout
      title={`You've got ${stats?.today || 0} tasks today`}
      subtitle="Let's finish them all!"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header with tabs */}
          <div className="flex items-center justify-between mb-6">
            {/*tabs- scrollable on mobile*/}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={` px-3 sm:px-4 py-2 rounded-lg font-medium white-space-nowrap text-sm transition-colors ${
                    activeTab === tab.value
                      ? 'bg-primary text-sidebar'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/*add task button*/}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
             <span className='hidden sm:inline'> Add task</span>
             <span className='sm:inline lg:hidden'> Add</span>
            </button>
          </div>

          {/* Team avatars (placeholder for Phase 2) */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-400 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-sm text-text-secondary ml-2">
              Team members
            </span>
          </div>

          {/* Progress bar (placeholder for Phase 2) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">
                Progress
              </span>
              <span className="text-sm text-text-secondary">
                {stats?.done || 0} / {stats?.total || 0} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats?.total ? (stats.done / stats.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Tasks List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-text-secondary mb-4">No tasks found</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary"
              >
                Create your first task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Calendar placeholder */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h3 className="font-semibold text-lg mb-4">Today</h3>
            <p className="text-sm text-text-secondary mb-4">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <div className="text-sm text-text-secondary">
              Calendar integration coming soon
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        loading={createTask.isPending || updateTask.isPending}
      />
    </MainLayout>
  )
}
