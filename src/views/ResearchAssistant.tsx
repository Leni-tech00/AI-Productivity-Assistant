import { useState } from "react";
import {
  Search,
  Sparkles,
  Wand2,
  Download,
  FileText,
  Lightbulb,
  Table as TableIcon,
  Zap,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { ShimmerBlock, ShimmerText } from "../components/ShimmerLoaders";
import { ComparisonRow } from "../types";

function generateResearch(topic: string, depth: "quick" | "deep") {
  const isDeep = depth === "deep";
  return {
    keyTakeaways: isDeep
      ? `The ${topic} landscape is undergoing significant transformation driven by three key forces: technological innovation, shifting consumer expectations, and regulatory evolution. Market leaders are investing heavily in AI-first approaches, with 67% of enterprises planning to increase their spending in this area by 2025. The competitive moat is shifting from feature parity to ecosystem integration and data network effects. Early movers who establish platform partnerships now will likely capture disproportionate market share. However, execution risk remains high — 40% of initiatives fail due to organizational alignment issues rather than technology gaps.`
      : `The ${topic} space is growing rapidly with AI adoption as the primary catalyst. Key players are differentiating through ecosystem integration rather than standalone features. Market consolidation is expected within 18-24 months.`,
    insights: isDeep
      ? `1. Prioritize platform partnerships over build-from-scratch — time-to-market is the critical constraint.\n2. Invest in data infrastructure now — network effects compound and create durable competitive advantage.\n3. Regulatory compliance should be a Day 1 design principle, not an afterthought.\n4. Consider acquisitions of mid-market specialists to accelerate capability building.\n5. Allocate 15-20% of budget to emerging tech experiments to hedge against disruption.`
      : `1. Form strategic partnerships to accelerate time-to-market.\n2. Build data infrastructure for long-term advantage.\n3. Monitor regulatory developments closely.`,
    comparisonTable: [
      { name: "Market Leader", pros: "Strong brand, extensive integrations, mature platform", cons: "Higher cost, slower innovation cycle", score: "8.5/10" },
      { name: "Challenger Brand", pros: "Competitive pricing, rapid feature releases, modern UX", cons: "Limited ecosystem, smaller community", score: "7.2/10" },
      { name: "Niche Specialist", pros: "Deep domain expertise, highly customizable", cons: "Narrow scope, scaling challenges", score: "6.8/10" },
    ] as ComparisonRow[],
  };
}

export default function ResearchAssistant() {
  const { showToast } = useToast();
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"quick" | "deep">("quick");
  const [researching, setResearching] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof generateResearch> | null>(null);

  const handleResearch = () => {
    setResearching(true);
    setResult(null);
    setTimeout(() => {
      setResult(generateResearch(topic || "AI productivity tools", depth));
      setResearching(false);
      showToast(`${depth === "deep" ? "Deep dive" : "Quick brief"} complete`, "success");
    }, depth === "deep" ? 2500 : 1500);
  };

  const handleExport = (format: "pdf" | "markdown") => {
    if (!result) return;
    const content = `# Research Brief: ${topic}\n\n## Key Takeaways\n${result.keyTakeaways}\n\n## Strategic Insights\n${result.insights}\n\n## Comparison Table\n${result.comparisonTable.map(r => `| ${r.name} | ${r.pros} | ${r.cons} | ${r.score} |`).join("\n")}`;
    if (format === "markdown") {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `research-${topic || "brief"}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
    showToast(`Exported as ${format.toUpperCase()}`, "success");
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500/15 to-rose-500/5 border border-coral-500/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-coral-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Research Assistant</h1>
            <p className="text-sm text-gray-500">Deep analysis on any topic or URL</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="glass-card p-6 mb-6">
        <label className="text-xs font-medium text-gray-400 mb-2 block">
          Topic or URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., AI productivity tools market or https://example.com/report"
            className="input-field flex-1 text-sm"
          />
          <button
            onClick={handleResearch}
            disabled={researching}
            className="action-btn-primary disabled:opacity-50 whitespace-nowrap"
          >
            {researching ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Research
              </>
            )}
          </button>
        </div>

        {/* Depth Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 mr-2">Depth:</span>
          <button
            onClick={() => setDepth("quick")}
            className={`pill-btn text-xs ${depth === "quick" ? "pill-btn-active" : "pill-btn-inactive"}`}
          >
            <Zap className="w-3 h-3" />
            Quick Brief
          </button>
          <button
            onClick={() => setDepth("deep")}
            className={`pill-btn text-xs ${depth === "deep" ? "pill-btn-active" : "pill-btn-inactive"}`}
          >
            <Layers className="w-3 h-3" />
            Deep Dive
          </button>
        </div>
      </div>

      {/* Output */}
      {researching ? (
        <div className="space-y-4">
          <ShimmerBlock />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ShimmerBlock />
            <ShimmerBlock />
          </div>
        </div>
      ) : result ? (
        <div className="space-y-6">
          {/* Key Takeaways */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-coral-400" />
              Key Takeaways
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {result.keyTakeaways}
            </p>
          </div>

          {/* Strategic Insights */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-coral-400" />
              Strategic Insights & Recommendations
            </h3>
            <div className="space-y-2">
              {result.insights.split("\n").map((line, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-400 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400 mt-2 flex-shrink-0" />
                  {line.replace(/^\d+\.\s*/, "")}
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-coral-400" />
              Comparison Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-base-600/60">
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Entity</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Pros</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Cons</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {result.comparisonTable.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-base-600/30 hover:bg-base-700/30 transition-colors"
                    >
                      <td className="py-3 px-3 text-white font-medium">{row.name}</td>
                      <td className="py-3 px-3 text-green-300/70">{row.pros}</td>
                      <td className="py-3 px-3 text-red-300/70">{row.cons}</td>
                      <td className="py-3 px-3">
                        <span className="badge bg-coral-500/15 text-coral-300 border border-coral-500/30">
                          {row.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export + Warning */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => handleExport("markdown")}
              className="action-btn-secondary flex-1 justify-center"
            >
              <Download className="w-4 h-4" />
              Export to Markdown
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="action-btn-secondary flex-1 justify-center"
            >
              <Download className="w-4 h-4" />
              Export to PDF
            </button>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="font-medium text-yellow-300">AI-generated research.</span>{" "}
              Verify all data points, market figures, and competitor information against
              primary sources before using in business decisions.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-base-700/40 border border-base-600/40 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">
            Enter a topic or URL to start researching
          </p>
          <p className="text-xs text-gray-600">
            Choose Quick Brief for a fast overview or Deep Dive for comprehensive analysis
          </p>
        </div>
      )}
    </div>
  );
}
