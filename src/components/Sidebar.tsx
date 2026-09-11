import {
  LayoutDashboard,
  Mail,
  FileText,
  CheckSquare,
  Search,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ViewId } from "../types";

interface SidebarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: {
  id: ViewId;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview" },
  { id: "email", label: "Smart Email", icon: Mail, description: "Generator" },
  { id: "notes", label: "Notes Summarizer", icon: FileText, description: "Meeting notes" },
  { id: "tasks", label: "Task Planner", icon: CheckSquare, description: "Kanban & lists" },
  { id: "research", label: "Research Assistant", icon: Search, description: "AI research" },
  { id: "chat", label: "AI Chatbot", icon: MessageSquare, description: "Conversation" },
];

export default function Sidebar({
  activeView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col border-r border-base-600/60 bg-base-800/90 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-base-600/60 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(249,84,66,0.3)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <h1 className="text-base font-bold text-white whitespace-nowrap">AideFlow AI</h1>
              <p className="text-[11px] text-gray-500 whitespace-nowrap">Workplace Companion</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? "nav-item-active" : "nav-item-inactive"} ${
                  collapsed ? "justify-center" : ""
                }`}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-coral-400" : ""}`}
                />
                {!collapsed && (
                  <div className="flex-1 overflow-hidden">
                    <div className="whitespace-nowrap">{item.label}</div>
                    <div className="text-[10px] text-gray-500 whitespace-nowrap">
                      {item.description}
                    </div>
                  </div>
                )}
                {isActive && !collapsed && (
                  <div className="w-1.5 h-1.5 rounded-full bg-coral-400 animate-glow-pulse" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-base-600/60 p-3 flex-shrink-0 hidden lg:block">
          <button
            onClick={onToggleCollapse}
            className="icon-btn w-full flex items-center justify-center text-gray-400 hover:text-gray-200"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
