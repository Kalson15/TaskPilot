import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Calendar, AlignLeft, BarChart3, ShieldAlert, Users, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task, TaskStatus, TaskPriority } from '@/types/database.types'
import { TeamSelector } from './TeamSelector'
import { AssigneeSelector } from './AssigneeSelector'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  task?: Task
  loading?: boolean
}

export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
  team_id: string | null
  assigned_to: string | null
}

export function TaskModal({ isOpen, onClose, onSubmit, task, loading }: TaskModalProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(task?.team_id || null)
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(task?.assigned_to || null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<TaskFormData, 'team_id' | 'assigned_to'>>({
    defaultValues: {
      status: 'todo',
      priority: 'medium',
    }
  })

  // Sync state with task prop
  useEffect(() => {
    if (task) {
      setSelectedTeamId(task.team_id || null)
      setSelectedAssigneeId(task.assigned_to || null)
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      })
    } else {
      reset({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '' })
    }
  }, [task, reset, isOpen])

  const handleFormSubmit = (data: Omit<TaskFormData, 'team_id' | 'assigned_to'>) => {
    onSubmit({ ...data, team_id: selectedTeamId, assigned_to: selectedAssigneeId })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[70] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    {task ? 'Update Task' : 'Create New Task'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Set clear goals for your project</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto p-8 space-y-8">
                {/* Section: Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Target className="w-4 h-4" /> General Information
                  </div>
                  <div>
                    <input
                      {...register('title', { required: 'Task title is essential' })}
                      type="text"
                      className="w-full text-2xl font-bold border-none p-0 focus:ring-0 placeholder:text-slate-300 dark:bg-transparent dark:text-white"
                      placeholder="High-level task title..."
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-rose-500 font-medium">✕ {errors.title.message}</p>
                    )}
                  </div>

                  <div className="relative group">
                    <div className="absolute top-3 left-3 text-slate-400">
                      <AlignLeft className="w-4 h-4" />
                    </div>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 dark:text-white resize-none transition-all"
                      placeholder="What needs to be done? Add details..."
                    />
                  </div>
                </div>

                {/* Section: Collaboration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> Assignment
                    </label>
                    <TeamSelector
                      selectedTeamId={selectedTeamId}
                      onSelect={setSelectedTeamId}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-3 pt-8 md:pt-8">
                    <AssigneeSelector
                      teamId={selectedTeamId}
                      selectedUserId={selectedAssigneeId}
                      onSelect={setSelectedAssigneeId}
                      disabled={loading || !selectedTeamId}
                    />
                  </div>
                </div>

                {/* Section: Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                      <BarChart3 className="w-3 h-3" /> Status
                    </label>
                    <select 
                      {...register('status')} 
                      className="w-full bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-primary/20 dark:text-white cursor-pointer"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3" /> Priority
                    </label>
                    <select 
                      {...register('priority')} 
                      className="w-full bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-primary/20 dark:text-white cursor-pointer"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium</option>
                      <option value="high">Urgent</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Deadline
                    </label>
                    <input
                      {...register('due_date')}
                      type="date"
                      className="w-full bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-primary/20 dark:text-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-4 pt-4 sticky bottom-0 bg-transparent">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-primary hover:bg-primary-dark text-sidebar px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      task ? 'Update Changes' : 'Launch Task'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}