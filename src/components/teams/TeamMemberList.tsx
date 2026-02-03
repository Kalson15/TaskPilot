import {Crown, Shield, User, Trash2} from 'lucide-react'
import {useAuth} from '../../hooks/useAuth'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import type{TeamRole} from '../../types/team.types'

interface TeamMemberListProps{
    teamId: string
}

export function TeamMemberList({teamId}: TeamMemberListProps){
    const {user} = useAuth()
    const{members, loading, error, removeMember, isOwnerOrAdmin} = useTeamMembers(teamId)

    const canManageMembers = isOwnerOrAdmin

    const getRoleIcon = (role: TeamRole) =>{
        switch(role){
            case 'owner':
                return <Crown className='w-4 h-4 text-yellow-500' />;
            case 'admin':
                return <Shield className='w-4 h-4 text-blue-500' />
            default:
                return <User className ='w-4 h-4 text-gray-500' />
        }
    }

    const getRoleBadge = (role: TeamRole)=>{
        const styles ={
            owner: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/300 dark:text-yellow-400',
            admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/300 dark:text-blue-400',
            member: 'bg-gray-100 text-gray-800 dark:bg-gray-900/300 dark:text-gray-400',
            guest: 'bg-purple-100 text-purple-800 dark:bg-purple-900/300 dark:text-purple-400',
        }

        return(
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
                {getRoleIcon(role)}
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        )
    }
    const handleRemoveMember = async (memberId: string, memberName:string)=>{
        if(!confirm(`Are you sure you want to remove ${memberName} from this team`)){
            return
        }
        try{
            await removeMember(memberId)
        }catch(err){
            alert(err instanceof Error ? err.message: 'Failed to remove member')
        }
    }
    if(loading){
        return(
            <div className='flex items-center justify-center py-8'>
                <div className='w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin'></div>
            </div>
        )
    }
    if(error){
        return(
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
                <p className='text-red-600 dark:text-red-400'>{error}</p>
            </div>
        )
    }
    return(
        <div className='space-y-3'>
            {members.map((member)=>{
                const isCurrentUser = member.user_id === user?.id;
                const canRemove = canManageMembers && !isCurrentUser && member.role !== 'owner'

                return(
                    <div
                     key={member.id}
                     className='flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg'
                    >
                        <div className='flex items-center gap-3'>
                            {/*avatar*/}
                            <div className='w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold'>
                                {member.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            {/*info*/}
                            <div>
                                <div className='flex items-center gap-2'>
                                    <p className='font-medium text-gray-900 dark:text-white'>
                                        {member.profiles?.full_name || 'Unknown User'}
                                        {isCurrentUser && (
                                            <span className='ml-2 text-xs text-gray-500 dark:text-gray-400'>(You)</span>
                                        )}
                                    </p>
                                </div>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    Joined {new Date(member.joined_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/*role and actions*/}
                        <div className='flex items-center gap-3'>
                            {getRoleBadge(member.role)}

                            {canRemove && (
                                <button
                                 onClick={()=> handleRemoveMember(member.user_id, member.profiles?.full_name || 'this user')}
                                 className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                                 title='Remove member'
                                >
                                    <Trash2 className='w-4 h-4' />
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}