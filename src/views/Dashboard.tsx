import {
  Mail,
  FileText,
  CheckSquare,
  Search,
  MessageSquare,
  Clock,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ViewId } from "../types";

interface DashboardProps {
  onNavigate: (view: ViewId) => void;
}

const metrics = [
  {
    icon: Clock,
    label: "Hours saved / week",
    value: "7.5h",
    subtext: "Across all tools",
    color: "text-coral-400",
    bg: "from-coral-500/15 to-rose-500/5",
  },
  {
    icon: Zap,
    label: "Faster response time",
    value: "15x",
    subtext: "vs. manual drafting",
    color: "text-accent-400",
    bg: "from-accent-500/15 to-accent-600/5",
  },
  {
    icon: ShieldCheck,
    label: "Editable & private",
    value: "100%",
    subtext: "Human-in-the-loop",
    color: "text-green-400",
    bg: "from-green-500/15 to-green-600/5",
  },
];

const tools: {
  id: ViewId;
  icon: React.ElementType;
  title: string;
  description: string;
  tag: string;
}[] = [
  {
    id: "email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Draft professional emails with tone control and multimodal references.",
    tag: "Writing",
  },
  {
    id: "notes",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    description: "Transform raw transcripts into structured summaries, action items, and decisions.",
    tag: "Analysis",
  },
  {
    id: "tasks",
    icon: CheckSquare,
    title: "Task Planner & Manager",
    description: "Plan your week with AI, manage tasks across Kanban, list, and calendar views.",
    tag: "Planning",
  },
  {
    id: "research",
    icon: Search,
    title: "AI Research Assistant",
    description: "Get key takeaways, strategic insights, and comparison tables on any topic.",
    tag: "Research",
  },
  {
    id: "chat",
    icon: MessageSquare,
    title: "AI Chatbot Interface",
    description: "Conversational AI for drafting, critiquing, brainstorming, and quick answers.",
    tag: "Assistant",
  },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="glow-card p-8 lg:p-10 animate-slide-up">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge bg-coral-500/15 text-coral-300 border border-coral-500/30">
                <Sparkles className="w-3 h-3" />
                AI Workspace
              </span>
              <span className="badge bg-green-500/15 text-green-400 border border-green-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-glow-pulse" />
                Online
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
              Your AI Workplace Assistant
            </h1>
            <p className="text-gray-400 text-sm lg:text-base leading-relaxed mb-6">
              Automate emails, summarize meetings, plan your week, and research
              smarter from one unified workspace.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("email")}
                className="action-btn-primary"
              >
                <Mail className="w-4 h-4" />
                Start with Email
              </button>
              <button
                onClick={() => onNavigate("chat")}
                className="action-btn-secondary"
              >
                <MessageSquare className="w-4 h-4" />
                Open AI Chat
              </button>
            </div>
          </div>
          <div className="hidden lg:flex flex-shrink-0">
            <div className="relative w-48 h-48 rounded-2xl bg-gradient-to-br from-coral-500/20 via-rose-500/10 to-accent-500/10 border border-base-600/60 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,84,66,0.15),transparent_70%)]" />
              <Sparkles className="w-20 h-20 text-coral-400/60 relative z-10" />
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-coral-500/40 animate-glow-pulse" />
              <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-accent-500/40 animate-glow-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="glass-card-hover p-6 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.bg} border border-base-600/40 flex items-center justify-center mb-4`}
              >
                <Icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className={`text-3xl font-bold ${m.color} mb-1`}>
                {m.value}
              </div>
              <div className="text-sm font-medium text-gray-300">
                {m.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{m.subtext}</div>
            </div>
          );
        })}
      </section>

      {/* Tool Grid */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-coral-400" />
          <h2 className="text-lg font-semibold text-white">Productivity Tools</h2>
          <span className="text-xs text-gray-500">— 5 specialized AI tools</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="glass-card-hover p-6 flex flex-col animate-slide-up group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-500/15 to-rose-500/5 border border-coral-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-coral-400" />
                  </div>
                  <span className="badge bg-base-700/60 text-gray-400 border border-base-600/40">
                    {tool.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">
                  {tool.description}
                </p>
                <button
                  onClick={() => onNavigate(tool.id)}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-coral-400 hover:text-coral-300 transition-colors"
                >
                  Launch tool
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}

          {/* CTA Card */}
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center border-dashed border-base-600/40 min-h-[220px]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/15 to-accent-600/5 border border-accent-500/20 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-accent-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              More tools coming
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              We're adding new AI capabilities regularly
            </p>
            <button
              onClick={() => onNavigate("chat")}
              className="text-xs font-medium text-accent-400 hover:text-accent-300"
            >
              Try AI Chat →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
