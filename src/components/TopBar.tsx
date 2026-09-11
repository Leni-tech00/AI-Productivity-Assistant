import { Menu, Sun, Moon, Bell, Shield } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { ViewId } from "../types";

interface TopBarProps {
  onOpenSidebar: () => void;
  onOpenAIModal: () => void;
  activeView: ViewId;
}

const viewLabels: Record<ViewId, string> = {
  dashboard: "Dashboard",
  email: "Smart Email Generator",
  notes: "Meeting Notes Summarizer",
  tasks: "Task Planner & Manager",
  research: "AI Research Assistant",
  chat: "AI Chatbot Interface",
};

export default function TopBar({
  onOpenSidebar,
  onOpenAIModal,
  activeView,
}: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-base-600/60 bg-base-900/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="icon-btn lg:hidden text-gray-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-glow-pulse" />
          <span className="text-xs text-gray-500 hidden sm:inline">Workspace</span>
          <span className="text-sm font-semibold text-white">
            {viewLabels[activeView]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAIModal}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-coral-300 bg-coral-500/10 border border-coral-500/20 hover:bg-coral-500/15 transition-all"
        >
          <Shield className="w-3.5 h-3.5" />
          Responsible AI
        </button>

        <button
          onClick={toggleTheme}
          className="icon-btn text-gray-400 hover:text-white"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <button className="icon-btn text-gray-400 hover:text-white relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral-500" />
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-coral-500 to-rose-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-base-600/40 cursor-pointer hover:scale-105 transition-transform">
          AF
        </div>
      </div>
    </header>
  );
}
