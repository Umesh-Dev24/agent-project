import { AgentExecution, AgentStep, AgentMemory, ToolCall } from '../types/agent';
import { parseQuery } from '../utils/queryParser';
import { translatorTool } from '../tools/translator';
import { calculatorTool } from '../tools/calculator';
import { getLLMResponse } from '../utils/llmResponses';

export class AgentEngine {
  private tools = {
    translator: translatorTool,
    calculator: calculatorTool
  };

  async executeQuery(query: string, memory: AgentMemory): Promise<AgentExecution> {
    const executionId = Date.now().toString();
    const execution: AgentExecution = {
      id: executionId,
      query,
      steps: [],
      status: 'running',
      startTime: Date.now()
    };

    try {
      const parsedQuery = parseQuery(query);
      const results: string[] = [];

      for (let i = 0; i < parsedQuery.steps.length; i++) {
        const stepConfig = parsedQuery.steps[i];
        const stepId = `${executionId}-step-${i}`;
        
        const step: AgentStep = {
          id: stepId,
          description: this.getStepDescription(stepConfig),
          toolCalls: [],
          completed: false
        };

        execution.steps.push(step);

        try {
          let result: any;
          
          if (stepConfig.type === 'translation') {
            const toolCall: ToolCall = {
              id: `${stepId}-call-1`,
              name: 'translator',
              arguments: stepConfig.params,
              timestamp: Date.now()
            };
            
            step.toolCalls.push(toolCall);
            result = await this.tools.translator.execute(stepConfig.params);
            toolCall.result = result;
            
            results.push(`Translated "${result.original}" to "${result.translated}"`);
            
          } else if (stepConfig.type === 'calculation') {
            const toolCall: ToolCall = {
              id: `${stepId}-call-1`,
              name: 'calculator',
              arguments: stepConfig.params,
              timestamp: Date.now()
            };
            
            step.toolCalls.push(toolCall);
            result = await this.tools.calculator.execute(stepConfig.params);
            toolCall.result = result;
            
            results.push(`Calculated: ${result.expression}`);
            
          } else if (stepConfig.type === 'llm_response') {
            result = await getLLMResponse(stepConfig.params.question);
            results.push(result);
          }

          step.result = result;
          step.completed = true;
          
        } catch (error) {
          step.toolCalls[0] && (step.toolCalls[0].error = error instanceof Error ? error.message : 'Unknown error');
          results.push(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Add a small delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      execution.status = 'completed';
      execution.endTime = Date.now();
      execution.finalResult = results.join('\n\n');

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = Date.now();
      execution.finalResult = `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    return execution;
  }

  private getStepDescription(stepConfig: any): string {
    switch (stepConfig.type) {
      case 'translation':
        return `Translate "${stepConfig.params.text}" to German`;
      case 'calculation':
        if (stepConfig.params.operation === 'add') {
          return `Add ${stepConfig.params.a} and ${stepConfig.params.b}`;
        } else if (stepConfig.params.operation === 'multiply') {
          return `Multiply ${stepConfig.params.a} and ${stepConfig.params.b}`;
        }
        return 'Perform calculation';
      case 'llm_response':
        return `Answer: ${stepConfig.params.question}`;
      default:
        return 'Unknown step';
    }
  }
}