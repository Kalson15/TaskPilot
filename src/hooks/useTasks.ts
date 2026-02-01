import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Task, TaskInsert, TaskUpdate, TaskStatus } from '@/types/database.types'

export function useTasks(userId: string | undefined, status?: TaskStatus) {
  return useQuery({
    queryKey: ['tasks', userId, status],
    queryFn: async () => {
      if (!userId) return []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = (supabase.from('tasks') as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Task[]
    },
    enabled: !!userId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (task: TaskInsert) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('tasks') as any)
        .insert(task)
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: TaskUpdate & { id: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('tasks') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('tasks') as any).delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useTaskStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['task-stats', userId],
    queryFn: async () => {
      if (!userId) return { total: 0, today: 0, upcoming: 0, done: 0 }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('tasks') as any)
        .select('status, due_date')
        .eq('user_id', userId)

      if (error) throw error

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const stats = {
        total: (data as Task[]).length,
        today: (data as Task[]).filter(task => {
          if (!task.due_date) return false
          const dueDate = new Date(task.due_date)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() === today.getTime()
        }).length,
        upcoming: (data as Task[]).filter(task => task.status === 'upcoming').length,
        done: (data as Task[]).filter(task => task.status === 'done').length,
      }

      return stats
    },
    enabled: !!userId,
  })
}
