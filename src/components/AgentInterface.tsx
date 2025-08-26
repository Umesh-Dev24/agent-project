import React, { useState, useCallback } from 'react';
import { Brain, Send, History, Download, Loader2 } from 'lucide-react';
import { AgentExecution, AgentMemory } from '../types/agent';
import { AgentEngine } from './AgentEngine';
import { ExecutionDisplay } from './ExecutionDisplay';
import { HistoryPanel } from './HistoryPanel';

export function AgentInterface() {
  const [query, setQuery] = useState('');
  const [currentExecution, setCurrentExecution] = useState<AgentExecution | null>(null);
  const [memory, setMemory] = useState<AgentMemory>({
    executions: [],
    context: {}
  });
  const [showHistory, setShowHistory] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const agentEngine = new AgentEngine();

  const handleExecute = useCallback(async () => {
    if (!query.trim() || isExecuting) return;

    setIsExecuting(true);
    const execution = await agentEngine.executeQuery(query, memory);
    setCurrentExecution(execution);
    
    // Update memory
    setMemory(prev => ({
      ...prev,
      executions: [...prev.executions, execution]
    }));
    
    setIsExecuting(false);
  }, [query, memory, isExecuting]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(memory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agent-history.json';
    link.click();
  };

  const sampleQueries = [
    "Translate 'Good Morning' into German and then multiply 5 and 6.",
    "Add 10 and 20, then translate 'Have a nice day' into German.",
    "Tell me the capital of Italy, then multiply 12 and 12.",
    "Translate 'Sunshine' into German.",
    "Add 2 and 2 and multiply 3 and 3.",
    "What is the distance between Earth and Mars?"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Agentic AI System
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Advanced AI Agent with Multi-Step Task Handling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Input */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-green-400" />
                Query Input
              </h2>
              
              <div className="space-y-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your multi-step query..."
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={handleExecute}
                      disabled={!query.trim() || isExecuting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      {isExecuting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Execute
                    </button>
                    
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <History className="w-4 h-4" />
                      History
                    </button>
                  </div>
                  
                  {memory.executions.length > 0 && (
                    <button
                      onClick={exportHistory}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sample Queries */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">
                Sample Queries (Click to use)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sampleQueries.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(sample)}
                    className="text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition-all text-sm"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Execution Display */}
            {currentExecution && (
              <ExecutionDisplay execution={currentExecution} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {showHistory && (
              <HistoryPanel 
                memory={memory}
                onSelectExecution={setCurrentExecution}
              />
            )}

            {/* Tool Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">
                Available Tools
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-400 mb-2">🌐 Translator</h4>
                  <p className="text-sm text-gray-300">
                    Translates English text to German
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-green-400 mb-2">🧮 Calculator</h4>
                  <p className="text-sm text-gray-300">
                    Performs addition and multiplication
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-400 mb-2">🧠 LLM Response</h4>
                  <p className="text-sm text-gray-300">
                    Answers general knowledge questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}