import { useState } from "react";
import { Save, Trash2, LogOut, AlertTriangle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../../hooks/useTeams";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import type { Team, UpdateTeamData } from "../../types/team.types";
import { TeamInvite } from "./TeamInvite";

interface TeamSettingsProps {
  team: Team;
  onUpdate: () => void;
}

export function TeamSettings({ team, onUpdate }: TeamSettingsProps) {
  const navigate = useNavigate();
  const { updateTeam, deleteTeam, leaveTeam } = useTeams();
  const { getCurrentUserRole } = useTeamMembers(team.id);
  const [inviteCode, setInviteCode] = useState(team.invite_code || null);

  const [formData, setFormData] = useState<UpdateTeamData>({
    name: team.name,
    description: team.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currentRole = getCurrentUserRole();
  const isOwner = currentRole === "owner";
  const canEdit = isOwner || currentRole === "admin";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Team name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updateTeam(team.id, formData);
      setSuccess(true);
      onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update team");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `CRITICAL ACTION: Are you sure you want to delete "${team.name}"? This will permanently remove all tasks and member data. This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteTeam(team.id);
      navigate("/teams");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header with Role Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            General Settings
          </h2>
          <p className="text-slate-500 text-sm">
            Manage your team identity and preferences.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {currentRole || "Member"}
          </span>
        </div>
      </div>

      {/* Team Information Form */}
      <section className="bg-white dark:bg-slate-900 rounded-[2rem] border dark:text-slate-400 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!canEdit || loading}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none disabled:opacity-50"
                  placeholder="Enter team name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={!canEdit || loading}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none disabled:opacity-50 resize-none"
                placeholder="What is this team working on?"
              />
            </div>

            {/* Status Messages */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm">
                Changes saved successfully.
              </div>
            )}

            {canEdit && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Settings
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      {/*invite members section*/}
      {(isOwner || currentRole == "admin") && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm overflow-hidden">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
            Invite Team Members
          </h3>
          <TeamInvite
            teamId={team.id}
            inviteCode={inviteCode}
            onInviteCodeUpdated={setInviteCode}
          />
        </div>
      )}

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Danger Zone
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-rose-100 dark:border-rose-900/30 rounded-[2rem] divide-y divide-rose-50 dark:divide-rose-900/20">
          {!isOwner && (
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Leave Team
                </p>
                <p className="text-sm text-slate-500">
                  You will lose access to all tasks and project files.
                </p>
              </div>
              <button
                onClick={() => leaveTeam(team.id)}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-200 dark:border-rose-800"
              >
                <LogOut className="w-4 h-4" />
                Leave Team
              </button>
            </div>
          )}

          {isOwner && (
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Delete this team
                </p>
                <p className="text-sm text-slate-500">
                  Once you delete a team, there is no going back. Please be
                  certain.
                </p>
              </div>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                Delete Team
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
