import { Search, Bell, Mail, Menu, Play, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Branding & Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>

          {title ? (
            <div className="truncate">
              <h1 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <div className="relative max-w-md w-full hidden sm:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Quick search (⌘K)"
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-transparent border focus:border-primary/20 focus:bg-white dark:focus:bg-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
              />
            </div>
          )}
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          {/* Enhanced Project Tracker */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden xs:flex items-center gap-2 px-3 lg:px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs lg:text-sm shadow-lg shadow-slate-200 dark:shadow-none transition-all"
          >
            <span className="hidden md:inline">Project Tracker</span>
            <div className="flex items-center justify-center w-5 h-5 bg-primary rounded-lg">
              <Play className="w-3 h-3 text-white fill-current" />
            </div>
          </motion.button>

          {/* Utility Icons */}
          <div className="hidden sm:flex items-center border-x border-slate-100 dark:border-slate-800 px-2 gap-1">
            <button className="relative p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </button>
            <button className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
              <Mail className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Dropdown Trigger */}
          <button className="flex items-center gap-2 p-1 lg:p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group">
            <div className="relative">
              <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-tr from-primary to-amber-400 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-white font-bold text-xs lg:text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                {user?.user_metadata?.full_name || "Anonymous"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Free Plan
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
