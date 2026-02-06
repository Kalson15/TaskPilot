import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Mail,
  Link as LinkIcon,
  Check,
  RefreshCw,
  ShieldAlert,
  Send,
} from "lucide-react";
import { regenerateInviteCode } from "@/lib/supabase/teams";

interface TeamInviteProps {
  teamId: string;
  inviteCode: string | null;
  onInviteCodeUpdated: (newCode: string) => void;
}

export function TeamInvite({
  teamId,
  inviteCode,
  onInviteCodeUpdated,
}: TeamInviteProps) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inviteLink = inviteCode
    ? `${window.location.origin}/teams/join/${inviteCode}`
    : "";

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRegenerateCode = async () => {
    const confirmed = window.confirm(
      "Security Alert: This will immediately invalidate the current invite link. Existing links shared with others will no longer work. Continue?",
    );
    if (!confirmed) return;
    try {
      setRegenerating(true);
      const newCode = await regenerateInviteCode(teamId);
      onInviteCodeUpdated(newCode);
    } catch (err) {
      console.error("Regeneration failed:", err);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/*link generator section*/}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <LinkIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Access Link
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Team Recruitment
              </p>
            </div>
          </div>
          <button
            onClick={handleRegenerateCode}
            disabled={regenerating}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
            title="Reset link security"
          >
            <RefreshCw
              className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <div className="space-y-4">
          <div
            className={`relative flex items-centerp-1.5 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl transition-all ${
              isFocused
                ? "border-amber-500 ring-4 ring-amber-500/10"
                : "border-slate-200 dark:borer-slate-700"
            }`}
          >
            <input
              type="text"
              readOnly
              value={inviteLink || "Generating Link..."}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent px-4 py-2 text-sm font-mono text-slate-600 dark:text-slate-300 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                copied
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              }`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3 h-3" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" /> Copy Link
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          <div className="flex items-center gap-2 px-2">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] font-medium text-slate-500">
              Only share this with trusted collaborators
            </p>
          </div>
        </div>
      </section>

      {/*Email Invitation section*/}
      <section className="bg-white dark:bg-slate-900 border boredr-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Mail className="w-5 h-5 text-blue-600 dar:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Direct invite
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Email Delivery
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kalson@email.com"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-20 dark:border-slate-700 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <button
            type="submit"
            disabled={!email.includes("@")}
            className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 items-center justify-center gap-2"
          >
            <Send className="w-3 h-3" /> Send Invite
          </button>
        </form>
      </section>
    </div>
  );
}
