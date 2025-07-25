import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Cloud, 
  Calculator, 
  Calendar, 
  Utensils, 
  RefreshCw,
  ChefHat,
  Thermometer
} from 'lucide-react';
import { PantryMatcher } from '@/services/pantryMatcher';
import { NutritionCalculator } from '@/services/nutritionCalculator';
import { WeatherSuggestions } from '@/services/weatherSuggestions';
import { IngredientSubstitutionService } from '@/services/ingredientSubstitution';
import { PantryItem, RecipeMatch, NutritionInfo, WeatherBasedSuggestion } from '@/types/PantryTypes';

// Feature Logo Components
const PantryLogo = () => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
    <Utensils className="w-6 h-6 text-white" />
  </div>
);

const NutritionLogo = () => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
    <Calculator className="w-6 h-6 text-white" />
  </div>
);

const WeatherLogo = () => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg">
    <Cloud className="w-6 h-6 text-white" />
  </div>
);

const PlannerLogo = () => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shadow-lg">
    <Calendar className="w-6 h-6 text-white" />
  </div>
);

const DietLogo = () => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center shadow-lg">
    <ChefHat className="w-6 h-6 text-white" />
  </div>
);

const SubstituteLogo = () => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg">
    <RefreshCw className="w-6 h-6 text-white" />
  </div>
);

