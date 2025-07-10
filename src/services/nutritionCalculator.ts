
import { NutritionInfo } from '@/types/PantryTypes';

interface USDAFoodItem {
  fdcId: number;
  description: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

export class NutritionCalculator {
  private readonly USDA_API_KEY = 'DEMO_KEY'; // Users should get their own free key
  private readonly USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
  
  private unitConversions: { [key: string]: number } = {
    'cup': 240, // ml to grams (approximate for liquids)
    'cups': 240,
    'tbsp': 15,
    'tablespoon': 15,
    'tsp': 5,
    'teaspoon': 5,
    'oz': 28.35,
    'pound': 453.59,
    'lb': 453.59,
    'ml': 1,
    'liter': 1000,
    'gram': 1,
    'grams': 1,
    'kg': 1000
  };

  private parseQuantity(ingredient: string): { quantity: number; unit: string; name: string } {
    const match = ingredient.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-zA-Z]+)?\s+(.+)$/);
    
    if (match) {
      let quantity = parseFloat(match[1]);
      if (match[1].includes('/')) {
        const [num, den] = match[1].split('/');
        quantity = parseFloat(num) / parseFloat(den);
      }
      
      return {
        quantity,
        unit: match[2] || 'piece',
        name: match[3].trim()
      };
    }
    
    return { quantity: 1, unit: 'piece', name: ingredient };
  }

  private convertToGrams(quantity: number, unit: string): number {
    const conversion = this.unitConversions[unit.toLowerCase()];
    return conversion ? quantity * conversion : quantity;
  }

  public async searchFood(foodName: string): Promise<USDAFoodItem | null> {
    try {
      const response = await fetch(
        `${this.USDA_BASE_URL}/foods/search?query=${encodeURIComponent(foodName)}&api_key=${this.USDA_API_KEY}&pageSize=1`
      );
      
      if (!response.ok) {
        console.warn(`USDA API error for ${foodName}:`, response.status);
        return null;
      }
      
      const data = await response.json();
      return data.foods?.[0] || null;
    } catch (error) {
      console.warn(`Failed to fetch nutrition for ${foodName}:`, error);
      return null;
    }
  }

  public async calculateRecipeNutrition(ingredients: string[], servings: number = 1): Promise<NutritionInfo> {
    const nutrition: NutritionInfo = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      sodium: 0,
      fiber: 0
    };

    for (const ingredient of ingredients) {
      const parsed = this.parseQuantity(ingredient);
      const gramsAmount = this.convertToGrams(parsed.quantity, parsed.unit);
      
      const foodData = await this.searchFood(parsed.name);
      if (foodData) {
        const per100g = this.extractNutrients(foodData);
        const factor = gramsAmount / 100;
        
        nutrition.calories += per100g.calories * factor;
        nutrition.protein += per100g.protein * factor;
        nutrition.fat += per100g.fat * factor;
        nutrition.carbs += per100g.carbs * factor;
        nutrition.sodium += per100g.sodium * factor;
        nutrition.fiber += (per100g.fiber || 0) * factor;
      }
    }

    // Divide by servings to get per-serving nutrition
    Object.keys(nutrition).forEach(key => {
      nutrition[key as keyof NutritionInfo] = Math.round((nutrition[key as keyof NutritionInfo] / servings) * 100) / 100;
    });

    return nutrition;
  }

  private extractNutrients(foodItem: USDAFoodItem): NutritionInfo {
    const nutrients = foodItem.foodNutrients;
    
    return {
      calories: this.findNutrientValue(nutrients, 'Energy') || 0,
      protein: this.findNutrientValue(nutrients, 'Protein') || 0,
      fat: this.findNutrientValue(nutrients, 'Total lipid (fat)') || 0,
      carbs: this.findNutrientValue(nutrients, 'Carbohydrate, by difference') || 0,
      sodium: this.findNutrientValue(nutrients, 'Sodium, Na') || 0,
      fiber: this.findNutrientValue(nutrients, 'Fiber, total dietary') || 0
    };
  }

  private findNutrientValue(nutrients: any[], nutrientName: string): number {
    const nutrient = nutrients.find(n => 
      n.nutrientName.toLowerCase().includes(nutrientName.toLowerCase())
    );
    return nutrient?.value || 0;
  }
}
