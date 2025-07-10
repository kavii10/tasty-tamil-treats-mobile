
import { WeatherBasedSuggestion } from '@/types/PantryTypes';
import { recipes } from '@/data/recipes';

export class WeatherSuggestions {
  private readonly WEATHER_API_KEY = 'YOUR_FREE_API_KEY'; // Users need to get free key from OpenWeatherMap
  private readonly WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

  private weatherToTags: { [key: string]: string[] } = {
    'rain': ['warm', 'soup', 'rasam', 'comfort', 'spicy'],
    'drizzle': ['warm', 'soup', 'rasam', 'comfort'],
    'snow': ['warm', 'hearty', 'comfort', 'spicy'],
    'clear': ['light', 'fresh', 'salad', 'cold'],
    'clouds': ['comfort', 'medium'],
    'thunderstorm': ['warm', 'comfort', 'rasam', 'soup'],
    'mist': ['warm', 'light'],
    'fog': ['warm', 'comfort']
  };

  private temperatureToTags(temp: number): string[] {
    if (temp > 30) return ['cold', 'light', 'fresh', 'cooling'];
    if (temp > 20) return ['medium', 'balanced'];
    if (temp > 10) return ['warm', 'comfort'];
    return ['hot', 'spicy', 'warming', 'hearty'];
  }

  public async getCurrentWeather(city: string = 'Chennai'): Promise<WeatherBasedSuggestion | null> {
    try {
      const response = await fetch(
        `${this.WEATHER_BASE_URL}/weather?q=${city}&appid=${this.WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        console.warn('Weather API error:', response.status);
        return this.getDefaultSuggestion();
      }
      
      const data = await response.json();
      const condition = data.weather[0].main.toLowerCase();
      const temperature = data.main.temp;
      
      const weatherTags = this.weatherToTags[condition] || ['medium'];
      const tempTags = this.temperatureToTags(temperature);
      const combinedTags = [...new Set([...weatherTags, ...tempTags])];
      
      return {
        weather: data.weather[0].main,
        temperature,
        condition: data.weather[0].description,
        suggestedTags: combinedTags
      };
    } catch (error) {
      console.warn('Failed to fetch weather:', error);
      return this.getDefaultSuggestion();
    }
  }

  private getDefaultSuggestion(): WeatherBasedSuggestion {
    return {
      weather: 'Clear',
      temperature: 25,
      condition: 'pleasant weather',
      suggestedTags: ['medium', 'balanced']
    };
  }

  public getWeatherBasedRecipes(weatherSuggestion: WeatherBasedSuggestion): any[] {
    const { suggestedTags } = weatherSuggestion;
    
    // Filter recipes based on tags (using recipe names and categories as tags)
    const matchingRecipes = recipes.filter(recipe => {
      const recipeTags = [
        recipe.name.toLowerCase(),
        recipe.category.toLowerCase(),
        recipe.tamilName.toLowerCase()
      ].join(' ');
      
      return suggestedTags.some(tag => 
        recipeTags.includes(tag) || 
        (tag === 'rasam' && recipeTags.includes('rasam')) ||
        (tag === 'warm' && recipeTags.includes('rasam')) ||
        (tag === 'comfort' && recipeTags.includes('rasam'))
      );
    });
    
    return matchingRecipes.length > 0 ? matchingRecipes.slice(0, 6) : recipes.slice(0, 6);
  }
}
