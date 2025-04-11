
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { WorkflowPanel } from "@/components/workflow/WorkflowPanel";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useMobile();
  const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        <div className="container p-6 max-w-7xl">
          {children}
        </div>
        
        {showWorkflowPanel && !isMobile && (
          <div className="fixed right-0 top-0 h-screen w-96 bg-background border-l border-border overflow-y-auto">
            <WorkflowPanel onClose={() => setShowWorkflowPanel(false)} />
          </div>
        )}
        
        {!isMobile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="fixed bottom-4 right-4 z-10"
            onClick={() => setShowWorkflowPanel(!showWorkflowPanel)}
          >
            {showWorkflowPanel ? "Hide" : "Show"} Workflow
          </Button>
        )}
        
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="fixed bottom-4 right-4 z-10"
              >
                <Menu className="h-4 w-4 mr-2" />
                Workflows
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <WorkflowPanel onClose={() => {}} />
            </SheetContent>
          </Sheet>
        )}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
