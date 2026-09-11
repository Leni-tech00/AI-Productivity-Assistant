import { useState, useRef } from "react";
import {
  Mail,
  Copy,
  RefreshCw,
  Sparkles,
  Bold,
  Italic,
  List,
  Mic,
  Upload,
  FileImage,
  X,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { ShimmerText } from "../components/ShimmerLoaders";
import { Tone, ReferenceFile } from "../types";

const tones: { id: Tone; label: string }[] = [
  { id: "formal", label: "Formal" },
  { id: "friendly", label: "Friendly" },
  { id: "persuasive", label: "Persuasive" },
  { id: "urgent", label: "Urgent" },
  { id: "executive", label: "Executive" },
];

function generateEmail(
  intent: string,
  persona: string,
  tone: Tone
): { subject: string; body: string } {
  const toneStyles: Record<Tone, { greeting: string; closing: string; style: string }> = {
    formal: { greeting: "Dear", closing: "Sincerely", style: "professional and measured" },
    friendly: { greeting: "Hi", closing: "Best regards", style: "warm and approachable" },
    persuasive: { greeting: "Hello", closing: "Looking forward to your response", style: "compelling and action-oriented" },
    urgent: { greeting: "Hi", closing: "Thank you for your immediate attention", style: "direct and time-sensitive" },
    executive: { greeting: "Dear", closing: "Respectfully", style: "concise and strategic" },
  };

  const ts = toneStyles[tone];
  const name = persona || "Team";

  return {
    subject: intent
      ? `${intent.charAt(0).toUpperCase() + intent.slice(1)} — Action Required`
      : "Following Up on Recent Discussion",
    body: `${ts.greeting} ${name},

I hope this message finds you well. ${ts.style.charAt(0).toUpperCase() + ts.style.slice(1)} in tone, I wanted to reach out regarding ${intent || "our ongoing project initiatives"}.

After reviewing the current status, I believe we have an opportunity to align on key objectives and next steps. Specifically:

• Confirm the scope and timeline for the upcoming deliverables
• Identify any blockers or resource gaps that need immediate attention
• Establish a clear communication cadence going forward

I'd appreciate your input on the above points at your earliest convenience. This will help us maintain momentum and ensure we're tracking toward our shared goals.

Please let me know if you'd like to schedule a brief discussion to review in more detail.

${ts.closing},
[Your Name]`,
  };
}

export default function EmailGenerator() {
  const { showToast } = useToast();
  const [intent, setIntent] = useState("");
  const [persona, setPersona] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [files, setFiles] = useState<ReferenceFile[]>([]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [hasOutput, setHasOutput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setHasOutput(false);
    setTimeout(() => {
      const result = generateEmail(intent, persona, tone);
      setSubject(result.subject);
      setBody(result.body);
      setGenerating(false);
      setHasOutput(true);
      showToast("Email draft generated", "success");
    }, 1800);
  };

  const handleRefine = () => {
    setGenerating(true);
    setTimeout(() => {
      const refined = body + "\n\n— Refined for clarity and impact.";
      setBody(refined);
      setGenerating(false);
      showToast("Email refined with AI", "success");
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    showToast("Copied to clipboard", "success");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const newFiles: ReferenceFile[] = selected.map((f) => ({
      name: f.name,
      type: f.type,
      size: f.size,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    showToast(`${newFiles.length} file(s) attached`, "info");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const insertFormat = (type: "bold" | "italic" | "list") => {
    if (type === "bold") setBody((b) => `**${b}**`);
    if (type === "italic") setBody((b) => `*${b}*`);
    if (type === "list") setBody((b) => b + "\n• New bullet point");
    showToast(`Format applied: ${type}`, "info");
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500/15 to-rose-500/5 border border-coral-500/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-coral-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Smart Email Generator</h1>
            <p className="text-sm text-gray-500">AI-powered email drafting with tone control</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-coral-400" />
            Input
          </h2>

          {/* Intent */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">
              Subject / Intent
            </label>
            <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g., Request budget approval for Q4 marketing campaign"
              className="input-field"
            />
          </div>

          {/* Recipient Persona */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">
              Recipient Persona
            </label>
            <input
              type="text"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="e.g., Sarah Chen, VP of Marketing"
              className="input-field"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">
              Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`pill-btn ${
                    tone === t.id ? "pill-btn-active" : "pill-btn-inactive"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">
              Reference Files
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = Array.from(e.dataTransfer.files);
                setFiles((prev) => [
                  ...prev,
                  ...dropped.map((f) => ({ name: f.name, type: f.type, size: f.size })),
                ]);
              }}
              className="border-2 border-dashed border-base-600/60 rounded-xl p-6 text-center cursor-pointer hover:border-coral-500/40 transition-all"
            >
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-xs text-gray-400">
                Drop files here or click to upload
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                Images, PDFs, documents
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Voice Memo Toggle */}
            <button
              onClick={() => {
                setVoiceActive(!voiceActive);
                showToast(
                  voiceActive ? "Voice memo stopped" : "Voice memo recording...",
                  "info"
                );
              }}
              className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full justify-center ${
                voiceActive
                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                  : "bg-base-700/40 text-gray-400 border border-base-600/40 hover:border-coral-500/30"
              }`}
            >
              <Mic
                className={`w-4 h-4 ${voiceActive ? "animate-pulse" : ""}`}
              />
              {voiceActive ? "Recording voice memo..." : "Add voice memo reference"}
            </button>

            {/* Attached Files */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-base-700/40 border border-base-600/40"
                  >
                    <FileImage className="w-4 h-4 text-accent-400 flex-shrink-0" />
                    <span className="text-xs text-gray-300 flex-1 truncate">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {formatSize(file.size)}
                    </span>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-500 hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="action-btn-primary w-full justify-center disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Email
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="glass-card p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-coral-400" />
              Output
            </h2>
            {hasOutput && !generating && (
              <div className="flex items-center gap-1 text-yellow-400/70">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[10px]">Review before sending</span>
              </div>
            )}
          </div>

          {generating ? (
            <div className="flex-1 space-y-4 py-8">
              <div className="shimmer-bg h-6 w-3/4 rounded" />
              <div className="shimmer-bg h-4 w-1/2 rounded" />
              <div className="mt-6 space-y-2">
                <ShimmerText lines={8} />
              </div>
            </div>
          ) : hasOutput ? (
            <>
              {/* Subject */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Formatting Controls */}
              <div className="flex items-center gap-1 pb-1">
                <button
                  onClick={() => insertFormat("bold")}
                  className="icon-btn text-gray-400 hover:text-white"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormat("italic")}
                  className="icon-btn text-gray-400 hover:text-white"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormat("list")}
                  className="icon-btn text-gray-400 hover:text-white"
                  title="Bullet list"
                >
                  <List className="w-4 h-4" />
                </button>
                <div className="flex-1" />
              </div>

              {/* Body */}
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="text-area-field flex-1 min-h-[280px] text-sm leading-relaxed"
              />

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={handleCopy} className="action-btn-secondary">
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button onClick={handleRefine} className="action-btn-secondary">
                  <Sparkles className="w-4 h-4" />
                  Refine with AI
                </button>
                <button onClick={handleGenerate} className="action-btn-secondary">
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-base-700/40 border border-base-600/40 flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-sm text-gray-500">
                Your generated email will appear here
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Fill in the input fields and click Generate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
