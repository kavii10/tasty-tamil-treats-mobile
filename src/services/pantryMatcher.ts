
import { recipes } from '@/data/recipes';
import { PantryItem, RecipeMatch } from '@/types/PantryTypes';

export class PantryMatcher {
  private normalizeIngredient(ingredient: string): string {
    return ingredient.toLowerCase()
      .replace(/\d+(\.\d+)?\s*(tsp|tbsp|cup|cups|gram|grams|ml|liter|piece|pieces|handful|pinch|clove|cloves|inch)/g, '')
      .replace(/[^\w\s]/g, '')
      .trim()
      .split(' ')[0]; // Take first word for matching
  }

  private calculateTFIDF(pantryItems: string[], recipeIngredients: string[]): number {
    const normalizedPantry = pantryItems.map(item => this.normalizeIngredient(item));
    const normalizedRecipe = recipeIngredients.map(ing => this.normalizeIngredient(ing));
    
    let matches = 0;
    const matchedIngredients: string[] = [];
    
    normalizedRecipe.forEach(recipeIng => {
      if (normalizedPantry.some(pantryItem => 
        pantryItem.includes(recipeIng) || recipeIng.includes(pantryItem)
      )) {
        matches++;
        matchedIngredients.push(recipeIng);
      }
    });
    
    return (matches / normalizedRecipe.length) * 100;
  }

  public findMatchingRecipes(pantryItems: PantryItem[]): RecipeMatch[] {
    const pantryNames = pantryItems.map(item => item.name);
    const matches: RecipeMatch[] = [];
    
    recipes.forEach(recipe => {
      const matchPercentage = this.calculateTFIDF(pantryNames, recipe.ingredients_en);
      
      if (matchPercentage > 0) {
        const normalizedPantry = pantryNames.map(item => this.normalizeIngredient(item));
        const available: string[] = [];
        const missing: string[] = [];
        
        recipe.ingredients_en.forEach(ingredient => {
          const normalized = this.normalizeIngredient(ingredient);
          const isAvailable = normalizedPantry.some(pantryItem => 
            pantryItem.includes(normalized) || normalized.includes(pantryItem)
          );
          
          if (isAvailable) {
            available.push(ingredient);
          } else {
            missing.push(ingredient);
          }
        });
        
        matches.push({
          recipe,
          matchPercentage: Math.round(matchPercentage),
          missingIngredients: missing,
          availableIngredients: available
        });
      }
    });
    
    return matches.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5);
  }
}
