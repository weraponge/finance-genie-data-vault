
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkflows } from "@/hooks/use-workflows";
import { toast } from "sonner";

const INDUSTRIES = [
  "Manufacturing",
  "Technology",
  "Energy",
  "Healthcare",
  "Financial Services",
  "Consumer Goods",
  "Materials",
  "Utilities",
  "Real Estate",
  "Transportation"
];

const TRIGGER_TYPES = [
  "Schedule",
  "Stock Price Change",
  "Industry News",
  "Economic Indicator",
  "Earnings Report",
  "Market Open/Close",
  "Sector Performance"
];

const ACTION_TYPES = [
  "Generate Analysis",
  "Send Alert",
  "Update Dashboard",
  "Compare to Sector Average",
  "Predict Price Movement",
  "Analyze Risk Metrics",
  "Evaluate Financial Statements"
];

interface WorkflowBuilderProps {
  onCancel: () => void;
  onSave: () => void;
}

export function WorkflowBuilder({ onCancel, onSave }: WorkflowBuilderProps) {
  const { addWorkflow } = useWorkflows();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [triggers, setTriggers] = useState([{ type: "", name: "", condition: "" }]);
  const [actions, setActions] = useState([{ type: "", name: "", parameters: "" }]);

  const handleAddTrigger = () => {
    setTriggers([...triggers, { type: "", name: "", condition: "" }]);
  };

  const handleRemoveTrigger = (index: number) => {
    setTriggers(triggers.filter((_, i) => i !== index));
  };

  const handleUpdateTrigger = (index: number, field: string, value: string) => {
    const updatedTriggers = [...triggers];
    (updatedTriggers[index] as any)[field] = value;
    
    // If type changes, update the name field with a default
    if (field === "type") {
      updatedTriggers[index].name = `${value} Trigger`;
    }
    
    setTriggers(updatedTriggers);
  };

  const handleAddAction = () => {
    setActions([...actions, { type: "", name: "", parameters: "" }]);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleUpdateAction = (index: number, field: string, value: string) => {
    const updatedActions = [...actions];
    (updatedActions[index] as any)[field] = value;
    
    // If type changes, update the name field with a default
    if (field === "type") {
      updatedActions[index].name = `${value} Action`;
    }
    
    setActions(updatedActions);
  };

  const handleSave = () => {
    if (!name) {
      toast.error("Please provide a workflow name");
      return;
    }
    
    if (!industry) {
      toast.error("Please select an industry");
      return;
    }
    
    if (triggers.some(t => !t.type)) {
      toast.error("Please complete all trigger configurations");
      return;
    }
    
    if (actions.some(a => !a.type)) {
      toast.error("Please complete all action configurations");
      return;
    }
    
    try {
      addWorkflow({
        id: `workflow-${Date.now()}`,
        name,
        description,
        industry,
        triggers,
        actions,
        createdAt: new Date().toISOString()
      });
      
      toast.success("Workflow created successfully");
      onSave();
    } catch (error) {
      console.error("Error creating workflow:", error);
      toast.error("Failed to create workflow");
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Workflow Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Manufacturing Sector Daily Analysis"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the purpose of this workflow..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger id="industry">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Triggers</Label>
          <Button variant="outline" size="sm" onClick={handleAddTrigger}>
            <Plus className="h-4 w-4 mr-1" /> Add Trigger
          </Button>
        </div>
        
        {triggers.map((trigger, index) => (
          <div key={index} className="space-y-2 border p-3 rounded-md">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Trigger {index + 1}</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveTrigger(index)}
                disabled={triggers.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`trigger-${index}-type`}>Type</Label>
              <Select 
                value={trigger.type} 
                onValueChange={(value) => handleUpdateTrigger(index, "type", value)}
              >
                <SelectTrigger id={`trigger-${index}-type`}>
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`trigger-${index}-name`}>Name</Label>
              <Input
                id={`trigger-${index}-name`}
                value={trigger.name}
                onChange={(e) => handleUpdateTrigger(index, "name", e.target.value)}
                placeholder="e.g., Daily Market Open"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`trigger-${index}-condition`}>Condition</Label>
              <Input
                id={`trigger-${index}-condition`}
                value={trigger.condition}
                onChange={(e) => handleUpdateTrigger(index, "condition", e.target.value)}
                placeholder="e.g., Price drops by 5%"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Actions</Label>
          <Button variant="outline" size="sm" onClick={handleAddAction}>
            <Plus className="h-4 w-4 mr-1" /> Add Action
          </Button>
        </div>
        
        {actions.map((action, index) => (
          <div key={index} className="space-y-2 border p-3 rounded-md">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Action {index + 1}</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveAction(index)}
                disabled={actions.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`action-${index}-type`}>Type</Label>
              <Select 
                value={action.type} 
                onValueChange={(value) => handleUpdateAction(index, "type", value)}
              >
                <SelectTrigger id={`action-${index}-type`}>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`action-${index}-name`}>Name</Label>
              <Input
                id={`action-${index}-name`}
                value={action.name}
                onChange={(e) => handleUpdateAction(index, "name", e.target.value)}
                placeholder="e.g., Generate Daily Report"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`action-${index}-parameters`}>Parameters</Label>
              <Textarea
                id={`action-${index}-parameters`}
                value={action.parameters}
                onChange={(e) => handleUpdateAction(index, "parameters", e.target.value)}
                placeholder="e.g., industry=manufacturing, depth=detailed"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
