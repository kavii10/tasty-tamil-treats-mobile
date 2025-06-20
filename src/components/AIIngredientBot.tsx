
import React, { useState } from 'react';
import { Recipe } from '@/types/Recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Users, Sparkles } from 'lucide-react';
import { parseIngredient, scaleIngredient, scaleCookingTime } from '@/utils/ingredientParser';

interface AIIngredientBotProps {
  recipe: Recipe;
  onAdjust: (adjustedIngredients: any[], adjustedTime: number, servings: number) => void;
}

const AIIngredientBot: React.FC<AIIngredientBotProps> = ({ recipe, onAdjust }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [servings, setServings] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAdjust = async () => {
    if (servings <= 0) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const parsedIngredients = recipe.ingredients_en.map(parseIngredient);
    const scaledIngredients = parsedIngredients.map(ingredient => 
      scaleIngredient(ingredient, servings)
    );
    const adjustedCookingTime = scaleCookingTime(recipe.cookingTime, servings);

    onAdjust(scaledIngredients, adjustedCookingTime, servings);
    setIsProcessing(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200 hover:from-purple-200 hover:to-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Bot className="w-4 h-4 mr-2 text-purple-600" />
          <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Ingredient Optimiser AI</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🧠 Ingredient Optimiser AI
          </DialogTitle>
          <p className="text-gray-600 mt-2">How many servings do you want to prepare?</p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                className="text-center text-lg font-semibold border-2 border-blue-200 focus:border-blue-400"
                placeholder="1"
              />
            </div>
          </div>
          
          <Button
            onClick={handleAdjust}
            disabled={isProcessing || servings <= 0}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-300"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI is optimizing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Optimize Ingredients</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIIngredientBot;
