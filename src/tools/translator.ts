import { Tool } from '../types/agent';

// Mock translation dictionary for demo purposes
const translations: Record<string, string> = {
  'good morning': 'Guten Morgen',
  'have a nice day': 'Hab einen schönen Tag',
  'sunshine': 'Sonnenschein',
  'hello': 'Hallo',
  'goodbye': 'Auf Wiedersehen',
  'thank you': 'Danke',
  'please': 'Bitte',
  'yes': 'Ja',
  'no': 'Nein',
  'water': 'Wasser',
  'food': 'Essen',
  'house': 'Haus',
  'car': 'Auto',
  'book': 'Buch',
  'computer': 'Computer',
  'phone': 'Telefon',
  'music': 'Musik',
  'love': 'Liebe',
  'friend': 'Freund'
};

export const translatorTool: Tool = {
  name: 'translator',
  description: 'Translates English text to German',
  parameters: {
    text: {
      type: 'string',
      description: 'The English text to translate'
    }
  },
  execute: async (args: { text: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const text = args.text.toLowerCase().trim();
    
    // Look for direct matches first
    if (translations[text]) {
      return {
        original: args.text,
        translated: translations[text],
        language: 'German'
      };
    }
    
    // Check for partial matches
    for (const [english, german] of Object.entries(translations)) {
      if (text.includes(english)) {
        return {
          original: args.text,
          translated: text.replace(english, german),
          language: 'German'
        };
      }
    }
    
    // Fallback for unknown phrases
    return {
      original: args.text,
      translated: `[German translation of: ${args.text}]`,
      language: 'German',
      note: 'Translation not available in demo dictionary'
    };
  }
};