
import { Recipe } from "@/types/Recipe";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border-green-100 hover:border-green-200"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex h-24">
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop";
              }}
            />
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                {recipe.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {recipe.tamilName}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                recipe.foodType === 'Veg' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {recipe.foodType}
              </span>
              <div className="flex items-center text-amber-600 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {recipe.cookingTime} min
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
