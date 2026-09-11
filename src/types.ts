export type ViewId =
  | "dashboard"
  | "email"
  | "notes"
  | "tasks"
  | "research"
  | "chat";

export type Tone = "formal" | "friendly" | "persuasive" | "urgent" | "executive";

export type Priority = "urgent" | "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export interface ReferenceFile {
  name: string;
  type: string;
  size: number;
}

export interface EmailDraft {
  id: string;
  subject: string;
  body: string;
  tone: Tone;
  recipient_persona: string;
  reference_files: ReferenceFile[];
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  due_date: string;
  completed: boolean;
}

export interface AgendaRow {
  item: string;
  outcome: string;
  next_step: string;
}

export interface NotesSummary {
  id: string;
  raw_input: string;
  executive_summary: string;
  action_items: ActionItem[];
  decisions: string[];
  agenda_table: AgendaRow[];
  sentiment: string;
  bias_flags: string[];
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskAttachment {
  name: string;
  type: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  due_date: string | null;
  recurring: string;
  subtasks: Subtask[];
  attachments: TaskAttachment[];
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ComparisonRow {
  name: string;
  pros: string;
  cons: string;
  score: string;
}

export interface ResearchBrief {
  id: string;
  topic: string;
  depth: "quick" | "deep";
  key_takeaways: string;
  insights: string;
  comparison_table: ComparisonRow[];
  created_at: string;
  updated_at: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
