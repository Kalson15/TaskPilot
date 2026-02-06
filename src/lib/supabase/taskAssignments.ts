import {supabase} from '../supabase'

//assign tasks to user
export async function assignTask(taskId: string, userId: string, assignedBy: string){
    //update the task's assihned_to fiels
    const{error:taskError} = await supabase
    .from('tasks')
    .update({assigned_to: userId})
    .eq('id', taskId)

    if(taskError) throw taskError

    //optionally create an assignment record for history
    const{error: assignmentError} = await supabase
    .from('task_assignments')
    .insert({
        task_id: taskId,
        user_id: userId,
        assigned_by: assignedBy,
    })

    if(assignmentError){
        //log but dont throw- this task is still asiigned
        console.warn('Failed to create assignment record', assignmentError)
    }
}

//unassign tasks
export async function unassignTask(taskId: string){
    const {error} = await supabase
    .from('tasks')
    .update({assigned_to: null})
    .eq('id', taskId)

    if(error) throw error;
}

//get tassks assigned to a user
export async function getAssignedTasks(userId: string){
    const{data, error} = await supabase
    .from('tasks')
    .select(`
        *,
        profiles:assigned_to(
        full_name,
        avatar_url
        )
        `)
        .eq('assigned_to', userId)
        .order('created_at',{ascending: false})

        if(error) throw error
        return data
}

//get team tasks(all tasks in a team)
export async function getTeamTasks(teamId: string){
    const{data, error} = await supabase
    .from('tasks')
    .select(`
        *,
        profiles:assigned_to(
        full_name,
        avatar_url
        )
        `)
        .eq('team_id', teamId)
        .order('created_at', {ascending: false})

        if(error) throw error
        return data
}

//assign task to team
export async function assignTaskToTeam(taskId: string, teamId: string){
    const { error } = await supabase
    .from('tasks')
    .update({ team_id: teamId })
    .eq('id', taskId)

    if(error) throw error
}

//remove task from team
export async function removeTaskFromTeam(taskId: string){
    const { error } = await supabase
    .from('tasks')
    .update({
        team_id: null,
        assigned_to: null //also unassign when removing from team
    })
    .eq('id', taskId)
    if (error) throw error
}
