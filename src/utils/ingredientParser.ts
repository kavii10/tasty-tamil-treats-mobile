
export interface ParsedIngredient {
  amount: number | null;
  unit: string;
  name: string;
  originalText: string;
}

export interface ScaledIngredient {
  name: string;
  amount: number | null;
  unit: string;
  formattedAmount: string;
}

// Common spices that should use reduced scaling
const SPICES = [
  'salt', 'turmeric', 'pepper', 'mustard', 'cumin', 'hing', 'asafoetida',
  'curry leaves', 'coriander', 'sambar powder', 'rasam powder', 'garam masala',
  'chilli', 'garlic', 'ginger', 'jaggery'
];

// Common units and their variations
const UNIT_MAPPINGS: { [key: string]: string } = {
  'tsp': 'tsp',
  'teaspoon': 'tsp',
  'tbsp': 'tbsp',
  'tablespoon': 'tbsp',
  'cup': 'cup',
  'cups': 'cup',
  'handful': 'handful',
  'pinch': 'pinch',
  'sprig': 'sprig',
  'clove': 'clove',
  'cloves': 'clove',
  'inch': 'inch',
  'grams': 'g',
  'gram': 'g',
  'kg': 'kg',
  'ml': 'ml',
  'litre': 'l',
  'liter': 'l'
};

export function parseIngredient(ingredientText: string): ParsedIngredient {
  // Remove leading/trailing whitespace and convert to lowercase for parsing
  const text = ingredientText.trim();
  const lowerText = text.toLowerCase();
  
  // Handle special cases first
  if (lowerText.includes('salt needed') || lowerText.includes('salt as needed') || 
      lowerText.includes('salt to taste')) {
    return {
      amount: null,
      unit: '',
      name: 'Salt',
      originalText: text
    };
  }
  
  if (lowerText.includes('few') || lowerText.includes('little')) {
    const name = text.replace(/few|little/gi, '').trim();
    return {
      amount: null,
      unit: 'few',
      name: name || text,
      originalText: text
    };
  }
  
  if (lowerText.includes('pinch')) {
    const name = text.replace(/pinch of|pinch|a pinch/gi, '').trim();
    return {
      amount: 1,
      unit: 'pinch',
      name: name || text,
      originalText: text
    };
  }
  
  // Try to extract number, unit, and ingredient name
  // Patterns like "1 tsp", "2-3", "1/2 cup", "3/4 tsp"
  const patterns = [
    /^(\d+(?:[-\/]\d+)?(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.+)$/,
    /^(\d+(?:[-\/]\d+)?(?:\.\d+)?)\s+(.+)$/,
    /^(.+?)\s*[-–]\s*(\d+(?:[-\/]\d+)?(?:\.\d+)?)\s*([a-zA-Z]+)?\s*(.*)$/
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let amount = match[1];
      let unit = match[2] || '';
      let name = match[3] || match[match.length - 1];
      
      // Handle fractions and ranges
      let numericAmount: number | null = null;
      if (amount.includes('/')) {
        const parts = amount.split('/');
        numericAmount = parseFloat(parts[0]) / parseFloat(parts[1]);
      } else if (amount.includes('-')) {
        const parts = amount.split('-');
        numericAmount = (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
      } else {
        numericAmount = parseFloat(amount);
      }
      
      // Normalize unit
      const normalizedUnit = UNIT_MAPPINGS[unit.toLowerCase()] || unit;
      
      return {
        amount: isNaN(numericAmount) ? null : numericAmount,
        unit: normalizedUnit,
        name: name.trim(),
        originalText: text
      };
    }
  }
  
  // If no pattern matches, return the whole text as ingredient name
  return {
    amount: null,
    unit: '',
    name: text,
    originalText: text
  };
}

export function isSpice(ingredientName: string): boolean {
  const lowerName = ingredientName.toLowerCase();
  return SPICES.some(spice => lowerName.includes(spice));
}

export function scaleIngredient(ingredient: ParsedIngredient, people: number): ScaledIngredient {
  if (ingredient.amount === null) {
    return {
      name: ingredient.name,
      amount: null,
      unit: ingredient.unit,
      formattedAmount: ingredient.unit === 'few' ? `${people > 2 ? 'generous handful' : 'few'}` : 'as needed'
    };
  }
  
  let scaleFactor: number;
  if (isSpice(ingredient.name)) {
    // Spice scaling: 1 + 0.6 × (people - 1)
    scaleFactor = 1 + 0.6 * (people - 1);
  } else {
    // Regular ingredient scaling: multiply by people
    scaleFactor = people;
  }
  
  const scaledAmount = ingredient.amount * scaleFactor;
  
  // Round to reasonable decimal places
  const roundedAmount = Math.round(scaledAmount * 100) / 100;
  
  return {
    name: ingredient.name,
    amount: roundedAmount,
    unit: ingredient.unit,
    formattedAmount: formatAmount(roundedAmount, ingredient.unit)
  };
}

function formatAmount(amount: number, unit: string): string {
  // Handle fractions for common cooking measurements
  if (unit === 'tsp' || unit === 'tbsp' || unit === 'cup') {
    if (Math.abs(amount - 0.25) < 0.01) return '1/4';
    if (Math.abs(amount - 0.33) < 0.02) return '1/3';
    if (Math.abs(amount - 0.5) < 0.01) return '1/2';
    if (Math.abs(amount - 0.67) < 0.02) return '2/3';
    if (Math.abs(amount - 0.75) < 0.01) return '3/4';
  }
  
  // Round to 2 decimal places for display
  return amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
}

export function scaleCookingTime(originalTime: number, people: number): number {
  // Cooking time scaling: 1 + 0.15 × (people - 1)
  const scaleFactor = 1 + 0.15 * (people - 1);
  const scaledTime = originalTime * scaleFactor;
  return Math.round(scaledTime);
}
