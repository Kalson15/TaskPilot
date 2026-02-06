import {useQuery} from '@tanstack/react-query'
import {supabase} from '@/lib/supabase'

export function useTeamDashboard(teamId: string | undefined){
    return useQuery({
        queryKey: ['team-dashboard', teamId],
        queryFn: async () => {
            if(!teamId) return null

            //fetch team tasks
            const {data: tasks, error: tasksError} = await supabase
            .from('tasks')
            .select('*')
            .eq('team_id', teamId)

            if(tasksError) throw tasksError

            //fetch team members
            const{data: members, error:membersError} = await supabase
            .from('team_members')
            .select(`
                id,
                user_id,
                role,
                joined_at,
                profiles(
                id,
                full_name,
                avatar_url
                )
                `)
                .eq('team_id', teamId)

            if(membersError) throw membersError

            //safe araay handling
            const taskArray = tasks || []
            const memberArray = members || []

            //calculate stats
            const totalTasks = taskArray.length || 0
            const completedTasks = taskArray.filter(t=> t.status == 'done').length || 0
            const inProgressTasks = taskArray.filter(t=> ['todo','upcoming'].includes(t.status)).length || 0
            const backlogTasks = taskArray.filter(t=> t.status == 'backlog').length || 0

            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100): 0

            //tasks by member
            const tasksByMember = new Map()
            taskArray.forEach(task =>{
                if(task.assigned_to){
                    const current = tasksByMember.get(task.assigned_to) || {total: 0 , done: 0}
                    current.total++
                    if(task.status == 'done') current.done++
                    tasksByMember.set(task.assigned_to, current)
                }
            })

            //tasks by priority
            const highPriorityTasks = tasks?.filter(t => t.priority == 'high' && t.status !== 'done').length || 0
            const mediumPriorityTasks =
              tasks?.filter(t => t.priority == "medium" && t.status !== "done")
                .length || 0
            const lowPriorityTasks = tasks?.filter(t => t.priority == 'low' && t.status !== 'done').length || 0

            //overdue tasks
            const now = new Date()
            const overdueTasks = tasks?.filter(t => {
                if(!t.due_date || t.status == 'done') return false
                return new Date(t.due_date) < now
            }).length || 0

            return{
                stats: {
                    totalTasks,
                    completedTasks,
                    inProgressTasks,
                    backlogTasks,
                    completionRate,
                    highPriorityTasks,
                    mediumPriorityTasks,
                    lowPriorityTasks,
                    overdueTasks,
                },
                tasks: taskArray,
                members: memberArray,
                tasksByMember,
            }
        },
        enabled: !!teamId,
    })
}