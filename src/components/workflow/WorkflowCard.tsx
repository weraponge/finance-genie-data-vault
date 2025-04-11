
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Activity,
  Building2,
  Factory
} from "lucide-react";
import { Workflow } from "@/types/workflow";

interface WorkflowCardProps {
  workflow: Workflow;
  onRun: () => void;
}

export function WorkflowCard({ workflow, onRun }: WorkflowCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Map industry to appropriate icon
  const getIndustryIcon = (industry: string) => {
    switch (industry.toLowerCase()) {
      case 'manufacturing':
        return <Factory className="h-4 w-4" />;
      case 'technology':
        return <Activity className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex-1">
          <CardTitle className="text-base">{workflow.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getIndustryIcon(workflow.industry)}
              {workflow.industry}
            </Badge>
            <Badge variant="secondary">
              {workflow.triggers.length} Trigger{workflow.triggers.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <Button size="sm" onClick={onRun}>
            <Play className="h-3 w-3 mr-1" />
            Run
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 border-t pt-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Triggers</h4>
              <ul className="text-sm space-y-1">
                {workflow.triggers.map((trigger, index) => (
                  <li key={index} className="text-muted-foreground">{trigger.name}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Actions</h4>
              <ul className="text-sm space-y-1">
                {workflow.actions.map((action, index) => (
                  <li key={index} className="text-muted-foreground">{action.name}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
