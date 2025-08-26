export interface ParsedQuery {
  steps: Array<{
    type: 'translation' | 'calculation' | 'llm_response';
    action: string;
    params: Record<string, any>;
  }>;
}

export function parseQuery(query: string): ParsedQuery {
  const steps: ParsedQuery['steps'] = [];
  const lowerQuery = query.toLowerCase();
  
  // Split on common conjunctions
  const parts = query.split(/\s+(?:and then|then|and|,)\s+/i);
  
  for (let part of parts) {
    part = part.trim();
    const lowerPart = part.toLowerCase();
    
    // Check for translation requests
    if (lowerPart.includes('translate') && lowerPart.includes('german')) {
      const textMatch = part.match(/['"`]([^'"`]+)['"`]/);
      if (textMatch) {
        steps.push({
          type: 'translation',
          action: 'translate_to_german',
          params: { text: textMatch[1] }
        });
      }
    }
    
    // Check for addition
    else if (lowerPart.includes('add')) {
      const numbers = part.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        steps.push({
          type: 'calculation',
          action: 'add',
          params: { 
            operation: 'add',
            a: parseInt(numbers[0]),
            b: parseInt(numbers[1])
          }
        });
      }
    }
    
    // Check for multiplication
    else if (lowerPart.includes('multiply')) {
      const numbers = part.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        steps.push({
          type: 'calculation',
          action: 'multiply',
          params: { 
            operation: 'multiply',
            a: parseInt(numbers[0]),
            b: parseInt(numbers[1])
          }
        });
      }
    }
    
    // Check for capital questions
    else if (lowerPart.includes('capital')) {
      steps.push({
        type: 'llm_response',
        action: 'answer_question',
        params: { question: part }
      });
    }
    
    // Check for distance questions
    else if (lowerPart.includes('distance')) {
      steps.push({
        type: 'llm_response',
        action: 'answer_question',
        params: { question: part }
      });
    }
    
    // Default to LLM response for unrecognized patterns
    else if (!steps.length || part.length > 10) {
      steps.push({
        type: 'llm_response',
        action: 'answer_question',
        params: { question: part }
      });
    }
  }
  
  // If no steps were identified, treat entire query as LLM response
  if (steps.length === 0) {
    steps.push({
      type: 'llm_response',
      action: 'answer_question',
      params: { question: query }
    });
  }
  
  return { steps };
}