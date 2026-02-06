import {
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

interface TeamDashboardStatsProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    completionRate: number;
    overdueTasks: number;
  };
}

export function TeamDashboardStats({ stats }: TeamDashboardStatsProps) {
  const statCards = [
    {
      label: "Total",
      value: stats.totalTasks,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Done",
      value: stats.completedTasks,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      subtitle: `${stats.completionRate}% rate`,
    },
    {
      label: "Active",
      value: stats.inProgressTasks,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Overdue",
      value: stats.overdueTasks,
      icon: AlertCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Main Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2rem] border border-slate-200 dark:border-slate-800 p-4 md:p-6"
          >
            <div className="flex items-start justify-between mb-2 md:mb-4">
              <div className={`p-2 md:p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
              </div>
              {stat.subtitle && (
                <div className="hidden sm:flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase">
                  <TrendingUp className="w-3 h-3" />
                </div>
              )}
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Team velocity bar & Distribution */}
      <div className="bg-wite dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Project Overview
            </h3>
          </div>
          <span className="text-2xl md:text-3xl font-black text-primary italic">
            {stats.completionRate}%
          </span>
        </div>

        <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-ember-400 rounded-full"
          />
        </div>

        <div className="flex items-center justify-betweenmt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>{stats.completionRate} tasks resolved</span>
          <span>{stats.totalTasks - stats.completedTasks} remaining</span>
        </div>
      </div>
    </div>
  );
}
