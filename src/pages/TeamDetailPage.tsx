import {useState, type ComponentType, type SVGProps} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import {ArrowLeft, Users, Settings as SettingsIcon} from 'lucide-react'
import {useTeamDetails } from '../hooks/useTeamDetails'
import {TeamMemberList} from '../components/teams/TeamMemberList'
import {TeamSettings } from '../components/teams/TeamSettings'

type TabType = 'members' | 'settings'

export function TeamDetailPage(){
    const {teamId} = useParams<{teamId: string}>()
    const navigate = useNavigate()
    const {team, loading, error, refetch} = useTeamDetails(teamId)
    const[activeTab, setActiveTab] = useState<TabType>('members')

    if(loading){
        return(
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading team...</p>
        </div>
      </div>
        )
    }

    if(error || !team){
        return(
             <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Team not found'}</p>
          <Link
            to='/teams'
            className='text-yellow-500 hover:text-yellow-600 font-medium'
          >
            Back to Teams
          </Link>
        </div>
      </div>
        )
    }

    const tabs: { id: TabType; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
        {id: 'members', label:'Members', icon: Users},
         {id: 'settings', label:'Settings', icon: SettingsIcon},
        
    ]

    return(
                     <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                            <button
                             type="button"
                             onClick={()=> navigate('/teams')}
                             className='flex items-center gap-2   text-gray-600 hover:bg-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white mb-6'
                            >
                                <ArrowLeft className='w-5 h-5' />
                                Back to Teams
                            </button>

                            {/*header*/}
                            <div className='mb-8'>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                                    {team.name}
                                </h1>
                                {team.description && (
                                    <p className='text-gray-600 dark:text-gray-400'>{team.description}</p>
                                )}
                                <div className='mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                                    <span>{team.team_members?.length || 0} members</span>
                                    <span>*</span>
                                    <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/*tabs*/}
                            <div className='border-b border-gray-200 dark:border-gray-700 mb-6'>
                                <nav className='flex gap-8'>
                                    {tabs.map((tab)=>{
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id

                                        return(
                                                                                        <button
                                                                                         key={tab.id}
                                                                                         type="button"
                                                                                         onClick={()=> setActiveTab(tab.id)}
                                                                                         className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                                                isActive
                                                ? 'border-yellow-500 text-yellow-600 dark:text-yellow-500'
                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                             }`}
                                            >
                                                <Icon className='w-5 h-5' />
                                                <span className='font-medium'>{tab.label}</span>
                                            </button>
                                        )
                                    })}
                                </nav>
                            </div>

                            {/*tab content*/}
                            <div>
                                {activeTab == 'members' && <TeamMemberList teamId={team.id} />}
                                {activeTab == 'settings' && <TeamSettings team={team} onUpdate={refetch} />}
                            </div>
                        </div>
                     </div>
    )
}
