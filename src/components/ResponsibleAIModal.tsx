import { Shield, X, Database, Scale, CheckCircle2 } from "lucide-react";

interface ResponsibleAIModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ResponsibleAIModal({
  open,
  onClose,
}: ResponsibleAIModalProps) {
  if (!open) return null;

  const principles = [
    {
      icon: Database,
      title: "Data Privacy",
      description:
        "Your inputs are processed securely and never used to train external models. All data is stored in your encrypted workspace database.",
    },
    {
      icon: Scale,
      title: "Bias Checking",
      description:
        "AI outputs are scanned for potential bias in language, sentiment, and recommendations. Bias flags are surfaced for human review before publishing.",
    },
    {
      icon: CheckCircle2,
      title: "Verification & Oversight",
      description:
        "Every AI-generated output includes an editable preview field. Human-in-the-loop review is required before sending, publishing, or acting on AI content.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-base-600/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral-500/15 border border-coral-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-coral-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Responsible AI Usage</h2>
              <p className="text-xs text-gray-500">How AideFlow AI keeps you in control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-btn text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="glass-card p-4 border-coral-500/20">
            <p className="text-sm text-gray-300 leading-relaxed">
              AideFlow AI is designed to augment human productivity, not replace
              human judgment. All AI-generated content is a starting point that
              requires your review and approval before use.
            </p>
          </div>

          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl bg-base-700/40 border border-base-600/40"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral-500/20 to-rose-500/10 border border-coral-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-coral-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="flex items-start gap-2 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-200/80 leading-relaxed">
              <span className="font-semibold">Hallucination Warning:</span> AI
              may generate incorrect or fabricated information. Always verify
              facts, dates, names, and figures against reliable sources before
              use.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-base-600/60 flex justify-end">
          <button
            onClick={onClose}
            className="action-btn-primary"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
