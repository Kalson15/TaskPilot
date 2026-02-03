import { useState, useEffect } from "react";
import{getTeamById, getTeamMembers} from '../lib/supabase/teams'
import type { TeamWithMemberDetails } from "@/types/team.types";

export function useTeamDetails(teamId:string | undefined){
    const [team, setTeam] = useState<TeamWithMemberDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const[error, setError] = useState<string | null>(null)

    const fetchTeamDetails = async()=>{
        if(!teamId){
            setLoading(false)
            return
        }
        try{
            setLoading(true)
            setError(null)
            const data = await getTeamById(teamId)
            setTeam(data)
        }catch(err){
            setError(err instanceof Error ? err.message: 'Failed to fetch team')
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchTeamDetails()
    },[teamId])

    return{
        team,
        loading,
        error,
        refetch: fetchTeamDetails,
    }
}