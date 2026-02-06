import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Settings as SettingsIcon,
  BarChart3,
  LayoutGrid,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Layout & Hooks
import { MainLayout } from "../components/layout/MainLayout";
import { useTeamDetails } from "../hooks/useTeamDetails";
import { useTeamDashboard } from "../hooks/useTeamDashboard";
import { useTaskWithRelations } from "../hooks/useTaskWithRelations";
import { useUpdateTask, useDeleteTask } from "../hooks/useTasks";

// Components
import { TeamMemberList } from "../components/teams/TeamMemberList";
import { TeamSettings } from "../components/teams/TeamSettings";
import { TeamDashboardStats } from "../components/teams/TeamDashboardStats";
import { TeamTasksView } from "../components/teams/TeamTasksView";
import { TeamMemberActivity } from "../components/teams/TeamMemberActivity";
import { TeamActivityLog } from "../components/teams/TeamActivityLog";
import { TaskModal } from "../components/tasks/TaskModal";
import { Task } from "../types/database.types";

type TabType = "dashboard" | "tasks" | "members" | "settings";

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  console.log("current team id from url:", teamId);
  const navigate = useNavigate();

  // Data Orchestration
  const { team, loading: teamLoading, error, refetch } = useTeamDetails(teamId);
  const { data: dashboardData, isLoading: dashboardLoading } =
    useTeamDashboard(teamId);
  const { data: enrichedTasks = [] } = useTaskWithRelations(
    dashboardData?.tasks || [],
  );

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const tabs = useMemo(
    () => [
      { id: "dashboard", label: "Overview", icon: BarChart3 },
      { id: "tasks", label: "Workforce", icon: LayoutGrid },
      { id: "members", label: "Members", icon: Users },
      { id: "settings", label: "Settins", icon: SettingsIcon },
    ],
    [],
  );

  if (teamLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Syncing Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-center">
        <div className="w-full max-w-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4 " />

          <h2 className="text-xl font-black text-slate-900 dark:text-white ">
            Workspace Lost
          </h2>
          <p className="text-slate-500 mb-6 text-sm mt-2 ">
            {error || "Team not found."}
          </p>
          <button
            onClick={() => navigate("/teams")}
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout
      title={team.name}
      subtitle={team.description || "Active Workspace"}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Navigation Bar */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 md:w-fit w-max dark:text-white">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap${
                    isActive
                      ? "text-slate-900 dark:text-gray-500"
                      : "text-slate-400 "
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 z-10" />
                  <span className="z-10">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTeamTab"
                      className="absolute inset-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && dashboardData && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="xl:col-span-8 space-y-6 md:space-y-8 order-2 xl:order-1">
                  <TeamDashboardStats stats={dashboardData.stats} />
                  <TeamActivityLog
                    tasks={enrichedTasks}
                    members={dashboardData.members}
                  />
                </div>
                <div className="xl:col-span-4 order-1 xl:order-2">
                  <TeamMemberActivity
                    members={dashboardData.members}
                    tasksByMember={dashboardData.tasksByMember}
                  />
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="max-w-full overflow-hidden">
                <TeamTasksView
                  tasks={enrichedTasks}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                  onDeleteTask={async (id) => {
                    if (confirm("Delete?")) await deleteTask.mutateAsync(id);
                  }}
                />
              </div>
            )}

            {activeTab === "members" && <TeamMemberList teamId={team.id} />}
            {activeTab === "settings" && (
              <TeamSettings team={team} onUpdate={refetch} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={async (data) => {
          if (editingTask)
            await updateTask.mutateAsync({ id: editingTask.id, ...data });
          setIsModalOpen(false);
        }}
        task={editingTask}
        loading={updateTask.isPending}
      />
    </MainLayout>
  );
}
