import React from 'react';
import { AgentExecution } from '../types/agent';
import { CheckCircle, XCircle, Clock, Loader2, Calculator, Languages, Brain } from 'lucide-react';

interface ExecutionDisplayProps {
  execution: AgentExecution;
}

export function ExecutionDisplay({ execution }: ExecutionDisplayProps) {
  const getStepIcon = (toolName?: string) => {
    switch (toolName) {
      case 'translator':
        return <Languages className="w-5 h-5 text-blue-400" />;
      case 'calculator':
        return <Calculator className="w-5 h-5 text-green-400" />;
      default:
        return <Brain className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (status === 'running' && !completed) {
      return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
    }
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (status === 'failed') {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {getStatusIcon(execution.status, false)}
          Execution Results
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          execution.status === 'completed' ? 'bg-green-900 text-green-300' :
          execution.status === 'failed' ? 'bg-red-900 text-red-300' :
          'bg-blue-900 text-blue-300'
        }`}>
          {execution.status.toUpperCase()}
        </span>
      </div>

      {/* Query */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-sm font-medium text-gray-400 mb-2">QUERY</h3>
        <p className="text-white">{execution.query}</p>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-medium">Execution Steps</h3>
        {execution.steps.map((step, index) => (
          <div key={step.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                {step.toolCalls[0] && getStepIcon(step.toolCalls[0].name)}
                <span className="font-medium">{step.description}</span>
              </div>
              {getStatusIcon('', step.completed)}
            </div>

            {step.toolCalls.map(toolCall => (
              <div key={toolCall.id} className="ml-9 space-y-2">
                <div className="text-sm text-gray-400">
                  Tool: <span className="text-white">{toolCall.name}</span>
                </div>
                
                {toolCall.result && (
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-sm text-gray-400 mb-1">Result:</div>
                    <pre className="text-sm text-green-300 whitespace-pre-wrap">
                      {JSON.stringify(toolCall.result, null, 2)}
                    </pre>
                  </div>
                )}
                
                {toolCall.error && (
                  <div className="bg-red-900/20 border border-red-600 rounded p-3">
                    <div className="text-sm text-red-400">Error: {toolCall.error}</div>
                  </div>
                )}
              </div>
            ))}

            {step.result && typeof step.result === 'string' && (
              <div className="ml-9 mt-2 bg-gray-800 rounded p-3">
                <div className="text-sm text-gray-400 mb-1">Step Result:</div>
                <div className="text-white">{step.result}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Final Result */}
      {execution.finalResult && (
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3 text-blue-300">Final Result</h3>
          <div className="text-white whitespace-pre-wrap">{execution.finalResult}</div>
        </div>
      )}

      {/* Execution Time */}
      {execution.endTime && (
        <div className="mt-4 text-sm text-gray-400 text-right">
          Execution time: {execution.endTime - execution.startTime}ms
        </div>
      )}
    </div>
  );
}