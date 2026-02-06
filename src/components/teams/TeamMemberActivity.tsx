import { CheckCircle2, ListTodo, Medal, User } from "lucide-react";
import { motion } from "framer-motion";

interface TeamMemberActivityProps {
  members: any[];
  tasksByMember: Map<string, { total: number; done: number }>;
}

export function TeamMemberActivity({
  members,
  tasksByMember,
}: TeamMemberActivityProps) {
  const sortedMembers = [...members].sort((a, b) => {
    const aStats = tasksByMember.get(a.user_id) || { total: 0, done: 0 };
    const bStats = tasksByMember.get(b.user_id) || { total: 0, done: 0 };
    return bStats.total - aStats.total;
  });

  const getProfile = (member: any) => {
    if (!member.profiles) return null;
    return Array.isArray(member.profiles)
      ? member.profiles[0]
      : member.profiles;
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Workload Distribution
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Real-time task allocation by member
          </p>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <Medal className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      <div className="space-y-3">
        {sortedMembers.map((member, idx) => {
          const profile = getProfile(member);
          const stats = tasksByMember.get(member.user_id) || {
            total: 0,
            done: 0,
          };
          const completionRate =
            stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Custom Avatar with Status Indicator */}
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <span className="text-xs font-black text-slate-500">
                        {getInitials(profile?.full_name)}
                      </span>
                    )}
                  </div>
                  {stats.total > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {profile?.full_name || "Incognito User"}
                    </p>
                    {idx === 0 && stats.total > 0 && (
                      <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-[8px] font-black text-amber-600 uppercase rounded">
                        Lead
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-wider">
                    <div className="flex items-center gap-1 text-slate-400">
                      <ListTodo className="w-3 h-3" />
                      <span>{stats.total} Assigned</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{stats.done} Completed</span>
                    </div>
                  </div>
                </div>

                {/* Progress Circle or Bar */}
                <div className="hidden lg:hidden md:flex flex-col items-end gap-1.5 min-w-[100px]">
                  <div className="flex justify-between  w-full text-[10px] font-black text-slate-400">
                    <span>PROGRESS</span>
                    <span className="text-slate-900 dark:text-slate-200">
                      {completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {sortedMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="w-12 h-12 text-slate-200 mb-2" />
            <p className="text-sm font-medium text-slate-500">
              No activity to report yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
