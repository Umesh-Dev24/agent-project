import React from 'react';
import { AgentMemory, AgentExecution } from '../types/agent';
import { Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface HistoryPanelProps {
  memory: AgentMemory;
  onSelectExecution: (execution: AgentExecution) => void;
}

export function HistoryPanel({ memory, onSelectExecution }: HistoryPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-400" />
        Execution History
      </h3>

      {memory.executions.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No executions yet. Start by entering a query above.
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {memory.executions.slice().reverse().map((execution) => (
            <button
              key={execution.id}
              onClick={() => onSelectExecution(execution)}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(execution.status)}
                  <span className="text-sm text-gray-400">
                    {formatTime(execution.startTime)}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
              
              <div className="text-sm text-white line-clamp-2 mb-2">
                {execution.query}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{execution.steps.length} steps</span>
                {execution.endTime && (
                  <span>{execution.endTime - execution.startTime}ms</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Statistics */}
      {memory.executions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-600">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Statistics</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-white">
                {memory.executions.length}
              </div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-400">
                {memory.executions.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-400">Success</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-400">
                {memory.executions.filter(e => e.status === 'failed').length}
              </div>
              <div className="text-xs text-gray-400">Failed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}