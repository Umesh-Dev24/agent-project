export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
  result?: any;
  error?: string;
  timestamp: number;
}

export interface AgentStep {
  id: string;
  description: string;
  toolCalls: ToolCall[];
  completed: boolean;
  result?: any;
}

export interface AgentExecution {
  id: string;
  query: string;
  steps: AgentStep[];
  status: 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  finalResult?: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: Record<string, any>) => Promise<any>;
}

export interface AgentMemory {
  executions: AgentExecution[];
  context: Record<string, any>;
}