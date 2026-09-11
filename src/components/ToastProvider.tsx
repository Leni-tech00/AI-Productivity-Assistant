import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast } from "../types";

interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-slide-in-right pointer-events-auto glass-card px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[400px]"
            style={{
              borderColor:
                toast.type === "success"
                  ? "rgba(34, 197, 94, 0.4)"
                  : toast.type === "error"
                  ? "rgba(239, 68, 68, 0.4)"
                  : "rgba(31, 184, 240, 0.4)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background:
                  toast.type === "success"
                    ? "#22c55e"
                    : toast.type === "error"
                    ? "#ef4444"
                    : "#1fb8f0",
              }}
            />
            <span className="text-sm text-gray-200">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
