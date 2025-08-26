import { Tool } from '../types/agent';

export const calculatorTool: Tool = {
  name: 'calculator',
  description: 'Performs mathematical operations (addition, multiplication)',
  parameters: {
    operation: {
      type: 'string',
      enum: ['add', 'multiply'],
      description: 'The mathematical operation to perform'
    },
    a: {
      type: 'number',
      description: 'First number'
    },
    b: {
      type: 'number',
      description: 'Second number'
    }
  },
  execute: async (args: { operation: string; a: number; b: number }) => {
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { operation, a, b } = args;
    
    switch (operation) {
      case 'add':
        return {
          operation: 'Addition',
          operands: [a, b],
          result: a + b,
          expression: `${a} + ${b} = ${a + b}`
        };
      case 'multiply':
        return {
          operation: 'Multiplication',
          operands: [a, b],
          result: a * b,
          expression: `${a} × ${b} = ${a * b}`
        };
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }
};