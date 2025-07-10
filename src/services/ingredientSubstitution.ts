
import { IngredientSubstitution } from '@/types/PantryTypes';

export class IngredientSubstitution {
  private substitutions: { [key: string]: { [reason: string]: string } } = {
    // Dairy substitutions
    'milk': {
      'vegan': 'coconut milk',
      'lactose-free': 'almond milk',
      'unavailable': 'water'
    },
    'butter': {
      'vegan': 'coconut oil',
      'unavailable': 'ghee',
      'low-fat': 'olive oil'
    },
    'ghee': {
      'vegan': 'coconut oil',
      'unavailable': 'butter'
    },
    
    // Egg substitutions
    'egg': {
      'vegan': 'flax egg (1 tbsp ground flaxseed + 3 tbsp water)',
      'unavailable': 'extra binding agent'
    },
    
    // Grain substitutions
    'rice': {
      'keto': 'cauliflower rice',
      'low-carb': 'cauliflower rice',
      'unavailable': 'quinoa'
    },
    'wheat flour': {
      'gluten-free': 'rice flour',
      'keto': 'almond flour',
      'unavailable': 'rice flour'
    },
    
    // Protein substitutions
    'chicken': {
      'vegetarian': 'paneer',
      'vegan': 'tofu',
      'unavailable': 'mushrooms'
    },
    'fish': {
      'vegetarian': 'paneer',
      'vegan': 'jackfruit',
      'unavailable': 'mushrooms'
    },
    
    // Spice and seasoning substitutions
    'onion': {
      'allergy': 'leek',
      'unavailable': 'shallots'
    },
    'garlic': {
      'allergy': 'asafoetida (hing)',
      'unavailable': 'ginger'
    },
    'tomato': {
      'allergy': 'red bell pepper',
      'unavailable': 'tamarind paste'
    },
    
    // Sugar substitutions
    'sugar': {
      'diabetic': 'stevia',
      'keto': 'erythritol',
      'unavailable': 'jaggery'
    },
    'jaggery': {
      'diabetic': 'stevia',
      'unavailable': 'brown sugar'
    }
  };

  private allergies: string[] = [];
  private dietRestrictions: string[] = [];
  private unavailableItems: string[] = [];

  public setUserPreferences(allergies: string[], diet: string[], unavailable: string[]): void {
    this.allergies = allergies.map(a => a.toLowerCase());
    this.dietRestrictions = diet.map(d => d.toLowerCase());
    this.unavailableItems = unavailable.map(u => u.toLowerCase());
  }

  public processIngredients(ingredients: string[]): {
    modifiedIngredients: string[];
    substitutions: IngredientSubstitution[];
  } {
    const modifiedIngredients: string[] = [];
    const substitutionsList: IngredientSubstitution[] = [];

    ingredients.forEach(ingredient => {
      const result = this.checkAndSubstitute(ingredient);
      modifiedIngredients.push(result.ingredient);
      
      if (result.substitution) {
        substitutionsList.push(result.substitution);
      }
    });

    return {
      modifiedIngredients,
      substitutions: substitutionsList
    };
  }

  private checkAndSubstitute(ingredient: string): {
    ingredient: string;
    substitution?: IngredientSubstitution;
  } {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Check for allergies first
    for (const allergy of this.allergies) {
      if (lowerIngredient.includes(allergy)) {
        const substitute = this.substitutions[allergy]?.['allergy'];
        if (substitute) {
          return {
            ingredient: ingredient.replace(new RegExp(allergy, 'gi'), substitute),
            substitution: {
              original: allergy,
              substitute,
              reason: 'allergy'
            }
          };
        }
      }
    }
    
    // Check for diet restrictions
    for (const restriction of this.dietRestrictions) {
      for (const [food, subs] of Object.entries(this.substitutions)) {
        if (lowerIngredient.includes(food) && subs[restriction]) {
          return {
            ingredient: ingredient.replace(new RegExp(food, 'gi'), subs[restriction]),
            substitution: {
              original: food,
              substitute: subs[restriction],
              reason: 'diet'
            }
          };
        }
      }
    }
    
    // Check for unavailable items
    for (const unavailable of this.unavailableItems) {
      if (lowerIngredient.includes(unavailable)) {
        const substitute = this.substitutions[unavailable]?.['unavailable'];
        if (substitute) {
          return {
            ingredient: ingredient.replace(new RegExp(unavailable, 'gi'), substitute),
            substitution: {
              original: unavailable,
              substitute,
              reason: 'unavailable'
            }
          };
        }
      }
    }
    
    return { ingredient };
  }
}
