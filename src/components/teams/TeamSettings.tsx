import { useState } from "react";
import {Save, Trash2, LogOut} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import {useAuth} from '../../hooks/useAuth';
import{useTeams} from '../../hooks/useTeams' 
import { useTeamMembers } from "@/hooks/useTeamMembers";
import type{Team, UpdateTeamData} from '../../types/team.types'

interface TeamSettingsProps{
    team: Team;
    onUpdate: ()=> void
}

export function TeamSettings({team, onUpdate}: TeamSettingsProps){
    const{user} = useAuth()
    const navigate = useNavigate()
    const {updateTeam, deleteTeam, leaveTeam} = useTeams()
    const {getCurrentUserRole} = useTeamMembers(team.id)

    const [formData, setFormData] = useState<UpdateTeamData>({
        name: team.name,
        description: team.description || ''
    })
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const currentRole = getCurrentUserRole()
    const isOwner = currentRole === 'owner'
    const canEdit = isOwner || currentRole == 'admin'

    const handleUpdate = async(e: React.FormEvent)=>{
        e.preventDefault()

        if(!formData.name?.trim()){
            setError('Team name is required')
            return
        }

        try{
            setLoading(true)
            setError(null)
            setSuccess(false)

            await updateTeam(team.id, formData)
            setSuccess(true)
            onUpdate()

            //hide succes message after 3 seconds
            setTimeout(()=> setSuccess(false),3000)
        }catch(err){
            setError(err instanceof Error ? err.message: 'Failed to update team')
        }finally{
            setLoading(false)
        }
    }

    const handleDelete = async ()=>{
        if(!confirm(`Are you sure you want to delete "${team.name}" 
            ? This action cannot be undone`)){
                return
            }
            try{
                setLoading(true)
                await deleteTeam(team.id)
                navigate('/teams')
            }catch(err){
                setError(err instanceof Error ? err.message:'Failed to delete team')
                setLoading(false)
            }
    }

    const handleLeave = async()=>{
        if(!confirm(`Are you sure you want to leave "${team.name}" 
            `)){
                return
            }
             try{
                setLoading(true)
                await leaveTeam(team.id)
                navigate('/teams')
            }catch(err){
                setError(err instanceof Error ? err.message:'Failed to leave team')
                setLoading(false)
            }
    }

    return(
        <div className="space-y-6">
            {/*Team info*/}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                    Team Information
                </h3>
                <form onSubmit={handleUpdate} className="space-y-6">
                    {/*team name*/}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Team Name
                        </label>
                        <input
                         type='text'
                         value={formData.name}
                         onChange={(e)=> setFormData({...formData ,name: e.target.value})}
                         disabled={!canEdit || loading}
                         className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent darl:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        />
                    </div>

                    {/*description*/}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            description
                        </label>
                        <textarea
                         
                         value={formData.description}
                         onChange={(e)=> setFormData({...formData ,description: e.target.value})}
                         disabled={!canEdit || loading}
                         rows={3}
                         className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent darl:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        />
                    </div>

                    {/*messages*/}
                    {error && (
                         <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3'>
                <p className='text-red-600 text-sm dark:text-red-400'>{error}</p>
            </div>
                    )}

                    {success &&(
                         <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3'>
                <p className='text-green-600 text-sm dark:text-green-400'>Team updated successfully</p>
            </div>
                    )}
                    {/*save button*/}
                    {canEdit && (
                        <button
                          type='submit'
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className='w-4 h-4 '/>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </form>
            </div>

            {/*danger zone*/}
            <div className='bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg p-6'>
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                    Danger Zone
                </h3>
                <div className='space-y-3'>
                    {/*leave team*/}
                    {!isOwner && (
                        <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Leave Team</p>
                                <p className='text-sm text-gray-400 dark:text-gray-400'>
                                    You will no longer have access to this team
                                </p>
                            </div>
                            <button
                             onClick={handleLeave}
                             disabled={loading}
                             className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogOut className='w-4 h-4' />
                                Leave
                            </button>
                        </div>
                    )}

                    {/*delete team*/}
                    {isOwner && (
                         <div className='flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg'>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Delete Team</p>
                                <p className='text-sm text-gray-400 dark:text-gray-400'>
                                    Permanently delete this team and all associated data
                                </p>
                            </div>
                            <button
                             onClick={handleDelete}
                             disabled={loading}
                             className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className='w-4 h-4' />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}