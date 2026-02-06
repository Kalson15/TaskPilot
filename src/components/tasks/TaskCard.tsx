import { Task } from "@/types/database.types";
import { Calendar, Trash2, Users, Edit3, MoreHorizontal } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

interface TaskCardProps {
  task: Task & {
    assigned_user?: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
    team?: {
      id: string;
      name: string;
    } | null;
  };
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  low: {
    styles: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  medium: {
    styles: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
  high: {
    styles: "bg-rose-50 text-rose-700 border-rose-100",
    dot: "bg-rose-500",
  },
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const isOverdue =
    task.due_date &&
    isPast(new Date(task.due_date)) &&
    !isToday(new Date(task.due_date)) &&
    task.status !== "done";

  return (
    <div
      onClick={() => onEdit(task)}
      className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${priorityConfig[task.priority].styles}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority].dot}`}
            />
            {task.priority}
          </span>

          {isOverdue && (
            <span className="bg-rose-100 text-rose-600 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase">
              Overdue
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1.5 hover:bg-rose-50 rounded-md text-slate-500 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <h3 className="font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {task.due_date && (
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? "text-rose-500" : "text-slate-400"}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(task.due_date), "MMM d")}</span>
            </div>
          )}

          {task.team && (
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
              <Users className="w-3 h-3" />
              <span>{task.team.name}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        {task.assigned_user ? (
          <div className="relative group/avatar">
            <div className="w-7 h-7 rounded-full bg-primary/10 border-2 border-white ring-1 ring-slate-100 overflow-hidden shadow-sm">
              {task.assigned_user.avatar_url ? (
                <img
                  src={task.assigned_user.avatar_url}
                  alt={task.assigned_user.full_name || ""}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                  {task.assigned_user.full_name?.charAt(0) || "?"}
                </div>
              )}
            </div>
            {/* Tooltip on Avatar Hover */}
            <span className="absolute bottom-full right-0 mb-2 hidden group-hover/avatar:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
              {task.assigned_user.full_name}
            </span>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
            <MoreHorizontal className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Progress Stripe based on status */}
      <div
        className={`absolute bottom-0 left-0 h-1 transition-all duration-500 group-hover:h-1.5
        ${
          task.status === "done"
            ? "bg-emerald-400 w-full"
            : task.status === "upcoming"
              ? "bg-amber-400 w-1/2"
              : task.status === "todo"
                ? "bg-primary w-1/4"
                : "bg-slate-200 w-0"
        }`}
      />
    </div>
  );
}
