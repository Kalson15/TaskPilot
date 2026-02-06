// src/hooks/useTasks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Task, TaskInsert, TaskUpdate, TaskStatus } from '@/types/database.types'

export function useTasks(userId: string | undefined, status?: TaskStatus) {
  return useQuery({
    queryKey: ['tasks', userId, status],
    queryFn: async () => {
      if (!userId) return []

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []) as Task[]
    },
    enabled: !!userId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (task: TaskInsert) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task-stats'] })
      queryClient.invalidateQueries({ queryKey: ['assigned-tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: TaskUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task-stats'] })
      queryClient.invalidateQueries({ queryKey: ['assigned-tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task-stats'] })
      queryClient.invalidateQueries({ queryKey: ['assigned-tasks'] })
    },
  })
}

export function useTaskStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['task-stats', userId],
    queryFn: async () => {
      if (!userId) return { total: 0, today: 0, upcoming: 0, done: 0 }

      const { data, error } = await supabase
        .from('tasks')
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

// Get tasks assigned to current user
export function useAssignedToMeTasks(userId: string | undefined) {
  return useQuery({
    queryKey: ['assigned-tasks', userId],
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []) as Task[]
    },
    enabled: !!userId,
  })
}

// Get team tasks
export function useTeamTasks(teamId: string | undefined) {
  return useQuery({
    queryKey: ['team-tasks', teamId],
    queryFn: async () => {
      if (!teamId) return []

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []) as Task[]
    },
    enabled: !!teamId,
  })
}