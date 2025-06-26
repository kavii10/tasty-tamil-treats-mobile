
interface TogetherAIMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface TogetherAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class TogetherAIService {
  private apiKey: string;
  private baseUrl = 'https://api.together.xyz/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async rewriteRecipeSteps(
    recipeName: string,
    originalSteps: string[],
    adjustedIngredients: any[],
    servings: number
  ): Promise<string[]> {
    const ingredientsList = adjustedIngredients
      .map(ing => `- ${ing.formattedAmount ? `${ing.formattedAmount}${ing.unit ? ` ${ing.unit}` : ''}` : ''} ${ing.name}`)
      .join('\n');

    const originalStepsList = originalSteps
      .map((step, index) => `${index + 1}. ${step}`)
      .join('\n');

    const messages: TogetherAIMessage[] = [
      {
        role: 'system',
        content: 'You are a professional chef assistant. Rewrite cooking instructions to match adjusted ingredient quantities while maintaining the same cooking techniques and order. Keep the same number of steps and similar structure. Be precise with measurements and cooking times.'
      },
      {
        role: 'user',
        content: `Rewrite the cooking steps for the recipe "${recipeName}" to match these adjusted ingredients for ${servings} serving${servings > 1 ? 's' : ''}:

ADJUSTED INGREDIENTS:
${ingredientsList}

ORIGINAL STEPS:
${originalStepsList}

Please rewrite each step to reflect the new ingredient quantities while keeping the same cooking methods and sequence. Return only the rewritten steps as a numbered list.`
      }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
          messages,
          max_tokens: 1000,
          temperature: 0.3,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        throw new Error(`Together AI API error: ${response.status}`);
      }

      const data: TogetherAIResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Parse the numbered list back into an array
      const rewrittenSteps = content
        .split('\n')
        .filter(line => line.trim() && /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(step => step.length > 0);

      return rewrittenSteps.length > 0 ? rewrittenSteps : originalSteps;
    } catch (error) {
      console.error('Error rewriting recipe steps:', error);
      return originalSteps; // Fallback to original steps
    }
  }
}
