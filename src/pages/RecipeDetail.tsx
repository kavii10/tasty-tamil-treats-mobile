
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { recipes } from "@/data/recipes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import AIIngredientBot from "@/components/AIIngredientBot";
import EnhancedIngredientsList from "@/components/EnhancedIngredientsList";
import { ScaledIngredient } from "@/utils/ingredientParser";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adjustedIngredients, setAdjustedIngredients] = useState<ScaledIngredient[]>([]);
  const [adjustedTime, setAdjustedTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(0);
  const [showAdjusted, setShowAdjusted] = useState(false);
  const [rewrittenSteps, setRewrittenSteps] = useState<string[]>([]);
  const [showRewrittenSteps, setShowRewrittenSteps] = useState(false);
  
  const recipe = recipes.find(r => r.id === id);
  
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  const handleAdjustRecipe = (ingredients: ScaledIngredient[], time: number, servingCount: number, rewrittenSteps?: string[]) => {
    setAdjustedIngredients(ingredients);
    setAdjustedTime(time);
    setServings(servingCount);
    setShowAdjusted(true);
    
    if (rewrittenSteps) {
      setRewrittenSteps(rewrittenSteps);
      setShowRewrittenSteps(true);
    } else {
      setShowRewrittenSteps(false);
    }
    
    // Smooth scroll to ingredients section
    setTimeout(() => {
      const ingredientsSection = document.getElementById('ingredients-section');
      if (ingredientsSection) {
        ingredientsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const currentSteps = showRewrittenSteps ? rewrittenSteps : recipe.instructions_en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-green-100 p-4 z-10">
        <div className="flex items-center justify-between">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            size="sm"
            className="text-green-700 hover:text-green-800 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Button>
          
          <AIIngredientBot recipe={recipe} onAdjust={handleAdjustRecipe} />
        </div>
      </div>

      {/* Recipe Image */}
      <div className="h-64 overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop";
          }}
        />
      </div>

      <div className="p-4 space-y-6">
        {/* Recipe Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">{recipe.name}</h1>
          <p className="text-xl text-gray-600 font-medium">{recipe.tamilName}</p>
          
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center text-amber-600">
              <Clock className="w-5 h-5 mr-1" />
              <span className="font-semibold">{showAdjusted ? adjustedTime : recipe.cookingTime} min</span>
              {showAdjusted && adjustedTime !== recipe.cookingTime && (
                <span className="text-xs text-gray-500 ml-1">
                  (was {recipe.cookingTime} min)
                </span>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              recipe.foodType === 'Veg' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {recipe.foodType}
            </div>
            <div className="text-gray-600 text-sm">
              {recipe.category}
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div id="ingredients-section">
          {showAdjusted ? (
            <EnhancedIngredientsList
              ingredients={adjustedIngredients}
              servings={servings}
              adjustedTime={adjustedTime}
              originalTime={recipe.cookingTime}
            />
          ) : (
            <Card className="border-green-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <span className="text-2xl">🥄</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Original Ingredients</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  (For 1 person)
                </p>
                <ul className="space-y-2">
                  {recipe.ingredients_en.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Instructions Section */}
        <div id="instructions-section">
          <Card className="border-yellow-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <ChefHat className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">
                    {showRewrittenSteps ? 'AI-Optimized Preparation' : 'Preparation'}
                  </h2>
                  {showRewrittenSteps && (
                    <p className="text-sm text-amber-600 mt-1">
                      Steps adjusted for {servings} serving{servings > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <ol className="space-y-4">
                {currentSteps.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-yellow-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Video Link (if available) */}
        {recipe.videoUrl && (
          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Video Tutorial</h3>
              <Button 
                onClick={() => window.open(recipe.videoUrl, '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Watch on YouTube
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