const IntelligentFeatures = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [pantryInput, setPantryInput] = useState('');
  const [recipeMatches, setRecipeMatches] = useState<RecipeMatch[]>([]);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);
  const [weatherSuggestion, setWeatherSuggestion] = useState<WeatherBasedSuggestion | null>(null);
  const [weatherRecipes, setWeatherRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pantryMatcher = new PantryMatcher();
  const nutritionCalculator = new NutritionCalculator();
  const weatherSuggestions = new WeatherSuggestions();
  const ingredientSubstitution = new IngredientSubstitutionService();

  const addPantryItems = () => {
    if (!pantryInput.trim()) return;
    
    const items = pantryInput.split(',').map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      name: item.trim(),
      category: 'general'
    }));
    
    setPantryItems(prev => [...prev, ...items]);
    setPantryInput('');
    
    // Auto-search for recipes
    const allItems = [...pantryItems, ...items];
    const matches = pantryMatcher.findMatchingRecipes(allItems);
    setRecipeMatches(matches);
  };

  const calculateNutrition = async (ingredients: string[]) => {
    setIsLoading(true);
    try {
      const nutrition = await nutritionCalculator.calculateRecipeNutrition(ingredients, 1);
      setNutritionInfo(nutrition);
    } catch (error) {
      console.error('Nutrition calculation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWeatherSuggestions = async () => {
    setIsLoading(true);
    try {
      const weather = await weatherSuggestions.getCurrentWeather();
      if (weather) {
        setWeatherSuggestion(weather);
        const recipes = weatherSuggestions.getWeatherBasedRecipes(weather);
        setWeatherRecipes(recipes);
      }
    } catch (error) {
      console.error('Weather suggestions failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧠 Intelligent Recipe Features
          </h1>
          <p className="text-gray-600">AI-powered cooking assistance without the complexity</p>
        </div>

        {/* Feature Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <PantryLogo />
            <span className="text-xs font-medium text-gray-700 text-center">Pantry Match</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <NutritionLogo />
            <span className="text-xs font-medium text-gray-700 text-center">Nutrition</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <WeatherLogo />
            <span className="text-xs font-medium text-gray-700 text-center">Weather</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <PlannerLogo />
            <span className="text-xs font-medium text-gray-700 text-center">Planner</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <DietLogo />
            <span className="text-xs font-medium text-gray-700 text-center">Diet</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <SubstituteLogo />
            <span className="text-xs font-medium text-gray-700 text-center">Substitute</span>
          </div>
        </div>

        <Tabs defaultValue="pantry" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="pantry" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <Utensils className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:inline">Pantry</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <Calculator className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:inline">Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center">
                <Cloud className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center">
                <ChefHat className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger value="substitute" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                <RefreshCw className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:inline">Substitute</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pantry" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <PantryLogo />
                  <div>
                    <div>Pantry-Based Recipe Generator</div>
                    <div className="text-sm text-gray-500 font-normal">Find recipes from your ingredients</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter ingredients (comma-separated)"
                    value={pantryInput}
                    onChange={(e) => setPantryInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => e.key === 'Enter' && addPantryItems()}
                  />
                  <Button onClick={addPantryItems} className="bg-green-600 hover:bg-green-700">
                    Add Items
                  </Button>
                </div>
                
                {pantryItems.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Your Pantry Items:</h3>
                    <div className="flex flex-wrap gap-2">
                      {pantryItems.map(item => (
                        <Badge key={item.id} variant="secondary" className="bg-green-100 text-green-800">
                          {item.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {recipeMatches.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Recipe Matches:</h3>
                    {recipeMatches.map((match, index) => (
                      <Card key={index} className="border-green-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{match.recipe.name}</h4>
                            <Badge className="bg-green-500">
                              {match.matchPercentage}% match
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{match.recipe.tamilName}</p>
                          
                          {match.missingIngredients.length > 0 && (
                            <div className="text-sm">
                              <span className="text-red-600 font-medium">Missing: </span>
                              <span className="text-red-600">
                                {match.missingIngredients.slice(0, 3).join(', ')}
                                {match.missingIngredients.length > 3 && ` +${match.missingIngredients.length - 3} more`}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <NutritionLogo />
                  <div>
                    <div>Nutrition & Calorie Estimator</div>
                    <div className="text-sm text-gray-500 font-normal">Calculate recipe nutrition facts</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => calculateNutrition(['1 cup rice', '2 tbsp oil', '1 tsp salt'])}
                  disabled={isLoading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isLoading ? 'Calculating...' : 'Calculate Sample Recipe Nutrition'}
                </Button>
                
                {nutritionInfo && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-orange-100 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-700">{nutritionInfo.calories}</div>
                      <div className="text-sm text-orange-600">Calories</div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-700">{nutritionInfo.protein}g</div>
                      <div className="text-sm text-red-600">Protein</div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-700">{nutritionInfo.fat}g</div>
                      <div className="text-sm text-yellow-600">Fat</div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-700">{nutritionInfo.carbs}g</div>
                      <div className="text-sm text-green-600">Carbs</div>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-700">{nutritionInfo.sodium}mg</div>
                      <div className="text-sm text-purple-600">Sodium</div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-700">{nutritionInfo.fiber || 0}g</div>
                      <div className="text-sm text-blue-600">Fiber</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weather" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <WeatherLogo />
                  <div>
                    <div>Weather-Based Food Suggestions</div>
                    <div className="text-sm text-gray-500 font-normal">Recipes perfect for today's weather</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-blue-500" />
                    {weatherSuggestion ? (
                      <div>
                        <div className="font-medium">{weatherSuggestion.weather}</div>
                        <div className="text-sm text-gray-600">
                          {Math.round(weatherSuggestion.temperature)}°C - {weatherSuggestion.condition}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">Loading weather...</div>
                    )}
                  </div>
                  <Button 
                    onClick={loadWeatherSuggestions} 
                    variant="outline" 
                    size="sm"
                    disabled={isLoading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {weatherRecipes.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weatherRecipes.slice(0, 4).map((recipe, index) => (
                      <Card key={index} className="border-blue-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-800">{recipe.name}</h4>
                          <p className="text-sm text-gray-600">{recipe.tamilName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {recipe.cookingTime} min
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {recipe.foodType}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planner">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <PlannerLogo />
                  <div>
                    <div>Meal Planner AI (Coming Soon)</div>
                    <div className="text-sm text-gray-500 font-normal">7-day automated meal planning</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Weekly meal planning feature will be available soon. This will generate 
                  7-day meal plans based on your dietary goals and preferences.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <DietLogo />
                  <div>
                    <div>Smart Diet Rewriter (Coming Soon)</div>
                    <div className="text-sm text-gray-500 font-normal">Adapt recipes for special diets</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent diet-specific recipe modifications will be available soon. 
                  This will automatically adapt recipes for vegan, keto, gluten-free, and other diets.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="substitute">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <SubstituteLogo />
                  <div>
                    <div>Dynamic Ingredient Swapper (Coming Soon)</div>
                    <div className="text-sm text-gray-500 font-normal">Smart ingredient substitutions</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent ingredient substitution based on allergies and availability 
                  will be available soon. This will suggest alternatives and update recipes automatically.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntelligentFeatures;
