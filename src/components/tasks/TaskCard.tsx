import { Task } from '@/types/database.types'
import { MoreVertical, Calendar, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityColors = {
  low: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  high: 'text-red-600 bg-red-50',
}

const statusColors = {
  backlog: 'bg-status-backlog',
  todo: 'bg-status-todo',
  upcoming: 'bg-status-upcoming',
  done: 'bg-status-done',
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="card hover:shadow-card-hover transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColors[task.status]}`} />
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* delete button uses onDelete so the prop is read and not unused */}
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1  rounded text-gray-500"
            aria-label="Delete task"
            title="Delete task"
          >
            <Trash2 className='hover:bg-red-100'size={16}/>
          </button>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <h3
        className="font-semibold text-text-primary mb-2 line-clamp-2"
        onClick={() => onEdit(task)}
      >
        {task.title}
      </h3>

      {task.description && (
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm">
        {task.due_date && (
          <div className="flex items-center gap-1 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
