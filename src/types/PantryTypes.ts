
export interface PantryItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  category: string;
}

export interface RecipeMatch {
  recipe: any;
  matchPercentage: number;
  missingIngredients: string[];
  availableIngredients: string[];
}

export interface DietType {
  id: string;
  name: string;
  restrictions: string[];
  substitutions: { [key: string]: string };
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  fiber?: number;
}

export interface WeatherBasedSuggestion {
  weather: string;
  temperature: number;
  condition: string;
  suggestedTags: string[];
}

export interface IngredientSubstitution {
  original: string;
  substitute: string;
  reason: 'allergy' | 'unavailable' | 'diet';
  ratio?: string;
}
