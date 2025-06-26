
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Wand2, AlertCircle } from 'lucide-react';
import { TogetherAIService } from '@/services/togetherAI';
import { ScaledIngredient } from '@/utils/ingredientParser';
import { toast } from 'sonner';

interface AIStepsRewriterProps {
  recipeName: string;
  originalSteps: string[];
  adjustedIngredients: ScaledIngredient[];
  servings: number;
  onStepsRewritten: (newSteps: string[]) => void;
}

const AIStepsRewriter: React.FC<AIStepsRewriterProps> = ({
  recipeName,
  originalSteps,
  adjustedIngredients,
  servings,
  onStepsRewritten
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRewriteSteps = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your Together AI API key');
      return;
    }

    setIsProcessing(true);
    toast.info('AI is rewriting preparation steps...');

    try {
      const togetherAI = new TogetherAIService(apiKey.trim());
      const rewrittenSteps = await togetherAI.rewriteRecipeSteps(
        recipeName,
        originalSteps,
        adjustedIngredients,
        servings
      );

      onStepsRewritten(rewrittenSteps);
      toast.success('Preparation steps updated for your serving size!');
      setIsOpen(false);
    } catch (error) {
      console.error('Error rewriting steps:', error);
      toast.error('Failed to rewrite steps. Please check your API key and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200 hover:from-amber-200 hover:to-orange-200 transition-all duration-300"
        >
          <Wand2 className="w-4 h-4 mr-2 text-amber-600" />
          <Sparkles className="w-3 h-3 mr-1 text-orange-600" />
          <span className="text-sm font-medium text-gray-700">AI Steps Rewriter</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            🪄 AI Steps Rewriter
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Rewrite preparation steps for {servings} serving{servings > 1 ? 's' : ''}
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
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
          
          <Button
            onClick={handleRewriteSteps}
            disabled={isProcessing || !apiKey.trim()}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI is rewriting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Rewrite Steps</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIStepsRewriter;
