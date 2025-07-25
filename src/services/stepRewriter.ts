
import { ScaledIngredient } from '@/utils/ingredientParser';

interface StepRewriteRule {
  pattern: RegExp;
  replacement: (match: string, scaledIngredients: ScaledIngredient[], servings: number) => string;
}

export class LocalStepRewriter {
  private rules: StepRewriteRule[] = [
    // Quantity-based replacements using actual scaled ingredient amounts
    {
      pattern: /(\d+(?:\.\d+)?(?:\/\d+)?)\s*(tsp|tbsp|cup|cups|teaspoon|tablespoon|handful|pinch|clove|cloves|inch|gram|grams|ml|liter|litre|pieces?|nos?)/gi,
      replacement: (match, scaledIngredients, servings) => {
        const ingredient = this.findMatchingIngredientByMeasurement(match, scaledIngredients);
        if (ingredient && ingredient.formattedAmount) {
          return `${ingredient.formattedAmount}${ingredient.unit ? ` ${ingredient.unit}` : ''}`;
        }
        return this.scaleQuantityInText(match, servings);
      }
    },
    // Ingredient name-based replacements
    {
      pattern: /\b(onion|tomato|garlic|ginger|chili|pepper|salt|oil|water|rice|dal|lentil|cumin|mustard|turmeric|coriander|curry leaves|coconut|tamarind|jaggery|sugar)\b/gi,
      replacement: (match, scaledIngredients, servings) => {
        const ingredient = this.findMatchingIngredientByName(match, scaledIngredients);
        if (ingredient && ingredient.formattedAmount) {
          return `${ingredient.formattedAmount}${ingredient.unit ? ` ${ingredient.unit}` : ''} ${ingredient.name}`;
        }
        return match;
      }
    },
    // Time-based adjustments
    {
      pattern: /(\d+)\s*(minute|minutes|min|second|seconds|sec)/gi,
      replacement: (match, scaledIngredients, servings) => {
        const timeMatch = match.match(/(\d+)/);
        if (timeMatch) {
          const originalTime = parseInt(timeMatch[1]);
          const scaledTime = Math.round(originalTime * (1 + 0.15 * (servings - 1)));
          return match.replace(/\d+/, scaledTime.toString());
        }
        return match;
      }
    },
    // Container size adjustments
    {
      pattern: /(small|medium|large)\s*(pan|pot|bowl|vessel)/gi,
      replacement: (match, scaledIngredients, servings) => {
        if (servings <= 2) return match;
        if (servings <= 4) return match.replace(/small/i, 'medium').replace(/medium/i, 'large');
        return match.replace(/small|medium/i, 'large');
      }
    }
  ];

  rewriteSteps(
    originalSteps: string[],
    scaledIngredients: ScaledIngredient[],
    servings: number
  ): string[] {
    return originalSteps.map(step => this.rewriteStep(step, scaledIngredients, servings));
  }

  private rewriteStep(step: string, scaledIngredients: ScaledIngredient[], servings: number): string {
    let rewrittenStep = step;

    // Apply all rewriting rules
    this.rules.forEach(rule => {
      rewrittenStep = rewrittenStep.replace(rule.pattern, (match) => {
        return rule.replacement(match, scaledIngredients, servings);
      });
    });

    // Add serving-specific context
    if (servings > 1) {
      rewrittenStep = this.addServingContext(rewrittenStep, servings);
    }

    return rewrittenStep;
  }

  private findMatchingIngredientByMeasurement(text: string, ingredients: ScaledIngredient[]): ScaledIngredient | null {
    const measurementMatch = text.match(/(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-zA-Z]+)/);
    if (!measurementMatch) return null;

    const [, quantity, unit] = measurementMatch;
    const normalizedUnit = this.normalizeUnit(unit);
    
    return ingredients.find(ingredient => {
      if (!ingredient.unit || !ingredient.amount) return false;
      const ingredientUnit = this.normalizeUnit(ingredient.unit);
      const quantityMatch = Math.abs(parseFloat(quantity) - ingredient.amount) < 0.1;
      const unitMatch = ingredientUnit === normalizedUnit;
      return quantityMatch && unitMatch;
    }) || null;
  }

  private findMatchingIngredientByName(text: string, ingredients: ScaledIngredient[]): ScaledIngredient | null {
    const cleanText = text.toLowerCase();
    return ingredients.find(ingredient => {
      const ingredientName = ingredient.name.toLowerCase();
      return ingredientName.includes(cleanText) || 
             cleanText.includes(ingredientName.split(' ')[0]) ||
             ingredient.name.toLowerCase().split(' ').some(word => word.includes(cleanText));
    }) || null;
  }

  private normalizeUnit(unit: string): string {
    const unitMap: { [key: string]: string } = {
      'tsp': 'tsp',
      'teaspoon': 'tsp',
      'tbsp': 'tbsp',
      'tablespoon': 'tbsp',
      'cup': 'cup',
      'cups': 'cup',
      'gram': 'g',
      'grams': 'g',
      'ml': 'ml',
      'liter': 'l',
      'litre': 'l',
      'piece': 'piece',
      'pieces': 'piece',
      'no': 'no',
      'nos': 'no'
    };
    return unitMap[unit.toLowerCase()] || unit.toLowerCase();
  }

  private scaleQuantityInText(text: string, servings: number): string {
    const quantityMatch = text.match(/(\d+(?:\.\d+)?(?:\/\d+)?)/);
    if (!quantityMatch) return text;

    const originalQuantity = this.parseQuantity(quantityMatch[1]);
    const scaledQuantity = originalQuantity * servings;
    const formattedQuantity = this.formatQuantity(scaledQuantity);

    return text.replace(quantityMatch[1], formattedQuantity);
  }

  private parseQuantity(quantityStr: string): number {
    if (quantityStr.includes('/')) {
      const [numerator, denominator] = quantityStr.split('/');
      return parseFloat(numerator) / parseFloat(denominator);
    }
    return parseFloat(quantityStr);
  }

  private formatQuantity(quantity: number): string {
    // Handle common fractions
    if (Math.abs(quantity - 0.25) < 0.01) return '1/4';
    if (Math.abs(quantity - 0.33) < 0.02) return '1/3';
    if (Math.abs(quantity - 0.5) < 0.01) return '1/2';
    if (Math.abs(quantity - 0.67) < 0.02) return '2/3';
    if (Math.abs(quantity - 0.75) < 0.01) return '3/4';
    
    return quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(2);
  }

  private addServingContext(step: string, servings: number): string {
    // Add contextual hints for larger servings
    if (servings > 4) {
      if (step.toLowerCase().includes('mix') || step.toLowerCase().includes('stir')) {
        return step + ' (mix thoroughly for larger quantity)';
      }
      if (step.toLowerCase().includes('cook') || step.toLowerCase().includes('fry')) {
        return step + ' (may need to cook in batches)';
      }
    }
    return step;
  }
}
