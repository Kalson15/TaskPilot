import {useState} from 'react'
import { X } from 'lucide-react'
import {useTeams} from '../../hooks/useTeams'
import type {CreateTeamData} from '../../types/team.types'

interface CreateTeamModalProps{
    isOpen: boolean;
    onClose: ()=> void
}

export function CreateTeamModal({isOpen, onClose}: CreateTeamModalProps){
    const {createTeam} = useTeams()
    const [formData, setFormData] = useState<CreateTeamData>({
        name:'',
        description: '',
    })
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()

        if(!formData.name.trim()){
            setError('Team name is required')
            return
        }
        try{
            setLoading(true)
            setError(null)
            await createTeam(formData)

            //reset for and close modal
            setFormData({name:'', description:''})
            onClose()
        }catch(err){
            setError(err instanceof Error ? err.message : 'Failed to create team')
        }finally{
            setLoading(false)
        }
    }
    const handleClose = ()=>{
        setFormData({name:'', description:''})
        setError(null)
        onClose()
    }

    if(!isOpen) return null

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Team
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
         {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label
              htmlFor="team-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Team Name *
            </label>
            <input
              id="team-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Marketing Team"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="team-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="team-description"
              value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What's this team about?"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )} 
           {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Team'}
               </button>
          </div>
        </form>
      </div>
    </div>
  );
}

 