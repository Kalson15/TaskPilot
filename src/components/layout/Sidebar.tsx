import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Settings,
  Eye,
  X,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`
      w-64 bg-slate-950 text-white flex flex-col h-screen fixed left-0 top-0 z-50
      border-r border-slate-800/50 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}
    >
      {/* Brand Header */}
      <div className="p-6 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <Eye className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter uppercase">
              TaskPilot
            </span>
            <div className="h-1 w-4 bg-primary rounded-full mt-[-2px]" />
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">
          Main Menu
        </p>

        {navigation.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-primary text-slate-950 shadow-lg shadow-primary/10"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-slate-900" : "group-hover:scale-110 transition-transform"}`}
                />
                <span className="font-bold text-sm">{item.name}</span>
              </div>

              {isActive && (
                <motion.div layoutId="activeIndicator">
                  <ChevronRight className="w-4 h-4 text-slate-900" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Versioning & Status */}
      <div className="p-4 m-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-200 leading-none">
              TaskPilot
            </p>
            <p className="text-slate-500 mt-1">v0.2.0</p>
          </div>
        </div>

        {/* Progress Hint (Visual Polish) */}
        
      </div>
    </aside>
  );
}
