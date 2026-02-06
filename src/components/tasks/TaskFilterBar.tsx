import { User, Users, CheckSquare, Filter } from "lucide-react";
import { motion } from "framer-motion";

export type TaskFilter = "my-tasks" | "assigned-to-me" | "team-tasks" | "all";

interface TaskFilterBarProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts?: {
    myTasks: number;
    assignedToMe: number;
    teamTasks: number;
    all: number;
  };
}

export function TaskFilterBar({
  activeFilter,
  onFilterChange,
  counts,
}: TaskFilterBarProps) {
  const filters = [
    {
      id: "my-tasks" as TaskFilter,
      label: "Personal",
      fullLabel: "My Tasks",
      icon: User,
      count: counts?.myTasks,
    },
    {
      id: "assigned-to-me" as TaskFilter,
      label: "Assigned ",
      fullLabel: "Assigned to Me",
      icon: CheckSquare,

      count: counts?.assignedToMe,
    },
    {
      id: "team-tasks" as TaskFilter,
      label: "Team ",
      icon: Users,
      fullLabel: "Team Tasks",
      count: counts?.teamTasks,
    },
    {
      id: "all" as TaskFilter,
      label: "All Tasks",
      icon: Filter,
      fullLabel: "All Tasks",
      count: counts?.all,
    },
  ];

  return (
    <div className="w-full">
      {/*Mobile and Tablet*/}
      <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 pb-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter == filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5  rounded-full whitespace-nowrap  text-sm font-semibold border transition-all ${
                isActive
                  ? "bg-primary border-primary text-sidebar shadow-md shadow-primary/20"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
              {filter.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5  rounded-full text-xs ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {filter.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/*desktop*/}
      <div className="hidden lg:flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 w-fit">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter == filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className="relative px-6 py-2.5 flex items-center gap-3 transition-colors group"
            >
              {/*active background slide*/}
              {isActive && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-white rounded-[10px] shadow-sm border border-slate-200/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span
                  className={`text-sm font-bold transition-colors ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 group-hover:text-slate-700"
                  }`}
                >
                  {filter.fullLabel}
                </span>

                {filter.count !== undefined && (
                  <span
                    className={`text-[11px] font-black px-2 py-0.5  rounded-md transition-colors ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-slate-200 text-slate-500 group-hover:bg-slate-300"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
