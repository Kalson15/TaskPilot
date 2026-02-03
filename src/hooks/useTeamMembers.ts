/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { useState, useEffect } from "react";
import {useAuth} from './useAuth'
import{
    getTeamMembers,
    removeTeamMember as removeTeamMemberApi,
    updateMemberRole as updateMemberRoleApi,
} from '../lib/supabase/teams'
import type{TeamRole} from '../types/team.types'

export function useTeamMembers(teamId:string | undefined){
    const {user} = useAuth;
    const[members, setMembers] = useState<any[]>([])
    const[loading,setLoading] = useState(true)
    const[error, setError] = useState<string | null>(null)

    //fetch team memebers
    const fetchMembers = async ()=>{
        if(!teamId){
            setLoading(false)
            return
        }

        try{
            setLoading(true)
            setError(null)
            const data = await getTeamMembers(teamId)
            setMembers(data)
        }catch(err){
            setError(err instanceof Error ? err.message : 'Failed to fetch team members')
        }finally{
            setLoading(false)
        }
    }

    //remove member
    const removeMember = async(userId: string)=>{
        if(!teamId) throw new Error('Team ID is required')
            try{
        await removeTeamMemberApi(teamId, userId)
        await fetchMembers()
    }catch(err){
        throw err
    }
    }

    //upadte member role
    const updateMemberRole = async(userId: string, role:TeamRole)=>{
        if(!teamId) throw new Error('Team ID is reqiured')

        try{
            await updateMemberRoleApi(teamId, userId, role)
            await fetchMembers()
        }catch(err){
            throw err
        }
    }

    //check if current user is owner or admin
    const isOwnerOrAdmin = ()=>{
        if(!user) return false
        const currentMember = members.find((m)=> m.user_id === user.id)
        return currentMember?.role === 'owner' || currentMember?.role === 'admin'
    }

    //get current user role
    const getCurrentUserRole = (): TeamRole | null =>{
        if(!user) return null
        const currentMember = members.find((m)=> m.user_id === user.id)
        return currentMember?.role || null
    }

    useEffect(()=>{
        fetchMembers()
    },[teamId])

    return{
        members,
        loading,
        error,
        removeMember,
        updateMemberRole,
        isOwnerOrAdmin,
        getCurrentUserRole,
        refetch: fetchMembers
    }

}