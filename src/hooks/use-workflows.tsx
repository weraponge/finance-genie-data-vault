import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Workflow } from "@/types/workflow";
import { toast } from "sonner";
import { analyzeStocks } from "@/services/aiService";

// Sample industry-specific prompts
const INDUSTRY_PROMPTS: Record<string, string> = {
  "Manufacturing": "Analyze these manufacturing stocks focusing on supply chain metrics, production efficiency, and raw material costs",
  "Technology": "Evaluate these technology stocks considering R&D investment, innovation pipeline, and market adoption rates",
  "Energy": "Assess these energy stocks with focus on sustainability initiatives, regulatory impacts, and resource reserves",
  "Healthcare": "Examine these healthcare stocks analyzing clinical pipelines, regulatory approvals, and market access",
  "Financial Services": "Review these financial stocks considering interest rate sensitivity, asset quality, and regulatory capital",
  "Consumer Goods": "Analyze these consumer goods stocks focusing on brand strength, consumer trends, and supply chain resilience",
  "Materials": "Evaluate these materials stocks considering commodity price exposure, production efficiency, and demand cycles",
  "Utilities": "Assess these utility stocks with focus on regulatory environment, infrastructure investment, and alternative energy adoption",
  "Real Estate": "Examine these real estate stocks analyzing occupancy rates, development pipeline, and geographic diversification",
  "Transportation": "Review these transportation stocks considering fuel efficiency, regulatory compliance, and infrastructure investment"
};

// Mock data for sample workflows
const SAMPLE_WORKFLOWS: Workflow[] = [
  {
    id: "workflow-1",
    name: "Manufacturing Daily Analysis",
    description: "Daily analysis of manufacturing stocks focusing on key performance indicators",
    industry: "Manufacturing",
    triggers: [
      { type: "Schedule", name: "Daily Market Close", condition: "Every weekday at 4:30 PM EST" }
    ],
    actions: [
      { 
        type: "Generate Analysis", 
        name: "Manufacturing Sector Analysis", 
        parameters: "depth=detailed, metrics=profit_margin,inventory_turnover,debt_to_equity" 
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "workflow-2",
    name: "Tech Sector Price Alert",
    description: "Monitor technology stocks for significant price movements",
    industry: "Technology",
    triggers: [
      { type: "Stock Price Change", name: "Significant Drop Alert", condition: "Price drops by 5% or more" }
    ],
    actions: [
      { 
        type: "Generate Analysis", 
        name: "Quick Impact Assessment", 
        parameters: "focus=price_movement,market_reaction,trading_volume" 
      },
      { 
        type: "Send Alert", 
        name: "Price Drop Notification", 
        parameters: "channels=dashboard,email" 
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

interface WorkflowsContextType {
  workflows: Workflow[];
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, workflow: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  runWorkflow: (id: string) => Promise<void>;
}

const WorkflowsContext = createContext<WorkflowsContextType | undefined>(undefined);

export function WorkflowsProvider({ children }: { children: React.ReactNode }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from Supabase or localStorage
    // For now, let's use our sample data
    setWorkflows(SAMPLE_WORKFLOWS);
  }, []);

  const addWorkflow = useCallback((workflow: Workflow) => {
    setWorkflows(prev => [...prev, workflow]);
    // In a real app, this would save to Supabase or localStorage
  }, []);

  const updateWorkflow = useCallback((id: string, updates: Partial<Workflow>) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === id ? { ...workflow, ...updates } : workflow
      )
    );
    // In a real app, this would update in Supabase or localStorage
  }, []);

  const deleteWorkflow = useCallback((id: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
    // In a real app, this would delete from Supabase or localStorage
  }, []);

  const runWorkflow = useCallback(async (id: string): Promise<void> => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) {
      throw new Error("Workflow not found");
    }
    
    // In a real implementation, we would:
    // 1. Check the trigger conditions
    // 2. Fetch the relevant data based on the workflow
    // 3. Execute each action in sequence
    // 4. Record the results

    // For now, let's simulate running the workflow by:
    // 1. Getting stocks from localStorage
    // 2. Using our aiService with an industry-specific prompt

    try {
      // Simulate loading stocks
      const savedStocksJson = localStorage.getItem("savedStocks");
      const stocks = savedStocksJson ? JSON.parse(savedStocksJson) : [];
      
      if (stocks.length === 0) {
        throw new Error("No stocks available for analysis");
      }
      
      // Generate the industry-specific prompt
      const prompt = INDUSTRY_PROMPTS[workflow.industry] || 
        `Analyze these stocks from the ${workflow.industry} industry`;
      
      // Show toast for workflow execution
      toast.info(`Running workflow: ${workflow.name}`);
      
      // Use our existing AI service with the industry-specific prompt
      const result = await analyzeStocks(prompt, stocks);
      
      // Update workflow with the last run time
      updateWorkflow(id, { lastRun: new Date().toISOString() });
      
      // In a real app, we might save the result to Supabase and display it
      // For now, let's just show it in a toast
      toast.success("Workflow completed successfully");
    } catch (error) {
      console.error("Error running workflow:", error);
      throw error;
    }
  }, [workflows, updateWorkflow]);

  return (
    <WorkflowsContext.Provider value={{ workflows, addWorkflow, updateWorkflow, deleteWorkflow, runWorkflow }}>
      {children}
    </WorkflowsContext.Provider>
  );
}

export function useWorkflows() {
  const context = useContext(WorkflowsContext);
  if (context === undefined) {
    throw new Error("useWorkflows must be used within a WorkflowsProvider");
  }
  return context;
}
