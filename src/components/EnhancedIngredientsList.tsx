
import React from 'react';
import { ScaledIngredient } from '@/utils/ingredientParser';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, Sparkles, ArrowDown } from 'lucide-react';

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

  const renderCategory = (title: string, items: ScaledIngredient[], bgColor: string, textColor: string, icon: string) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4 animate-in fade-in-50 slide-in-from-left-5 duration-500">
        <div className={`${bgColor} px-3 py-2 rounded-lg mb-3 flex items-center space-x-2`}>
          <span className="text-lg">{icon}</span>
          <h4 className={`font-semibold ${textColor}`}>{title}</h4>
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
    <Card className="border-green-100 shadow-lg animate-in fade-in-50 slide-in-from-bottom-5 duration-700 relative overflow-hidden">
      {/* Transition indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 animate-pulse"></div>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-full mr-3 animate-in scale-in duration-500">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AI Optimized Ingredients
              </h3>
              <ArrowDown className="w-4 h-4 text-green-600 animate-bounce" />
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <div className="text-sm text-gray-600 flex items-center animate-in fade-in-50 duration-700 delay-300">
                <Users className="w-4 h-4 mr-1" />
                For {servings} {servings === 1 ? 'person' : 'people'}
              </div>
              <div className="flex items-center text-amber-600 animate-in fade-in-50 duration-700 delay-500">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-semibold">{adjustedTime} min</span>
                {adjustedTime !== originalTime && (
                  <span className="text-xs text-gray-500 ml-1 animate-in fade-in-50 duration-500 delay-700">
                    (was {originalTime} min)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transformation indicator */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 animate-in fade-in-50 slide-in-from-top-2 duration-700 delay-200">
          <div className="flex items-center space-x-2 text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Ingredients automatically adjusted by AI</span>
          </div>
        </div>

        {/* Main Ingredients */}
        {categories.main.length > 0 && (
          <div className="mb-4 animate-in fade-in-50 slide-in-from-left-5 duration-700 delay-300">
            <ul className="space-y-2">
              {categories.main.map((ingredient, index) => (
                <li key={index} className="flex items-start animate-in fade-in-50 slide-in-from-left-5 duration-700" style={{ animationDelay: `${400 + (index * 100)}ms` }}>
                  <span className="text-green-600 mr-2 mt-1 animate-pulse">•</span>
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

        {/* Categorized Sections with unique colors and staggered animations */}
        <div className="animate-in fade-in-50 duration-700 delay-500">
          {renderCategory("🔹 For Grinding", categories.grinding, "bg-gradient-to-r from-orange-100 to-amber-100", "text-orange-800", "⚙️")}
        </div>
        <div className="animate-in fade-in-50 duration-700 delay-700">
          {renderCategory("🟢 For Seasoning", categories.seasoning, "bg-gradient-to-r from-emerald-100 to-teal-100", "text-emerald-800", "🌿")}
        </div>
        <div className="animate-in fade-in-50 duration-700 delay-900">
          {renderCategory("🟣 For Garnish", categories.garnish, "bg-gradient-to-r from-purple-100 to-pink-100", "text-purple-800", "🌸")}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedIngredientsList;
