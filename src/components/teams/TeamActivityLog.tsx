import { motion } from 'framer-motion'
import { Clock, CheckCircle2, UserPlus, PlusCircle, ArrowRight } from 'lucide-react'
import { formatDistanceToNow, isValid } from 'date-fns'

interface Activity {
  id: string
  type: 'task_created' | 'task_completed' | 'member_joined'
  user_name: string
  description: string
  timestamp: string
}

interface TeamActivityLogProps {
  tasks: any[]
  members: any[]
}

export function TeamActivityLog({ tasks, members }: TeamActivityLogProps) {
  // 1. Unified Activity Generator
  const activities: Activity[] = [
    // Transform completed tasks into events
    ...tasks.filter(t => t.status === 'done' && t.updated_at).map(task => ({
      id: `complete-${task.id}`,
      type: 'task_completed' as const,
      user_name: 'A team member',
      description: `completed "${task.title}"`,
      timestamp: task.updated_at,
    })),
    // Transform new tasks into events
    ...tasks.filter(t => t.created_at).map(task => ({
      id: `create-${task.id}`,
      type: 'task_created' as const,
      user_name: 'A team member',
      description: `opened a new task: "${task.title}"`,
      timestamp: task.created_at,
    })),
    // Transform member joins into events
    ...members.map(member => {
      const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles
      return {
        id: `member-${member.id}`,
        type: 'member_joined' as const,
        user_name: profile?.full_name || 'A new member',
        description: 'joined the workspace',
        timestamp: member.joined_at || member.created_at,
      }
    })
  ]

  // 2. Filter invalid dates & sort
  const sortedActivities = activities
    .filter(a => a.timestamp && isValid(new Date(a.timestamp)))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  const config = {
    task_completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    task_created: { icon: PlusCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    member_joined: { icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Timeline</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Latest Pulse</p>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="relative space-y-6">
        {/* The Timeline Vertical Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800" />

        {sortedActivities.map((activity, idx) => {
          const style = config[activity.type]
          const Icon = style.icon

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative flex gap-4 group"
            >
              {/* Animated Dot/Icon */}
              <div className={`relative z-10 w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center border-4 border-white dark:border-slate-900 transition-transform group-hover:scale-110`}>
                <Icon className={`w-4 h-4 ${style.color}`} />
              </div>

              {/* Content Card */}
              <div className="flex-1 pt-1.5">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">{activity.user_name}</span>{' '}
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}

        {sortedActivities.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-slate-400">The quiet before the storm. No activity yet.</p>
          </div>
        )}
      </div>

      <button className="w-full mt-8 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors border-t border-slate-100 dark:border-slate-800 pt-6">
        View Full History
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  )
}