
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { recipes } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSplash, setShowSplash] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Traditional food images
  const foodImages = [
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8c8a?w=400&h=300&fit=crop", // Pongal
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", // Rasam
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop", // Idli
    "https://images.unsplash.com/photo-1630409346460-b5ce8ac1e946?w=400&h=300&fit=crop", // Dosa
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop"  // Sambar
  ];

  useEffect(() => {
    // Check if this is the first time opening the app in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (!hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem('hasSeenSplash', 'true');
      
      // Auto-rotate images during splash screen
      const imageInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % foodImages.length);
      }, 800);

      // Hide splash screen after 4 seconds
      const splashTimer = setTimeout(() => {
        setShowSplash(false);
      }, 4000);

      return () => {
        clearInterval(imageInterval);
        clearTimeout(splashTimer);
      };
    }
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tamilName.includes(searchTerm) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center space-y-8 animate-in fade-in-50 duration-1000">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text animate-in slide-in-from-top-5 duration-1000">
              🍲 Recipe
            </h1>
            <p className="text-2xl text-gray-600 font-medium animate-in slide-in-from-bottom-5 duration-1000 delay-500" style={{ fontFamily: 'serif' }}>
              சமையல் குறிப்புகள்
            </p>
          </div>
          
          <div className="w-64 h-48 mx-auto rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-50 duration-1000 delay-1000">
            <img
              src={foodImages[currentImageIndex]}
              alt="Traditional Food"
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop";
              }}
            />
          </div>
          
          <div className="flex justify-center space-x-2 animate-in fade-in-50 duration-1000 delay-2000">
            {foodImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 animate-in fade-in-50 duration-700">
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
            filteredRecipes.map((recipe, index) => (
              <div key={recipe.id} className="animate-in slide-in-from-bottom-5 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <RecipeCard
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe.id)}
                />
              </div>
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

export default HomePage;
