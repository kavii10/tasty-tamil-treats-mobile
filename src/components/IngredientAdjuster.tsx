
import React, { useState, useMemo } from 'react';
import { Recipe } from '@/types/Recipe';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Clock, ChefHat } from 'lucide-react';
import { parseIngredient, scaleIngredient, scaleCookingTime, ScaledIngredient } from '@/utils/ingredientParser';

interface IngredientAdjusterProps {
  recipe: Recipe;
}

const IngredientAdjuster: React.FC<IngredientAdjusterProps> = ({ recipe }) => {
  const [people, setPeople] = useState<number>(1);

  const adjustedData = useMemo(() => {
    if (people <= 0) return null;

    const parsedIngredients = recipe.ingredients_en.map(parseIngredient);
    const scaledIngredients = parsedIngredients.map(ingredient => 
      scaleIngredient(ingredient, people)
    );
    const adjustedCookingTime = scaleCookingTime(recipe.cookingTime, people);

    return {
      ingredients: scaledIngredients,
      cookingTime: adjustedCookingTime
    };
  }, [recipe, people]);

  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setPeople(value);
    } else if (e.target.value === '') {
      setPeople(1);
    }
  };

  return (
    <div className="space-y-4">
      {/* People Input */}
      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <label htmlFor="people-input" className="block text-sm font-medium text-gray-700 mb-1">
                How many people?
              </label>
              <Input
                id="people-input"
                type="number"
                min="1"
                max="20"
                value={people}
                onChange={handlePeopleChange}
                className="w-20"
                placeholder="1"
              />
            </div>
            {people > 1 && adjustedData && (
              <div className="text-right">
                <div className="flex items-center text-amber-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{adjustedData.cookingTime} min</span>
                </div>
                <div className="text-xs text-gray-500">
                  (was {recipe.cookingTime} min)
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Adjusted Ingredients */}
      {people > 1 && adjustedData && (
        <Card className="border-green-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <span className="text-2xl">🥄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Adjusted Ingredients
              </h3>
              <div className="ml-auto text-sm text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                (For {people} {people === 1 ? 'person' : 'people'})
              </div>
            </div>
            <ul className="space-y-2">
              {adjustedData.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IngredientAdjuster;
