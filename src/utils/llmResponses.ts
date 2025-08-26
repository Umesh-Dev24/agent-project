// Mock LLM responses for demo purposes
const knowledgeBase: Record<string, string> = {
  'capital of italy': 'The capital of Italy is Rome (Roma in Italian). It is located in the central-western portion of the Italian Peninsula and has been the capital since 1871.',
  'distance between earth and mars': 'The distance between Earth and Mars varies significantly due to their elliptical orbits. At their closest approach (opposition), they are about 35 million miles (56 million kilometers) apart. At their farthest, they can be as far as 250 million miles (401 million kilometers) apart. On average, the distance is approximately 140 million miles (225 million kilometers).',
  'what is ai': 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. It includes machine learning, natural language processing, computer vision, and robotics.',
  'how does machine learning work': 'Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It uses algorithms to identify patterns in data and make predictions or decisions.'
};

export async function getLLMResponse(question: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerQuestion = question.toLowerCase();
  
  // Check for exact matches
  for (const [key, response] of Object.entries(knowledgeBase)) {
    if (lowerQuestion.includes(key)) {
      return response;
    }
  }
  
  // Default response for unknown questions
  return `I understand you're asking about: "${question}". This is a simulated response from the AI agent. In a real implementation, this would connect to a language model API like OpenAI GPT or similar to provide comprehensive answers.`;
}