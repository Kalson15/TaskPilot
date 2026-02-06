import { useState, useMemo } from "react";
import {
  Plus,
  LayoutGrid,
  Calendar as CalendarIcon,
  CheckCircle2,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormData, TaskModal,  } from "@/components/tasks/TaskModal";
import { TaskFilterBar, TaskFilter } from "@/components/tasks/TaskFilterBar";
import { useAuth } from "@/hooks/useAuth";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useTaskStats,
  useAssignedToMeTasks,
} from "@/hooks/useTasks";
import { Task, TaskStatus } from "@/types/database.types";
import { useTaskWithRelations } from "@/hooks/useTaskWithRelations";

const TABS: { label: string; value: TaskStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Backlog", value: "backlog" },
  { label: "To Do", value: "todo" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Done", value: "done" },
];

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TaskStatus | "all">("todo");
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("my-tasks");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Data Fetching
  const { data: myTasksRaw = [], isLoading: loadingMyTasks } = useTasks(
    user?.id,
    activeTab === "all" ? undefined : activeTab,
  );
  const { data: assignedTasksRaw = [], isLoading: loadingAssignedTasks } =
    useAssignedToMeTasks(user?.id);

  const { data: myTasks = [] } = useTaskWithRelations(myTasksRaw);
  const { data: assignedTasks = [] } = useTaskWithRelations(assignedTasksRaw);
  const { data: stats } = useTaskStats(user?.id);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // Memoized Filter Logic
  const tasks = useMemo(() => {
    let filtered: any[] = [];
    switch (activeFilter) {
      case "my-tasks":
        filtered = myTasks;
        break;
      case "assigned-to-me":
        filtered = assignedTasks.filter(
          (t) => activeTab === "all" || t.status === activeTab,
        );
        break;
      case "team-tasks":
        filtered = myTasks.filter((t) => t.team_id);
        break;
      case "all": {
        const allMap = new Map();
        myTasks.forEach((t) => allMap.set(t.id, t));
        assignedTasks.forEach((t) => allMap.set(t.id, t));
        filtered = Array.from(allMap.values()).filter(
          (t) => activeTab === "all" || t.status === activeTab,
        );
        break;
      }
      default:
        filtered = myTasks;
    }
    return filtered;
  }, [activeFilter, activeTab, myTasks, assignedTasks]);

  const isLoading = loadingMyTasks || loadingAssignedTasks;

  const completionRate = stats?.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  //guard against undefined user
  if(!user){
    return(
      <MainLayout title='Dashboard'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <p className="text-gray-500">Please log in to view your tasks</p>
        </div>
      </MainLayout>
    )
  }

  //handle task submission
  const handleTaskSubmit = async (data: TaskFormData) =>{
    try{
      if(editingTask){
        await updateTask.mutateAsync({id: editingTask.id, ...data})
      }else{
        await createTask.mutateAsync({
          ...data,
          user_id: user.id,
        })
      }
      setIsModalOpen(false)
      setEditingTask(undefined)
    }catch(err){
      console.error('Task Submission failed:' , err)
    }
  }
  return (
    <MainLayout
      title={`Hello, ${user?.user_metadata?.full_name?.split(" ")[0] || "there"}`}
      subtitle={
        stats?.today
          ? `You have ${stats.today} tasks for today.`
          : "You're all caught up!"
      }
    >
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Top Stats Overview Section */}
        <section className=" grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Task Progress"
            value={`${completionRate}%`}
            icon={<CheckCircle2 className="text-emerald-500" />}
            progress={completionRate}
          />
          <StatCard
            label="Assigned to me"
            value={assignedTasks.length}
            icon={<Users className="text-blue-500" />}
          />
          <StatCard
            label="Due Today"
            value={stats?.today || 0}
            icon={<CalendarIcon className="text-orange-500" />}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative overflow-hidden bg-primary p-4 rounded-2xl text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-between"
          >
            <div className="z-10">
              <p className="text-sm opacity-80 font-medium">Quick Action</p>
              <p className="text-xl font-bold">New Task</p>
            </div>
            <Plus className="w-8 h-8 z-10 group-hover:rotate-90 transition-transform duration-300" />
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
          </button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Workspace */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Filter & View Controls */}
            <div className="bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-slate-200 sticky top-4 z-20 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <TaskFilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={{
                  myTasks: myTasks.length,
                  assignedToMe: assignedTasks.length,
                  teamTasks: myTasks.filter((t) => t.team_id).length,
                  all: new Set([
                    ...myTasks.map((t) => t.id),
                    ...assignedTasks.map((t) => t.id),
                  ]).size,
                }}
              />

              <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
                {TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.value
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Grid */}
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <LoadingGrid />
              ) : tasks.length === 0 ? (
                <EmptyState onAdd={() => setIsModalOpen(true)} />
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TaskCard
                        task={task}
                        onEdit={setEditingTask}
                        onDelete={deleteTask.mutate}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Right Sidebar - Dynamic Info */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-primary" />
                  Team Activity
                </h3>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">
                  Phase 2
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                      >
                        <img
                          src={`https://i.pravatar.cc/150?u=${i}`}
                          alt="user"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    +12 members active
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
                  <p className="text-xs text-slate-400">
                    Calendar view integration <br />
                    coming soon
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen || !!editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
      
        onSubmit={handleTaskSubmit}
       task={editingTask}
       loading={createTask.isPending || updateTask.isPending}
      />
    </MainLayout>
  );
}

/* --- Sub-Components for Cleanliness --- */

function StatCard({ label, value, icon, progress }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {progress !== undefined && (
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-48 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
        />
      ))}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
        <LayoutGrid className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">No tasks found</h3>
      <p className="text-slate-500 max-w-xs mb-8">
        It looks like you're all caught up. Start your next project by creating
        a task.
      </p>
      <button onClick={onAdd} className="btn btn-primary px-8">
        Create Task
      </button>
    </div>
  );
}
