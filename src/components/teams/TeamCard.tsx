import{Users, Calendar, Crown} from 'lucide-react'
import {Link} from 'react-router-dom'
import type {Team} from '../../types/team.types'

interface TeamCardProps{
    team: Team &{
        role?: string;
        member_count?: number
    }
}

export function TeamCard({team}: TeamCardProps){
    const isOwner = team.role === 'owner'

    //formate date
    const formattedDate = new Date(team.created_at).toLocaleDateString('en-US',{
        month: 'short',
        day: 'numeric',
        year:'numeric'
    })

    return(
        <Link 
        to={`/teams/${team.id}`}
        className='block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 p-6'>
            {/*header
            */}
            <div className='flex items-start justify-between mb-3'>
                <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                        <h3 className='text-lgfont-semibold text-gray-900 dark:text-white'>
                            {team.name}
                        </h3>
                        {isOwner && (
                            <span className='inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded-full'>
                                <Crown className='w-3 h-3' />
                                Owner
                            </span>
                        )}
                    </div>
                    {team.description && (
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2'>
                            {team.description}
                        </p>
                    )}
                </div>
            </div>
            {/*stat*/}
            <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                <div className='flex items-center gap-1'>
                    <Users className='w-4 h-4' />
                    <span>{team.member_count || 1} members</span>
                </div>
                <div className='flex items-center gap-1'>
                    <Calendar className='w-4 h-4' />
                    <span>Created {formattedDate}</span>
                </div>
            </div>
        </Link>
    )
}