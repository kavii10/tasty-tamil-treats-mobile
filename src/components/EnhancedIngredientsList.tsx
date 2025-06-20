
import React from 'react';
import { ScaledIngredient } from '@/utils/ingredientParser';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, Sparkles } from 'lucide-react';

interface EnhancedIngredientsListProps {
  ingredients: ScaledIngredient[];
  servings: number;
  adjustedTime: number;
  originalTime: number;
}

const EnhancedIngredientsList: React.FC<EnhancedIngredientsListProps> = ({
  ingredients,
  servings,
  adjustedTime,
  originalTime
}) => {
  // Categorize ingredients based on their names
  const categorizeIngredients = (ingredients: ScaledIngredient[]) => {
    const categories = {
      grinding: [] as ScaledIngredient[],
      seasoning: [] as ScaledIngredient[],
      garnish: [] as ScaledIngredient[],
      main: [] as ScaledIngredient[]
    };

    ingredients.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
      if (name.includes('grind') || name.includes('powder') || name.includes('paste')) {
        categories.grinding.push(ingredient);
      } else if (name.includes('season') || name.includes('mustard') || name.includes('tempering')) {
        categories.seasoning.push(ingredient);
      } else if (name.includes('garnish') || name.includes('coriander') || name.includes('cilantro')) {
        categories.garnish.push(ingredient);
      } else {
        categories.main.push(ingredient);
      }
    });

    return categories;
  };

  const categories = categorizeIngredients(ingredients);

  const renderCategory = (title: string, items: ScaledIngredient[], bgColor: string, icon: string) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4 animate-in fade-in-50 slide-in-from-left-5 duration-500">
        <div className={`${bgColor} px-3 py-2 rounded-lg mb-3 flex items-center space-x-2`}>
          <span className="text-lg">{icon}</span>
          <h4 className="font-semibold text-gray-800">{title}</h4>
        </div>
        <ul className="space-y-2 ml-4">
          {items.map((ingredient, index) => (
            <li key={index} className="flex items-start animate-in fade-in-50 slide-in-from-left-5 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
              <span className="text-green-600 mr-2 mt-1">•</span>
              <span className="text-gray-700">
                {ingredient.formattedAmount && (
                  <span className="font-medium text-green-700">
                    {ingredient.formattedAmount}
                    {ingredient.unit && ` ${ingredient.unit}`}
                  </span>
                )}
                {ingredient.formattedAmount && ' '}
                {ingredient.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Card className="border-green-100 shadow-lg animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-full mr-3">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AI Optimized Ingredients
            </h3>
            <div className="flex items-center space-x-4 mt-1">
              <div className="text-sm text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                For {servings} {servings === 1 ? 'person' : 'people'}
              </div>
              <div className="flex items-center text-amber-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-semibold">{adjustedTime} min</span>
                {adjustedTime !== originalTime && (
                  <span className="text-xs text-gray-500 ml-1">
                    (was {originalTime} min)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Ingredients */}
        {categories.main.length > 0 && (
          <div className="mb-4 animate-in fade-in-50 slide-in-from-left-5 duration-500">
            <ul className="space-y-2">
              {categories.main.map((ingredient, index) => (
                <li key={index} className="flex items-start animate-in fade-in-50 slide-in-from-left-5 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700">
                    {ingredient.formattedAmount && (
                      <span className="font-medium text-green-700">
                        {ingredient.formattedAmount}
                        {ingredient.unit && ` ${ingredient.unit}`}
                      </span>
                    )}
                    {ingredient.formattedAmount && ' '}
                    {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Categorized Sections */}
        {renderCategory("🔹 For Grinding", categories.grinding, "bg-blue-100", "⚙️")}
        {renderCategory("🟢 For Seasoning", categories.seasoning, "bg-green-100", "🌿")}
        {renderCategory("🟣 For Garnish", categories.garnish, "bg-purple-100", "🌸")}
      </CardContent>
    </Card>
  );
};

export default EnhancedIngredientsList;
