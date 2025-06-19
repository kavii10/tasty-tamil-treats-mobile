
export interface Recipe {
  id: string;
  name: string;
  tamilName: string;
  category: string;
  foodType: 'Veg' | 'Non-veg';
  cookingTime: number;
  ingredients_en: string[];
  instructions_en: string[];
  imageUrl: string;
  videoUrl?: string;
}
