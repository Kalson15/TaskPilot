import { useState, useMemo } from "react";
import { User, X, Check, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeamMembers } from "@/hooks/useTeamMembers";

interface AssigneeSelectorProps {
  teamId: string | null;
  selectedUserId: string | null;
  onSelect: (userId: string | null) => void;
  disabled?: boolean;
}

export function AssigneeSelector({
  teamId,
  selectedUserId,
  onSelect,
  disabled = false,
}: AssigneeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { members, loading } = useTeamMembers(teamId || undefined);

  // Memoized filtered members for performance
  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const selectedMember = members.find((m) => m.user_id === selectedUserId);

  const handleSelect = (userId: string | null) => {
    onSelect(userId);
    setIsOpen(false);
    setSearchQuery("");
  };

  if (!teamId) {
    return (
      <div className="flex items-center gap-2 p-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400 italic">
        <User className="w-4 h-4 opacity-50" />
        Assign a team first to select a member
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border transition-all duration-200 ${
          isOpen 
            ? "border-primary ring-4 ring-primary/10 shadow-sm" 
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
        } rounded-xl disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedMember ? (
            <>
              <div className="flex-shrink-0 w-7 h-7 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary text-[10px] font-bold">
                {selectedMember.profiles?.avatar_url ? (
                   <img src={selectedMember.profiles.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                ) : (
                  selectedMember.profiles?.full_name?.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {selectedMember.profiles?.full_name}
              </span>
            </>
          ) : (
            <>
              <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-sm text-slate-500">Unassigned</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {selectedUserId && !disabled && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(null);
              }}
              className="p-1 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </div>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="absolute z-[70] mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden shadow-primary/5"
            >
              {/* Search Header */}
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 dark:text-white placeholder:text-slate-400"
                  placeholder="Find a member..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
                {loading ? (
                  <div className="p-6 text-center text-sm text-slate-500 animate-pulse">
                    Syncing members...
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-400 italic">
                    No results for "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Unassign Option */}
                    <button
                      type="button"
                      onClick={() => handleSelect(null)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                        !selectedUserId ? "bg-primary/5 text-primary" : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                           <User className="w-4 h-4 opacity-40" />
                        </div>
                        <span className="text-sm font-medium text-inherit">Unassigned</span>
                      </div>
                      {!selectedUserId && <Check className="w-4 h-4" />}
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 my-1" />

                    {/* Member List */}
                    {filteredMembers.map((member) => {
                      const isSelected = member.user_id === selectedUserId;
                      return (
                        <button
                          key={member.id}
                          onClick={() => handleSelect(member.user_id)}
                          type="button"
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                            isSelected ? "bg-primary/5 text-primary font-semibold" : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ring-2 ring-white dark:ring-slate-900 shadow-sm ${
                                isSelected ? "bg-primary text-white" : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600"
                            }`}>
                              {member.profiles?.avatar_url ? (
                                <img src={member.profiles.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                              ) : (
                                member.profiles?.full_name?.charAt(0).toUpperCase() || "U"
                              )}
                            </div>
                            <div className="text-left">
                                <p className="text-sm leading-tight">{member.profiles?.full_name}</p>
                                <p className="text-[10px] opacity-50 font-normal truncate">{member.profiles?.email || 'Team Member'}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}