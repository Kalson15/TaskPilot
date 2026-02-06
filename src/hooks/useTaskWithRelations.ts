// src/hooks/useTaskWithRelations.ts

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Task } from '@/types/database.types'

interface TaskWithRelations extends Task {
  assigned_user?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
  team?: {
    id: string
    name: string
  } | null
}

export function useTaskWithRelations(tasks: Task[]) {
  return useQuery({
    queryKey: ['tasks-with-relations', tasks.map(t => t.id).join(',')],
    queryFn: async () => {
      if (tasks.length === 0) return []

      // Get all unique user IDs and team IDs
      const userIds = [...new Set(tasks.map(t => t.assigned_to).filter(Boolean))] as string[]
      const teamIds = [...new Set(tasks.map(t => t.team_id).filter(Boolean))] as string[]

      // Fetch all profiles at once
      const profiles = new Map()
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds)

        profileData?.forEach(p => profiles.set(p.id, p))
      }

      // Fetch all teams at once
      const teams = new Map()
      if (teamIds.length > 0) {
        const { data: teamData } = await supabase
          .from('teams')
          .select('id, name')
          .in('id', teamIds)

        teamData?.forEach(t => teams.set(t.id, t))
      }

      // Combine everything
      return tasks.map(task => ({
        ...task,
        assigned_user: task.assigned_to ? profiles.get(task.assigned_to) : null,
        team: task.team_id ? teams.get(task.team_id) : null,
      })) as TaskWithRelations[]
    },
    enabled: tasks.length > 0,
  })
}