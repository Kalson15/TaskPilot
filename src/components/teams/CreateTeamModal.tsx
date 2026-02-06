import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Users, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeams } from "../../hooks/useTeams";
import type { CreateTeamData } from "../../types/team.types";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const { createTeam } = useTeams();
  const [formData, setFormData] = useState<CreateTeamData>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", description: "" });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("A name is required to identify your team.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createTeam(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Using Portal to ensure the modal isn't clipped by overflow-hidden parents
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Decorative Header Area */}
          <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-transparent flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  New Team
                </h2>
                <p className="text-sm text-slate-500">
                  Set up a workspace for your project.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Team Identity
                </label>
                <input
                  autoFocus
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Design Systems, Alpha Project"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tell us what this team is focusing on..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white resize-none"
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl"
                >
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {error}
                  </p>
                </motion.div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    "Initializing..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Establish Team
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
