import { Crown, Shield, User, Trash2, Mail } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { motion } from 'framer-motion'
import type { TeamRole } from '../../types/team.types'

interface TeamMemberListProps {
  teamId: string
}

export function TeamMemberList({ teamId }: TeamMemberListProps) {
  const { user } = useAuth()
  const { members, loading,  removeMember, isOwnerOrAdmin } = useTeamMembers(teamId)

  const canManageMembers = isOwnerOrAdmin()

  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3" />;
      case 'admin': return <Shield className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  }

  const getRoleBadge = (role: TeamRole) => {
    const styles: Record<TeamRole, string> = {
      owner: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      admin: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      member: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
      guest: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[role]}`}>
        {getRoleIcon(role)}
        {role}
      </span>
    )
  }

  const handleRemoveMember = async (memberUserId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName}? They will lose access to all team projects immediately.`)) return;
    
    try {
      await removeMember(memberUserId);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Team Members ({members.length})
        </h4>
      </div>

      <div className="grid gap-2">
        {members.map((member) => {
          const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
          const fullName = profile?.full_name || 'Unknown User';
          const email = profile?.email || 'No email provided';
          const isCurrentUser = member.user_id === user?.id;
          const canRemove = canManageMembers && !isCurrentUser && member.role !== 'owner';

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={member.user_id}
              className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Avatar with Status Ring */}
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center text-slate-500 font-bold border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  {isCurrentUser && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">
                      {fullName}
                    </p>
                    {isCurrentUser && (
                      <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase">You</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Mail className="w-3 h-3" />
                      {email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {getRoleBadge(member.role)}
                
                {canRemove ? (
                  <button
                    onClick={() => handleRemoveMember(member.user_id, fullName)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-8 h-8" /> // Spacer for alignment
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}