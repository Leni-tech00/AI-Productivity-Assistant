import { useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/ToastProvider";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import DisclaimerBanner from "./components/DisclaimerBanner";
import ResponsibleAIModal from "./components/ResponsibleAIModal";
import Dashboard from "./views/Dashboard";
import EmailGenerator from "./views/EmailGenerator";
import NotesSummarizer from "./views/NotesSummarizer";
import TaskPlanner from "./views/TaskPlanner";
import ResearchAssistant from "./views/ResearchAssistant";
import ChatInterface from "./views/ChatInterface";
import { ViewId } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveView} />;
      case "email":
        return <EmailGenerator />;
      case "notes":
        return <NotesSummarizer />;
      case "tasks":
        return <TaskPlanner />;
      case "research":
        return <ResearchAssistant />;
      case "chat":
        return <ChatInterface />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="flex min-h-screen">
          <Sidebar
            activeView={activeView}
            onNavigate={setActiveView}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
          <div className="flex-1 flex flex-col min-w-0">
            <DisclaimerBanner onOpenModal={() => setAiModalOpen(true)} />
            <TopBar
              onOpenSidebar={() => setMobileSidebarOpen(true)}
              onOpenAIModal={() => setAiModalOpen(true)}
              activeView={activeView}
            />
            <main className="flex-1 overflow-y-auto">
              <div key={activeView} className="animate-fade-in">
                {renderView()}
              </div>
            </main>
          </div>
        </div>
        <ResponsibleAIModal
          open={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
        />
      </ToastProvider>
    </ThemeProvider>
  );
}
