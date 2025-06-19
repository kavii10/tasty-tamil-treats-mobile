
import { Recipe } from "@/types/Recipe";

export const recipes: Recipe[] = [
  {
    id: "1",
    name: "Tomato Rasam",
    tamilName: "தக்காளி ரசம்",
    category: "Rasam",
    foodType: "Veg",
    cookingTime: 25,
    ingredients_en: [
      "2 medium tomatoes, chopped",
      "1/4 cup toor dal (cooked)",
      "1 tsp tamarind paste",
      "1/2 tsp turmeric powder",
      "1 tsp rasam powder",
      "2-3 curry leaves",
      "1 green chili, slit",
      "1/2 tsp mustard seeds",
      "1 tsp ghee",
      "Salt to taste",
      "Fresh coriander for garnish"
    ],
    instructions_en: [
      "Heat ghee in a pan and add mustard seeds",
      "When seeds splutter, add curry leaves and green chili",
      "Add chopped tomatoes and cook until soft",
      "Add turmeric, rasam powder, and salt",
      "Add cooked toor dal and mix well",
      "Add tamarind paste and 1 cup water",
      "Bring to a boil and simmer for 10 minutes",
      "Garnish with fresh coriander and serve hot"
    ],
    imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
    videoUrl: "https://youtube.com/watch?v=example1"
  },
  {
    id: "2",
    name: "Sambar",
    tamilName: "சாம்பார்",
    category: "Curry",
    foodType: "Veg",
    cookingTime: 30,
    ingredients_en: [
      "1/2 cup toor dal",
      "1 small onion, chopped",
      "1 tomato, chopped",
      "1/4 cup drumstick pieces",
      "1/4 cup okra, chopped",
      "1 tsp sambar powder",
      "1/2 tsp turmeric powder",
      "1 tsp tamarind paste",
      "1/2 tsp mustard seeds",
      "Few curry leaves",
      "1 tsp oil",
      "Salt to taste"
    ],
    instructions_en: [
      "Pressure cook toor dal with turmeric until soft",
      "Heat oil in a pan, add mustard seeds and curry leaves",
      "Add onions and sauté until translucent",
      "Add tomatoes and cook until soft",
      "Add vegetables and cook for 5 minutes",
      "Add sambar powder and tamarind paste",
      "Add cooked dal and mix well",
      "Add water as needed and simmer for 15 minutes",
      "Season with salt and serve hot with rice"
    ],
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Chicken Curry",
    tamilName: "கோழி குழம்பு",
    category: "Curry",
    foodType: "Non-veg",
    cookingTime: 45,
    ingredients_en: [
      "250g chicken, cut into pieces",
      "1 large onion, chopped",
      "2 tomatoes, chopped",
      "1 tbsp ginger-garlic paste",
      "1 tsp red chili powder",
      "1/2 tsp turmeric powder",
      "1 tsp coriander powder",
      "1/2 tsp garam masala",
      "2 tbsp coconut oil",
      "Few curry leaves",
      "Salt to taste",
      "Fresh coriander for garnish"
    ],
    instructions_en: [
      "Marinate chicken with turmeric, chili powder, and salt for 15 minutes",
      "Heat oil in a pan, add curry leaves",
      "Add marinated chicken and cook until 70% done",
      "Remove chicken and set aside",
      "In the same pan, add onions and sauté until golden",
      "Add ginger-garlic paste and cook for 1 minute",
      "Add tomatoes and cook until soft",
      "Add all spice powders and mix well",
      "Return chicken to the pan and mix",
      "Add water as needed and simmer for 15 minutes",
      "Garnish with coriander and serve with rice"
    ],
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    name: "Curd Rice",
    tamilName: "தயிர் சாதம்",
    category: "Rice",
    foodType: "Veg",
    cookingTime: 15,
    ingredients_en: [
      "1 cup cooked rice",
      "1/2 cup thick curd/yogurt",
      "1/4 cup milk",
      "1/2 tsp mustard seeds",
      "1 green chili, chopped",
      "1 inch ginger, minced",
      "Few curry leaves",
      "1 tsp oil",
      "Salt to taste",
      "Pomegranate seeds for garnish"
    ],
    instructions_en: [
      "Mash the cooked rice slightly",
      "Mix curd and milk together until smooth",
      "Add the curd mixture to rice and mix well",
      "Heat oil in a small pan",
      "Add mustard seeds and let them splutter",
      "Add green chili, ginger, and curry leaves",
      "Pour this tempering over the curd rice",
      "Mix well and add salt to taste",
      "Garnish with pomegranate seeds and serve chilled"
    ],
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"
  }
];
