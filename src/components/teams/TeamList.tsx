import { useState, useMemo } from "react";
import {
  Plus,
  Users as UsersIcon,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeams } from "../../hooks/useTeams";
import { TeamCard } from "./TeamCard";
import { CreateTeamModal } from "./CreateTeamModal";

export function TeamList() {
  const { teams = [], loading, error } = useTeams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [teams, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
          <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">
          Synchronizing teams...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-[2rem] text-center">
        <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UsersIcon className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Teams
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            Manage your organizations and workspaces. Collaborators are grouped
            here to share tasks and progress.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="group relative flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Create New Team
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button className="p-2 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-primary">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="popLayout">
        {teams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-inner flex items-center justify-center mb-6">
              <UsersIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Start your first workspace
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs text-center">
              You aren't a member of any teams yet. Create one to start
              assigning tasks.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Build a Team
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}

            {/* Add Hint for empty search results */}
            {filteredTeams.length === 0 && (
              <div className="col-span-full py-10 text-center text-slate-400 italic">
                No teams found matching "{searchQuery}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
