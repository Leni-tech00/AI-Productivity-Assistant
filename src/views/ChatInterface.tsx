import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  FileText,
  Mail,
  CheckSquare,
  Search,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { supabase } from "../lib/supabase";
import { ChatMessage } from "../types";

const suggestedPrompts = [
  "Draft an out-of-office message",
  "Critique my project pitch",
  "Summarize recent industry trends",
];

const sampleResponses: Record<string, string> = {
  "Draft an out-of-office message":
    "Here's a professional out-of-office message:\n\nSubject: Out of Office — [Dates]\n\nHi there,\n\nThank you for your message. I'm currently out of the office from [start date] through [end date] and will have limited access to email.\n\nFor urgent matters, please contact [colleague name] at [email/phone]. Otherwise, I'll respond to your message upon my return.\n\nBest regards,\n[Your Name]",
  "Critique my project pitch":
    "I'd be happy to critique your pitch! Here are key areas to consider:\n\n1. **Clarity of Problem Statement** — Make sure the pain point is crystal clear in the first 30 seconds.\n2. **Solution Uniqueness** — Highlight what makes your approach different from existing solutions.\n3. **Market Sizing** — Use credible data sources and bottom-up methodology.\n4. **Team Credibility** — Emphasize relevant domain experience and past successes.\n5. **Ask Specificity** — Be clear about what you need (funding, partnership, resources).\n\nShare your pitch and I'll give specific feedback!",
  "Summarize recent industry trends":
    "Here are the top industry trends to watch:\n\n• **AI Integration** — 78% of enterprises are embedding AI into core workflows, up from 35% last year\n• **Remote-First Tools** — Async collaboration platforms seeing 40% YoY growth\n• **Sustainability Tech** — Green tech investments up 55% as regulatory pressure increases\n• **Privacy-First Architecture** — Zero-knowledge and edge computing gaining traction\n• **Consolidation** — Expect significant M&A activity as platforms seek ecosystem plays",
};

function generateResponse(prompt: string): string {
  if (sampleResponses[prompt]) return sampleResponses[prompt];
  return `That's a great question about "${prompt}". Here's my analysis:\n\nBased on the context you've provided, there are several angles to consider. First, it's important to understand the underlying goals and constraints. Second, the most effective approach typically combines strategic thinking with practical execution steps.\n\nHere are some recommendations:\n• Start by clarifying your primary objective\n• Identify key stakeholders and their priorities\n• Break the problem into manageable phases\n• Set measurable success criteria\n\nWould you like me to dive deeper into any of these areas?`;
}

const connectedFiles = [
  { icon: FileText, name: "Q4 Planning Notes.doc", type: "document" },
  { icon: Mail, name: "Client Email Draft.eml", type: "email" },
  { icon: CheckSquare, name: "Sprint Tasks.csv", type: "tasks" },
  { icon: Search, name: "Market Research.pdf", type: "research" },
];

export default function ChatInterface() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true });
    if (data && data.length > 0) {
      setMessages(data as ChatMessage[]);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Partial<ChatMessage> = { role: "user", content: text };
    const { data: userRow } = await supabase
      .from("chat_messages")
      .insert(userMsg)
      .select("*")
      .single();

    if (userRow) {
      setMessages((prev) => [...prev, userRow as ChatMessage]);
    }
    setInput("");
    setThinking(true);

    setTimeout(async () => {
      const response = generateResponse(text);
      const { data: aiRow } = await supabase
        .from("chat_messages")
        .insert({ role: "assistant", content: response })
        .select("*")
        .single();
      if (aiRow) {
        setMessages((prev) => [...prev, aiRow as ChatMessage]);
      }
      setThinking(false);
    }, 1500);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast("Response copied", "success");
  };

  const handleRetry = (index: number) => {
    if (index === 0) return;
    const userMsg = messages[index - 1];
    if (userMsg?.role !== "user") return;
    sendMessage(userMsg.content);
    showToast("Regenerating response...", "info");
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500/15 to-rose-500/5 border border-coral-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-coral-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Chatbot Interface</h1>
            <p className="text-sm text-gray-500">Your conversational AI assistant</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="glass-card flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
              {messages.length === 0 && !thinking && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral-500/15 to-rose-500/5 border border-coral-500/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-coral-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    How can I help you today?
                  </h2>
                  <p className="text-sm text-gray-500 mb-6 max-w-md">
                    Ask me anything — draft messages, critique ideas, summarize trends, or brainstorm solutions.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="pill-btn pill-btn-inactive text-xs hover:scale-105"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-slide-up ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-accent-500 to-accent-600"
                        : "bg-gradient-to-br from-coral-500 to-rose-600"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <span className="text-xs text-white font-medium">AF</span>
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[80%] ${
                      msg.role === "user" ? "items-end" : ""
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-4 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-accent-500/10 border border-accent-500/20 text-gray-200"
                          : "bg-base-700/40 border border-base-600/40 text-gray-300"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => handleCopy(msg.content)}
                          className="icon-btn text-gray-500 hover:text-white"
                          title="Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRetry(i)}
                          className="icon-btn text-gray-500 hover:text-white"
                          title="Retry"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast("Thanks for the feedback!", "success")}
                          className="icon-btn text-gray-500 hover:text-green-400"
                          title="Good response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast("Feedback noted — we'll improve", "info")}
                          className="icon-btn text-gray-500 hover:text-red-400"
                          title="Poor response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex gap-3 animate-slide-up">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="rounded-2xl p-4 bg-base-700/40 border border-base-600/40">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-coral-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-coral-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-coral-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-base-600/60 p-4">
              <div className="flex items-center gap-2">
                <button className="icon-btn text-gray-500 hover:text-coral-400">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Type your message..."
                  className="input-field text-sm"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || thinking}
                  className="action-btn-primary disabled:opacity-50 px-3"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Context Panel */}
        <div className="hidden xl:flex w-64 flex-shrink-0">
          <div className="glass-card p-5 w-full">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-coral-400" />
              Context & Files
            </h3>
            <div className="space-y-2 mb-6">
              {connectedFiles.map((file, i) => {
                const Icon = file.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-base-700/40 border border-base-600/40 hover:border-coral-500/20 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-base-600/40 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-gray-300 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-gray-600">{file.type}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-base-600/40">
              <h4 className="text-xs font-medium text-gray-400 mb-3">
                Integrations
              </h4>
              <div className="space-y-2">
                {["Email Workspace", "Task Manager", "Notes Storage"].map((int) => (
                  <div key={int} className="flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-gray-400">{int}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-yellow-500/8 border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-200/70 leading-relaxed">
                  AI responses may contain errors. Verify important information before use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
