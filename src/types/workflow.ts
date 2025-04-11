
export interface WorkflowTrigger {
  type: string;
  name: string;
  condition: string;
}

export interface WorkflowAction {
  type: string;
  name: string;
  parameters: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  industry: string;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  createdAt: string;
  lastRun?: string;
}
