import { Shield, X, Info } from "lucide-react";
import { useState } from "react";

interface DisclaimerBannerProps {
  onOpenModal: () => void;
}

export default function DisclaimerBanner({
  onOpenModal,
}: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed top-2 right-4 z-20 icon-btn text-coral-400"
        title="Show AI disclaimer"
      >
        <Shield className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-coral-500/10 via-rose-500/8 to-coral-500/10 border-b border-coral-500/20 px-4 py-2 flex items-center justify-center gap-2 text-center">
      <Shield className="w-4 h-4 text-coral-400 flex-shrink-0" />
      <p className="text-xs text-gray-300 flex-1">
        <span className="font-medium text-coral-300">AI-generated content</span>{" "}
        may require human oversight. Review outputs before sending or publishing.
      </p>
      <button
        onClick={onOpenModal}
        className="icon-btn text-gray-400 hover:text-coral-400 flex-shrink-0"
        title="Learn about responsible AI"
      >
        <Info className="w-4 h-4" />
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="icon-btn text-gray-500 hover:text-gray-300 flex-shrink-0"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
