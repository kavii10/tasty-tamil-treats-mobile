
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipes } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tamilName.includes(searchTerm) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Recipe Collection
            </h1>
            <p className="text-gray-600 text-sm">சமையல் குறிப்புகள்</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-300 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Recipe List */}
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-3">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.id)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recipes found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 py-4">
          <p className="text-gray-500 text-sm">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
