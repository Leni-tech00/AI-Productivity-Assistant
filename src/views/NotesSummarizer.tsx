import { useState } from "react";
import {
  FileText,
  Sparkles,
  CheckSquare,
  Square,
  ListChecks,
  Calendar,
  User,
  AlertTriangle,
  TrendingUp,
  Table as TableIcon,
  Wand2,
  Clipboard,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { ShimmerText, ShimmerBlock } from "../components/ShimmerLoaders";
import { ActionItem, AgendaRow } from "../types";

const sampleTranscript = `Meeting: Q4 Product Planning Sync
Date: September 10, 2025
Attendees: Sarah Chen (VP Product), Mike Rodriguez (Eng Lead), Jenny Park (Design), David Okafor (PM)

Sarah: Let's start with the roadmap review. We need to finalize priorities for Q4. Mike, where are we on the API rebuild?

Mike: The API rebuild is about 70% done. We should have it ready by end of October if we can allocate two more engineers.

Sarah: That's a concern. Jenny, what's the design status on the new dashboard?

Jenny: I've completed the wireframes. We need feedback from the team by Friday. The main design challenge is the mobile layout for complex data tables.

David: I think we should prioritize the dashboard launch before the API rebuild. Customer feedback shows that's the bigger pain point.

Sarah: Agreed. Let's make that decision official. Dashboard launch is Priority 1 for Q4.

Mike: I'll need Jenny's final designs by next Wednesday to hit a November 15 launch.

Jenny: I can deliver by Tuesday. But I need the data schema from David.

David: I'll send the schema by Monday EOD.

Sarah: Great. Action items: David sends schema by Monday, Jenny delivers designs by Tuesday, Mike to reassign engineers to dashboard. We also need to decide on the beta testing group.

Mike: I suggest we invite our top 20 enterprise clients. I'll draft the invitation.

Sarah: Perfect. Let's reconvene next Thursday to check progress.`;

interface SummaryResult {
  executiveSummary: string;
  actionItems: ActionItem[];
  decisions: string[];
  agendaTable: AgendaRow[];
  sentiment: string;
  sentimentColor: string;
  biasFlags: string[];
}

function generateSummary(transcript: string): SummaryResult {
  return {
    executiveSummary: `The Q4 Product Planning Sync brought together product, engineering, and design leadership to finalize quarterly priorities. The team decided to prioritize the new dashboard launch over the API rebuild based on customer feedback. Key dependencies were identified: the data schema must be delivered before final designs can be completed. The team aims for a November 15 dashboard launch, with a progress check-in scheduled for next Thursday. A beta testing group of top 20 enterprise clients will be invited.`,
    actionItems: [
      { id: "1", text: "Send data schema to design team", assignee: "David Okafor", due_date: "Mon Sep 15", completed: false },
      { id: "2", text: "Deliver final dashboard designs", assignee: "Jenny Park", due_date: "Tue Sep 16", completed: false },
      { id: "3", text: "Reassign engineers to dashboard project", assignee: "Mike Rodriguez", due_date: "Fri Sep 19", completed: false },
      { id: "4", text: "Draft beta invitation for top 20 enterprise clients", assignee: "Mike Rodriguez", due_date: "Wed Sep 17", completed: false },
      { id: "5", text: "Schedule progress check-in meeting", assignee: "Sarah Chen", due_date: "Thu Sep 18", completed: false },
    ],
    decisions: [
      "Dashboard launch prioritized as Priority 1 for Q4 over API rebuild",
      "Beta testing group limited to top 20 enterprise clients",
      "Dashboard launch target date set for November 15",
      "Progress check-in scheduled for next Thursday",
    ],
    agendaTable: [
      { item: "Q4 Roadmap Review", outcome: "Priorities realigned: dashboard first", next_step: "Reallocate engineering resources" },
      { item: "API Rebuild Status", outcome: "70% complete, needs 2 more engineers", next_step: "Pause in favor of dashboard" },
      { item: "Dashboard Design Review", outcome: "Wireframes complete, mobile layout challenging", next_step: "Deliver final designs by Tuesday" },
      { item: "Beta Testing Plan", outcome: "Top 20 enterprise clients selected", next_step: "Draft and send invitations" },
    ],
    sentiment: "Constructive",
    sentimentColor: "text-green-400",
    biasFlags: [
      "Potential risk: Beta testing limited to enterprise clients only — SMB feedback may be underrepresented",
      "Unassigned: Mobile data table solution has no clear owner",
    ],
  };
}

export default function NotesSummarizer() {
  const { showToast } = useToast();
  const [transcript, setTranscript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      setResult(generateSummary(transcript));
      setGenerating(false);
      showToast("Meeting notes summarized", "success");
    }, 2000);
  };

  const handleLoadSample = () => {
    setTranscript(sampleTranscript);
    showToast("Sample transcript loaded", "info");
  };

  const toggleActionItem = (id: string) => {
    if (!result) return;
    setResult({
      ...result,
      actionItems: result.actionItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  const sentimentBadge = (sentiment: string, color: string) => {
    const bg = sentiment === "Constructive" ? "bg-green-500/15 border-green-500/30" : "bg-yellow-500/15 border-yellow-500/30";
    return (
      <span className={`badge ${bg} ${color}`}>
        <TrendingUp className="w-3 h-3" />
        {sentiment}
      </span>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500/15 to-rose-500/5 border border-coral-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-coral-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Meeting Notes Summarizer</h1>
            <p className="text-sm text-gray-500">Transform transcripts into structured insights</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Clipboard className="w-4 h-4 text-coral-400" />
            Raw Transcript / Meeting Notes
          </label>
          <button
            onClick={handleLoadSample}
            className="action-btn-secondary text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample
          </button>
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript or raw notes here..."
          className="text-area-field min-h-[160px] text-sm"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={generating || !transcript.trim()}
            className="action-btn-primary disabled:opacity-50"
          >
            {generating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Summarize Meeting
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output */}
      {generating ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ShimmerBlock />
          <ShimmerBlock />
          <ShimmerBlock className="lg:col-span-2" />
        </div>
      ) : result ? (
        <div className="space-y-6">
          {/* Executive Summary + Sentiment */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="glass-card p-6 lg:col-span-2">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-coral-400" />
                Executive Summary
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {result.executiveSummary}
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-coral-400" />
                Sentiment & Bias Analysis
              </h3>
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Meeting Sentiment</p>
                {sentimentBadge(result.sentiment, result.sentimentColor)}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-400" />
                  Bias & Risk Flags
                </p>
                <div className="space-y-2">
                  {result.biasFlags.map((flag, i) => (
                    <div
                      key={i}
                      className="text-xs text-yellow-200/80 p-2.5 rounded-lg bg-yellow-500/8 border border-yellow-500/20 leading-relaxed"
                    >
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-coral-400" />
              Action Items & Deadlines
            </h3>
            <div className="space-y-2">
              {result.actionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-base-700/40 border border-base-600/40 hover:border-coral-500/20 transition-all"
                >
                  <button
                    onClick={() => toggleActionItem(item.id)}
                    className="flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-green-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-500 hover:text-coral-400" />
                    )}
                  </button>
                  <span
                    className={`text-sm flex-1 ${
                      item.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-300"
                    }`}
                  >
                    {item.text}
                  </span>
                  <span className="badge bg-accent-500/10 text-accent-400 border border-accent-500/20 hidden sm:inline-flex">
                    <User className="w-3 h-3" />
                    {item.assignee}
                  </span>
                  <span className="badge bg-base-700/60 text-gray-400 border border-base-600/40">
                    <Calendar className="w-3 h-3" />
                    {item.due_date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Decisions + Agenda Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Decisions */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-coral-400" />
                Decisions Made
              </h3>
              <ul className="space-y-2">
                {result.decisions.map((decision, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-400 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-coral-400 mt-2 flex-shrink-0" />
                    {decision}
                  </li>
                ))}
              </ul>
            </div>

            {/* Agenda Table */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-coral-400" />
                Agenda Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-base-600/60">
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">Agenda Item</th>
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">Outcome</th>
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">Next Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.agendaTable.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-base-600/30 hover:bg-base-700/30 transition-colors"
                      >
                        <td className="py-2.5 px-2 text-gray-300">{row.item}</td>
                        <td className="py-2.5 px-2 text-gray-400">{row.outcome}</td>
                        <td className="py-2.5 px-2 text-coral-300/80">{row.next_step}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Review Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-coral-500/8 border border-coral-500/20">
            <AlertCircle className="w-4 h-4 text-coral-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="font-medium text-coral-300">AI-generated summary.</span>{" "}
              Please review action items, assignees, and deadlines for accuracy before
              assigning or acting on them.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-base-700/40 border border-base-600/40 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">
            Paste a meeting transcript and click Summarize
          </p>
          <p className="text-xs text-gray-600">
            Or click "Load Sample" to try it with example data
          </p>
        </div>
      )}
    </div>
  );
}
