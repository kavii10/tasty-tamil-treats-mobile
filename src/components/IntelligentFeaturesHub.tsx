import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Utensils, 
  Calculator, 
  Cloud, 
  Calendar, 
  ChefHat,
  RefreshCw,
  X,
  Sparkles
} from 'lucide-react';
import { PantryMatcher } from '@/services/pantryMatcher';
import { NutritionCalculator } from '@/services/nutritionCalculator';
import { WeatherSuggestions } from '@/services/weatherSuggestions';
import { IngredientSubstitutionService } from '@/services/ingredientSubstitution';
import { PantryItem, RecipeMatch, NutritionInfo, WeatherBasedSuggestion } from '@/types/PantryTypes';

interface IntelligentFeaturesHubProps {
  recipeIngredients: string[];
  recipeName: string;
}

// Feature Logo Components
const PantryLogo = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
  >
    <Utensils className="w-6 h-6 text-white" />
  </button>
);

const NutritionLogo = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
  >
    <Calculator className="w-6 h-6 text-white" />
  </button>
);

const WeatherLogo = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
  >
    <Cloud className="w-6 h-6 text-white" />
  </button>
);

const PlannerLogo = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
  >
    <Calendar className="w-6 h-6 text-white" />
  </button>
);

const DietLogo = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
  >
    <ChefHat className="w-6 h-6 text-white" />
  </button>
);

const SubstituteLogo = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
  >
    <RefreshCw className="w-6 h-6 text-white" />
  </button>
);

const IntelligentFeaturesHub: React.FC<IntelligentFeaturesHubProps> = ({ 
  recipeIngredients, 
  recipeName 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [featureResults, setFeatureResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pantryMatcher = new PantryMatcher();
  const nutritionCalculator = new NutritionCalculator();
  const weatherSuggestions = new WeatherSuggestions();
  const ingredientSubstitution = new IngredientSubstitutionService();

  const handleFeatureClick = async (featureType: string) => {
    setActiveFeature(featureType);
    setIsLoading(true);
    
    try {
      switch (featureType) {
        case 'pantry':
          // Convert ingredients to pantry items for matching
          const pantryItems = recipeIngredients.map((ingredient, index) => ({
            id: `ingredient-${index}`,
            name: ingredient,
            category: 'recipe'
          }));
          const matches = pantryMatcher.findMatchingRecipes(pantryItems);
          setFeatureResults({ type: 'pantry', data: matches });
          break;
          
        case 'nutrition':
          const nutrition = await nutritionCalculator.calculateRecipeNutrition(recipeIngredients, 1);
          setFeatureResults({ type: 'nutrition', data: nutrition });
          break;
          
        case 'weather':
          const weather = await weatherSuggestions.getCurrentWeather();
          if (weather) {
            const weatherRecipes = weatherSuggestions.getWeatherBasedRecipes(weather);
            setFeatureResults({ type: 'weather', data: { weather, recipes: weatherRecipes } });
          }
          break;
          
        case 'substitute':
          // Set some example preferences for demonstration
          ingredientSubstitution.setUserPreferences(['dairy'], ['vegan'], []);
          const substitutionResult = ingredientSubstitution.processIngredients(recipeIngredients);
          setFeatureResults({ type: 'substitute', data: substitutionResult.substitutions });
          break;
          
        default:
          setFeatureResults({ type: featureType, data: `${featureType} feature coming soon!` });
      }
    } catch (error) {
      console.error(`Error with ${featureType} feature:`, error);
      setFeatureResults({ type: featureType, data: `Error loading ${featureType} feature` });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFeatureResults = () => {
    if (!featureResults) return null;

    const { type, data } = featureResults;

    switch (type) {
      case 'pantry':
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-green-700">Similar Recipes Found:</h4>
            {data.slice(0, 3).map((match: RecipeMatch, index: number) => (
              <div key={index} className="p-2 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{match.recipe.name}</span>
                  <Badge className="bg-green-500">{match.matchPercentage}% match</Badge>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'nutrition':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-orange-700">Nutrition Facts:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-orange-100 p-2 rounded-lg text-center">
                <div className="text-lg font-bold text-orange-700">{data.calories}</div>
                <div className="text-xs text-orange-600">Calories</div>
              </div>
              <div className="bg-red-100 p-2 rounded-lg text-center">
                <div className="text-lg font-bold text-red-700">{data.protein}g</div>
                <div className="text-xs text-red-600">Protein</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg text-center">
                <div className="text-lg font-bold text-yellow-700">{data.fat}g</div>
                <div className="text-xs text-yellow-600">Fat</div>
              </div>
              <div className="bg-green-100 p-2 rounded-lg text-center">
                <div className="text-lg font-bold text-green-700">{data.carbs}g</div>
                <div className="text-xs text-green-600">Carbs</div>
              </div>
            </div>
          </div>
        );
        
      case 'weather':
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-700">Weather-Based Suggestions:</h4>
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-sm font-medium">{data.weather.weather} - {Math.round(data.weather.temperature)}°C</div>
              <div className="text-xs text-blue-600 mt-1">
                Perfect weather for {data.recipes.slice(0, 2).map((r: any) => r.name).join(', ')}
              </div>
            </div>
          </div>
        );
        
      case 'substitute':
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-700">Ingredient Substitutions:</h4>
            {data.length > 0 ? (
              data.map((sub: any, index: number) => (
                <div key={index} className="p-2 bg-yellow-50 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">{sub.original}</span> → <span className="text-yellow-700 font-medium">{sub.substitute}</span>
                  </div>
                  <div className="text-xs text-yellow-600 capitalize">Reason: {sub.reason}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600">No substitutions needed for current preferences</div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="text-gray-600 text-sm">
            {typeof data === 'string' ? data : 'Feature results available'}
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Main AI Hub Trigger */}
      <div className="flex items-center justify-center mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            AI Features
          </div>
        </button>
      </div>

      {/* Expanded Feature Selection */}
      {isExpanded && (
        <Card className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 w-80 border-2 border-purple-200 shadow-2xl animate-in fade-in-50 slide-in-from-top-4 duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Recipe Features
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsExpanded(false);
                  setActiveFeature(null);
                  setFeatureResults(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {!activeFeature ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">Choose an AI feature to enhance your recipe:</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <PantryLogo onClick={() => handleFeatureClick('pantry')} />
                    <span className="text-xs font-medium text-center">Pantry Match</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <NutritionLogo onClick={() => handleFeatureClick('nutrition')} />
                    <span className="text-xs font-medium text-center">Nutrition</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <WeatherLogo onClick={() => handleFeatureClick('weather')} />
                    <span className="text-xs font-medium text-center">Weather</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <PlannerLogo onClick={() => handleFeatureClick('planner')} />
                    <span className="text-xs font-medium text-center">Planner</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <DietLogo onClick={() => handleFeatureClick('diet')} />
                    <span className="text-xs font-medium text-center">Diet</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <SubstituteLogo onClick={() => handleFeatureClick('substitute')} />
                    <span className="text-xs font-medium text-center">Substitute</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setActiveFeature(null);
                      setFeatureResults(null);
                    }}
                  >
                    ← Back
                  </Button>
                  <h4 className="font-semibold capitalize">{activeFeature} Feature</h4>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto">
                    {renderFeatureResults()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntelligentFeaturesHub;
