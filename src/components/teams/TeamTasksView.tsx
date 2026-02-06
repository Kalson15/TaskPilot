import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, TaskStatus } from "@/types/database.types";
import { TaskCard } from "../tasks/TaskCard";
import { Filter, SortAsc, LayoutGrid, List } from "lucide-react";

interface TeamTasksViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const statusTabs: { label: string; value: TaskStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Backlog", value: "backlog" },
  { label: "To Do", value: "todo" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Done", value: "done" },
];

export function TeamTasksView({
  tasks,
  onEditTask,
  onDeleteTask,
}: TeamTasksViewProps) {
  const [activeStatus, setActiveStatus] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "priority" | "dueDate">(
    "recent",
  );

  const filteredTasks =
    activeStatus === "all"
      ? tasks
      : tasks.filter((t) => t.status === activeStatus);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const pMap = { high: 0, medium: 1, low: 2 };
        return pMap[a.priority] - pMap[b.priority];
      case "dueDate":
        return (
          new Date(a.due_date || 0).getTime() -
          new Date(b.due_date || 0).getTime()
        );
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Active Sprint
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {sortedTasks.length} Tasks Found
            </p>
          </div>
        </div>

        {/* View Toggles & Sort */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 pr-2 mr-1">
            <SortAsc className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="recent">Recent</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Deadline</option>
            </select>
          </div>
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Status Navigation (Pill Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statusTabs.map((tab) => {
          const isActive = activeStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`relative px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Tasks Grid with Entry Animations */}
      <AnimatePresence mode="popLayout">
        {sortedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No items match your filter
            </h3>
            <p className="text-sm text-slate-500">
              Try adjusting your status or sort criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {sortedTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
