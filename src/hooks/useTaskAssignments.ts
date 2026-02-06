import {useState} from 'react'
import {useAuth} from './useAuth'
import {
    assignTask as assignTaskApi,
    unassignTask as unassignTaskApi,
    assignTaskToTeam as assignTaskToTeamApi,
    removeTaskFromTeam as removeTaskFromTeamApi,
} from '../lib/supabase/taskAssignments'

export function useTaskAssignments(){
    const {user} = useAuth()
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState<string | null>(null)

    //assgin task to user
    const assignTask = async (taskId: string, userId:string)=>{
        if(!user) throw new Error ('User not authenticated')

            try{
                setLoading(true)
                setError(null)
                await assignTaskApi(taskId, userId, user.id)
            }catch(err){
                const errorMessage = err instanceof Error ? err.message: 'Failed to assign task'
                setError(errorMessage)
                throw err
            }finally{
                setLoading(false)
            }
    }

    //unaasign task
    const unassignTask = async (taskId:string)=>{
         try{
                setLoading(true)
                setError(null)
                await unassignTaskApi(taskId)
            }catch(err){
                const errorMessage = err instanceof Error ? err.message: 'Failed to unassign task'
                setError(errorMessage)
                throw err
            }finally{
                setLoading(false)
            }
    }

    //asign task to team
    const assignTaskToTeam = async(taskId: string, teamId:string)=>{
         try{
                setLoading(true)
                setError(null)
                await assignTaskToTeamApi(taskId, teamId)
            }catch(err){
                const errorMessage = err instanceof Error ? err.message: 'Failed to assign task to team'
                setError(errorMessage)
                throw err
            }finally{
                setLoading(false)
            }
    }

    //remove task from team
    const removeTaskFromTeam = async(taskId:string)=>{
        try{
                setLoading(true)
                setError(null)
                await removeTaskFromTeamApi(taskId)
            }catch(err){
                const errorMessage = err instanceof Error ? err.message: 'Failed to remove task from team'
                setError(errorMessage)
                throw err
            }finally{
                setLoading(false)
            }
    }

    return{
        loading,
        error,
        assignTask,
        unassignTask,
        assignTaskToTeam,
        removeTaskFromTeam,
    }
}