/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { useState, useEffect } from "react";
import {useAuth} from './useAuth'
import {
    createTeam as createTeamApi,
    getUserTeams,
    getTeamById,
    updateTeam as updateTeamApi,
    deleteTeam as deleteTeamapi,
    leaveTeam as leaveTeamApi,
} from '../lib/supabase/teams';
import type { CreateTeamData, UpdateTeamData, TeamWithMembers } from "@/types/team.types";

export function useTeams(){
    const {user} = useAuth()
    const [teams, setTeams] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const[error, setError] = useState<string | null>(null)

    //fetch user teams
    const fetchTeams = async () =>{
        if(!user) return
        try{
            setLoading(true)
            setError(null)
            const data = await getUserTeams(user.id);
            setTeams(data)
        } catch(err){
            setError(err instanceof Error ?err.message: 'Failed to fetch teams')
        } finally{
            setLoading(false)
        }
    }

    //Create team
    const createTeam = async (data: CreateTeamData) =>{
        if(!user) throw new Error('User not authenticated')

        // eslint-disable-next-line no-useless-catch
        try{
            const newTeam = await createTeamApi(data, user.id)
            await fetchTeams(); //refresh teams list
            return newTeam
        } catch(err){
            throw err
         }  
    }

    //update team
    const updateTeam = async(teamId:string, data: UpdateTeamData)=>{
        // eslint-disable-next-line no-useless-catch
        try{
            const updatedTeam = await updateTeamApi(teamId, data)
            await fetchTeams();
            return updatedTeam
        }catch(err){
            throw err;
        }
    }

    //delete team
    const deleteTeam = async(teamId: string)=>{
        try{
            await deleteTeamapi(teamId)
            await fetchTeams()
        }catch(err){
            throw err
        }
    }
    //leave team
    const leaveTeam = async(teamId:string)=>{
        if(!user) throw new Error('User not authenticated')

         try{
            await leaveTeamApi(teamId, user.id)
            await fetchTeams()

         }  catch(err){
            throw err
         } 
    }
    //load teams on mount
    useEffect(()=>{
        fetchTeams()
    },[user])

    return{
        teams,
        loading,
        error,
        createTeam,
        updateTeam,
        deleteTeam,
        leaveTeam,
        refetch: fetchTeams,
    }
}