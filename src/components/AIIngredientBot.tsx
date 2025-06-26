
import React, { useState } from 'react';
import { Recipe } from '@/types/Recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Users, Sparkles, AlertCircle } from 'lucide-react';
import { parseIngredient, scaleIngredient, scaleCookingTime } from '@/utils/ingredientParser';
import { TogetherAIService } from '@/services/togetherAI';
import { toast } from 'sonner';

interface AIIngredientBotProps {
  recipe: Recipe;
  onAdjust: (adjustedIngredients: any[], adjustedTime: number, servings: number, rewrittenSteps?: string[]) => void;
}

const AIIngredientBot: React.FC<AIIngredientBotProps> = ({ recipe, onAdjust }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [servings, setServings] = useState<number>(1);
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rewriteSteps, setRewriteSteps] = useState(true);

  const handleAdjust = async () => {
    if (servings <= 0) return;
    
    setIsProcessing(true);
    toast.info('AI is optimizing ingredients and preparation steps...');
    
    // Simulate AI processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const parsedIngredients = recipe.ingredients_en.map(parseIngredient);
    const scaledIngredients = parsedIngredients.map(ingredient => 
      scaleIngredient(ingredient, servings)
    );
    const adjustedCookingTime = scaleCookingTime(recipe.cookingTime, servings);

    let rewrittenSteps: string[] | undefined;

    // If user wants steps rewritten and provided API key
    if (rewriteSteps && apiKey.trim()) {
      try {
        const togetherAI = new TogetherAIService(apiKey.trim());
        rewrittenSteps = await togetherAI.rewriteRecipeSteps(
          recipe.name,
          recipe.instructions_en,
          scaledIngredients,
          servings
        );
        toast.success('Ingredients and preparation steps optimized successfully!');
      } catch (error) {
        console.error('Error rewriting steps:', error);
        toast.error('Failed to rewrite steps. Ingredients scaled successfully.');
      }
    } else {
      toast.success('Ingredients optimized successfully!');
    }

    onAdjust(scaledIngredients, adjustedCookingTime, servings, rewrittenSteps);
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
          <span className="text-sm font-medium text-gray-700">Recipe AI Optimizer</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🧠 Recipe AI Optimizer
          </DialogTitle>
          <p className="text-gray-600 mt-2">Optimize ingredients and preparation steps</p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Servings
              </label>
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

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rewrite-steps"
                checked={rewriteSteps}
                onChange={(e) => setRewriteSteps(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="rewrite-steps" className="text-sm font-medium text-gray-700">
                Also rewrite preparation steps (requires API key)
              </label>
            </div>

            {rewriteSteps && (
              <div className="space-y-3 animate-in fade-in-50 slide-in-from-top-2">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Together AI API Key Required</p>
                      <p>Get your free API key from <a href="https://api.together.xyz" target="_blank" rel="noopener noreferrer" className="underline">api.together.xyz</a></p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
                    Together AI API Key
                  </label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Together AI API key"
                    className="border-2 border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleAdjust}
            disabled={isProcessing || servings <= 0 || (rewriteSteps && !apiKey.trim())}
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
                <span>Optimize Recipe</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIIngredientBot;
