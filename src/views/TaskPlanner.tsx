import { useState, useEffect, useCallback } from "react";
import {
  CheckSquare,
  KanbanSquare,
  List as ListIcon,
  Calendar as CalendarIcon,
  Wand2,
  Plus,
  GripVertical,
  Paperclip,
  Repeat,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { ShimmerCard } from "../components/ShimmerLoaders";
import { supabase } from "../lib/supabase";
import { Task, Subtask, TaskStatus, Priority } from "../types";

type ViewMode = "kanban" | "list" | "calendar";

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "border-t-gray-500" },
  { id: "in_progress", label: "In Progress", color: "border-t-accent-500" },
  { id: "review", label: "Review", color: "border-t-yellow-500" },
  { id: "done", label: "Done", color: "border-t-green-500" },
];

const priorityClasses: Record<Priority, string> = {
  urgent: "priority-urgent",
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

const priorityLabels: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const sampleTasks: Omit<Task, "id" | "created_at" | "updated_at">[] = [
  {
    title: "Finalize Q4 dashboard designs",
    description: "Complete wireframes and hi-fidelity mockups for the new analytics dashboard",
    status: "in_progress",
    priority: "high",
    assignee: "Jenny Park",
    due_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    recurring: "",
    subtasks: [
      { id: "s1", text: "Desktop layout mockups", completed: true },
      { id: "s2", text: "Mobile responsive design", completed: false },
      { id: "s3", text: "Design review with team", completed: false },
    ],
    attachments: [{ name: "wireframes-v2.fig", type: "figma" }],
    position: 0,
  },
  {
    title: "Send data schema to design team",
    description: "Share the updated data schema document with Jenny for dashboard integration",
    status: "todo",
    priority: "urgent",
    assignee: "David Okafor",
    due_date: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    recurring: "",
    subtasks: [],
    attachments: [{ name: "schema-v3.json", type: "json" }],
    position: 0,
  },
  {
    title: "Draft beta invitation email",
    description: "Write and send beta invitation to top 20 enterprise clients",
    status: "todo",
    priority: "medium",
    assignee: "Mike Rodriguez",
    due_date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    recurring: "",
    subtasks: [
      { id: "s4", text: "Draft email copy", completed: false },
      { id: "s5", text: "Get approval from Sarah", completed: false },
    ],
    attachments: [],
    position: 1,
  },
  {
    title: "Reassign engineers to dashboard",
    description: "Move 2 engineers from API rebuild to dashboard project",
    status: "review",
    priority: "high",
    assignee: "Mike Rodriguez",
    due_date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    recurring: "",
    subtasks: [],
    attachments: [],
    position: 0,
  },
  {
    title: "Weekly team standup",
    description: "Recurring standup to review progress and blockers",
    status: "done",
    priority: "low",
    assignee: "Sarah Chen",
    due_date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    recurring: "Weekly",
    subtasks: [],
    attachments: [],
    position: 0,
  },
];

export default function TaskPlanner() {
  const { showToast } = useToast();
  const [view, setView] = useState<ViewMode>("kanban");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [planning, setPlanning] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [scratchpad, setScratchpad] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("position", { ascending: true });

    if (error || !data || data.length === 0) {
      // Seed sample tasks
      const inserted = await supabase
        .from("tasks")
        .insert(sampleTasks)
        .select("*")
        .order("position", { ascending: true });
      if (inserted.data) {
        setTasks(inserted.data as Task[]);
      } else {
        setTasks([]);
      }
    } else {
      setTasks(data as Task[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    await supabase.from("tasks").update(updates).eq("id", id);
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
    showToast("Task deleted", "info");
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent, col: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(col);
  };

  const handleDrop = (col: TaskStatus) => {
    if (!draggedTask) return;
    updateTask(draggedTask, { status: col });
    setDraggedTask(null);
    setDragOverCol(null);
    showToast("Task moved", "success");
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updated = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    updateTask(taskId, { subtasks: updated });
  };

  const handleAIPlan = () => {
    setPlanning(true);
    setTimeout(() => {
      // Simulate AI planning by creating a few new tasks
      const newTasks: Omit<Task, "id" | "created_at" | "updated_at">[] = [
        {
          title: "Review competitor analysis report",
          description: "Analyze 3 key competitors and their Q4 strategies",
          status: "todo",
          priority: "high",
          assignee: "Sarah Chen",
          due_date: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
          recurring: "",
          subtasks: [],
          attachments: [],
          position: tasks.length,
        },
        {
          title: "Prepare Q4 budget forecast",
          description: "Compile department budgets and project resource needs",
          status: "todo",
          priority: "urgent",
          assignee: "David Okafor",
          due_date: new Date(Date.now() + 6 * 86400000).toISOString().split("T")[0],
          recurring: "",
          subtasks: [
            { id: crypto.randomUUID(), text: "Collect dept inputs", completed: false },
            { id: crypto.randomUUID(), text: "Draft forecast model", completed: false },
          ],
          attachments: [],
          position: tasks.length + 1,
        },
      ];
      supabase.from("tasks").insert(newTasks).select("*").then(({ data }) => {
        if (data) {
          setTasks((prev) => [...prev, ...(data as Task[])]);
        }
      });
      setPlanning(false);
      showToast("AI planned 2 new tasks for your week", "success");
    }, 2000);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const { data } = await supabase
      .from("tasks")
      .insert({
        title: newTaskTitle,
        description: "",
        status: "todo",
        priority: "medium",
        position: tasks.length,
      })
      .select("*")
      .single();
    if (data) {
      setTasks((prev) => [...prev, data as Task]);
      showToast("Task added", "success");
    }
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(task.id)}
      onDragEnd={() => {
        setDraggedTask(null);
        setDragOverCol(null);
      }}
      className={`glass-card p-4 cursor-grab active:cursor-grabbing transition-all hover:border-coral-500/30 ${
        draggedTask === task.id ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white leading-snug">
            {task.title}
          </h4>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 ml-6 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-1.5 ml-6">
        <span className={priorityClasses[task.priority as Priority]}>
          {priorityLabels[task.priority as Priority]}
        </span>
        {task.due_date && (
          <span className="badge bg-base-700/60 text-gray-400 border border-base-600/40">
            <CalendarIcon className="w-3 h-3" />
            {formatDate(task.due_date)}
          </span>
        )}
        {task.recurring && (
          <span className="badge bg-accent-500/10 text-accent-400 border border-accent-500/20">
            <Repeat className="w-3 h-3" />
            {task.recurring}
          </span>
        )}
        {task.attachments.length > 0 && (
          <span className="badge bg-base-700/60 text-gray-400 border border-base-600/40">
            <Paperclip className="w-3 h-3" />
            {task.attachments.length}
          </span>
        )}
        {task.subtasks.length > 0 && (
          <span className="text-[10px] text-gray-500">
            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
          </span>
        )}
      </div>
      {task.assignee && (
        <div className="ml-6 mt-2 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-coral-500/60 to-rose-500/40 flex items-center justify-center text-[9px] text-white font-medium">
            {task.assignee.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <span className="text-[10px] text-gray-500">{task.assignee}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500/15 to-rose-500/5 border border-coral-500/20 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-coral-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Task Planner & Manager</h1>
            <p className="text-sm text-gray-500">Plan, organize, and track your work</p>
          </div>
        </div>
      </div>

      {/* AI Prompt */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder='e.g., "Schedule my 5 top deliverables for this week based on priority"'
            className="input-field flex-1 text-sm"
          />
          <button
            onClick={handleAIPlan}
            disabled={planning}
            className="action-btn-primary disabled:opacity-50 whitespace-nowrap"
          >
            {planning ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin" />
                Planning...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Plan with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 p-1 rounded-xl bg-base-700/40 border border-base-600/40">
          {([
            { id: "kanban", icon: KanbanSquare, label: "Kanban" },
            { id: "list", icon: ListIcon, label: "List" },
            { id: "calendar", icon: CalendarIcon, label: "Calendar" },
          ] as const).map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  view === v.id
                    ? "bg-coral-500/20 text-coral-300 border border-coral-500/30"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {v.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="action-btn-secondary text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>

      {/* Add Task Input */}
      {showAddTask && (
        <div className="glass-card p-4 mb-4 flex gap-2 animate-slide-up">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Task title..."
            className="input-field text-sm flex-1"
            autoFocus
          />
          <button onClick={handleAddTask} className="action-btn-primary text-xs">
            Add
          </button>
          <button onClick={() => setShowAddTask(false)} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Kanban View */}
          {view === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {columns.map((col) => {
                const colTasks = tasks
                  .filter((t) => t.status === col.id)
                  .sort((a, b) => a.position - b.position);
                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={() => handleDrop(col.id)}
                    className={`glass-card p-4 border-t-2 ${col.color} min-h-[300px] transition-all ${
                      dragOverCol === col.id
                        ? "ring-2 ring-coral-500/40 bg-coral-500/5"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">
                        {col.label}
                      </h3>
                      <span className="badge bg-base-700/60 text-gray-400 border border-base-600/40">
                        {colTasks.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {colTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                      {colTasks.length === 0 && (
                        <div className="text-center py-8 text-xs text-gray-600">
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="glass-card overflow-hidden">
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-base-700/30 transition-colors"
                    onClick={() =>
                      setExpandedTask(
                        expandedTask === task.id ? null : task.id
                      )
                    }
                  >
                    {expandedTask === task.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <span
                      className={`text-xs ${
                        task.status === "done"
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {columns.find((c) => c.id === task.status)?.label}
                    </span>
                    <span className="text-sm font-medium text-white flex-1">
                      {task.title}
                    </span>
                    <span className={priorityClasses[task.priority as Priority]}>
                      {priorityLabels[task.priority as Priority]}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        {formatDate(task.due_date)}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="icon-btn text-gray-600 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {expandedTask === task.id && (
                    <div className="px-4 pb-4 ml-7 space-y-3 animate-slide-up">
                      {task.description && (
                        <p className="text-xs text-gray-500 py-2">
                          {task.description}
                        </p>
                      )}
                      {task.subtasks.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-2">
                            Subtasks & Checklist
                          </p>
                          <div className="space-y-1.5">
                            {task.subtasks.map((st) => (
                              <button
                                key={st.id}
                                onClick={() => toggleSubtask(task.id, st.id)}
                                className="flex items-center gap-2 text-xs w-full text-left group"
                              >
                                {st.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-600 group-hover:text-coral-400" />
                                )}
                                <span
                                  className={
                                    st.completed
                                      ? "text-gray-600 line-through"
                                      : "text-gray-400"
                                  }
                                >
                                  {st.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {task.attachments.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-2">
                            Attachments
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {task.attachments.map((att, i) => (
                              <span
                                key={i}
                                className="badge bg-base-700/60 text-gray-400 border border-base-600/40"
                              >
                                <Paperclip className="w-3 h-3" />
                                {att.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Assignee:</span>
                          <span className="text-xs text-gray-300">
                            {task.assignee}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Calendar View */}
          {view === "calendar" && (
            <div className="glass-card p-6">
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const today = new Date();
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(
                    today.getDate() - today.getDay() + 1 + (i < 7 ? 0 : 0)
                  );
                  const cellDate = new Date(startOfWeek);
                  cellDate.setDate(startOfWeek.getDate() + i - today.getDay() + 1);
                  const dateStr = cellDate.toISOString().split("T")[0];
                  const dayTasks = tasks.filter(
                    (t) => t.due_date === dateStr
                  );
                  const isToday = dateStr === today.toISOString().split("T")[0];

                  return (
                    <div
                      key={i}
                      className={`min-h-[80px] p-1.5 rounded-lg border ${
                        isToday
                          ? "border-coral-500/40 bg-coral-500/5"
                          : "border-base-600/30 bg-base-700/20"
                      }`}
                    >
                      <div
                        className={`text-[10px] mb-1 ${
                          isToday
                            ? "text-coral-400 font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {cellDate.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className={`text-[9px] px-1.5 py-0.5 rounded truncate ${
                              task.priority === "urgent"
                                ? "bg-red-500/15 text-red-300"
                                : task.priority === "high"
                                ? "bg-orange-500/15 text-orange-300"
                                : "bg-accent-500/15 text-accent-300"
                            }`}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-[9px] text-gray-500">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Scratchpad */}
      <div className="glass-card p-6 mt-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-coral-400" />
          Live Notes Scratchpad
          <span className="badge bg-green-500/15 text-green-400 border border-green-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-glow-pulse" />
            Collaborative
          </span>
        </h3>
        <textarea
          value={scratchpad}
          onChange={(e) => setScratchpad(e.target.value)}
          placeholder="Write shared notes, comments, or ideas here... Changes are saved automatically."
          className="text-area-field min-h-[120px] text-sm"
        />
        <div className="mt-3 flex items-start gap-3 p-3 rounded-lg bg-base-700/30 border border-base-600/30">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-coral-500 to-rose-600 flex items-center justify-center text-[10px] text-white font-medium flex-shrink-0">
            SC
          </div>
          <div>
            <p className="text-xs text-gray-300">
              <span className="font-medium">Sarah Chen</span> commented:
              "Let's prioritize the dashboard designs before the API work."
            </p>
            <p className="text-[10px] text-gray-600 mt-1">2 hours ago</p>
          </div>
        </div>
      </div>

      {/* AI Warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/8 border border-yellow-500/20 mt-6">
        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="font-medium text-yellow-300">AI-planned tasks are suggestions.</span>{" "}
          Review priorities, deadlines, and assignees before committing to the schedule.
        </p>
      </div>
    </div>
  );
}
