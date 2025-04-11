
import { useState } from "react";
import { 
  Activity, 
  Plus, 
  Play, 
  X, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Settings,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkflows } from "@/hooks/use-workflows";
import { toast } from "sonner";

interface WorkflowPanelProps {
  onClose: () => void;
}

export function WorkflowPanel({ onClose }: WorkflowPanelProps) {
  const { workflows, runWorkflow } = useWorkflows();
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflows' | 'runs'>('workflows');

  const handleRunWorkflow = async (id: string) => {
    try {
      await runWorkflow(id);
      toast.success("Workflow executed successfully");
    } catch (error) {
      console.error("Error running workflow:", error);
      toast.error("Failed to run workflow");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          AI Workflow Engine
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-b flex">
        <Button
          variant={activeTab === 'workflows' ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => setActiveTab('workflows')}
        >
          Workflows
        </Button>
        <Button
          variant={activeTab === 'runs' ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => setActiveTab('runs')}
        >
          Run History
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === 'workflows' ? (
          <div className="p-4 space-y-4">
            <Button className="w-full" onClick={() => setShowNewWorkflow(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
            
            {workflows.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    No workflows yet. Create your first one!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <WorkflowCard 
                    key={workflow.id}
                    workflow={workflow}
                    onRun={() => handleRunWorkflow(workflow.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Run History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Workflow run history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>

      <Dialog open={showNewWorkflow} onOpenChange={setShowNewWorkflow}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
          </DialogHeader>
          <WorkflowBuilder onCancel={() => setShowNewWorkflow(false)} onSave={() => setShowNewWorkflow(false)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewWorkflow(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewWorkflow(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
