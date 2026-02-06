import { Users, Calendar, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Team } from "../../types/team.types";

interface TeamCardProps {
  team: Team & {
    role?: string;
    member_count?: number;
  };
}

export function TeamCard({ team }: TeamCardProps) {
  const isOwner = team.role === "owner";

  // High-end date formatting
  const formattedDate = new Date(team.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Generate a consistent "Brand" color based on the team name
  const teamInitial = team.name.charAt(0).toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        to={`/teams/${team.id}`}
        className="group block bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
      >
        {/* Top Section: Identity */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-4">
            {/* Visual Avatar Placeholder */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-transparent flex items-center justify-center border border-primary/10">
              <span className="text-xl font-bold text-primary">
                {teamInitial}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {team.name}
                </h3>
                {isOwner && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-100 dark:border-amber-800/50">
                    <Crown className="w-3 h-3" />
                    Owner
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                {team.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Stats & Meta */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 dark:border-slate-800/50">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Members
            </p>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">
                {team.member_count || 1}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Created
            </p>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: CTA */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Dashboard <ArrowRight className="w-3 h-3" />
          </span>

          {/* Subtle "Member Stack" decoration */}
          <div className="flex -space-x-2">
            {[...Array(Math.min(team.member_count || 1, 3))].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-500"
              >
                {i === 2 && (team.member_count || 1) > 3 ? (
                  `+${(team.member_count || 0) - 2}`
                ) : (
                  <Users className="w-3 h-3 scale-75" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
