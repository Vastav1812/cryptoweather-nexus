
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleFavoriteCity } from '@/redux/slices/preferencesSlice';
import { WeatherData } from '@/redux/slices/weatherSlice';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.preferences.favorites.cities);
  const temperatureUnit = useAppSelector((state) => state.preferences.temperatureUnit);
  const isFavorite = favorites.includes(data.id);
  
  // Convert temperature if needed
  const displayTemp = temperatureUnit === 'fahrenheit' 
    ? (data.temperature * 9/5) + 32 
    : data.temperature;
  
  const weatherIcons: Record<string, string> = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️',
  };
  
  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteCity(data.id));
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{data.city}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="mt-0 text-gray-400 hover:text-nexus-purple"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-nexus-purple text-nexus-purple' : ''}`}
            />
          </Button>
        </div>
        <p className="text-sm text-gray-500">{data.country}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">
              {displayTemp.toFixed(1)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
            </span>
            <span className="text-sm text-gray-500">{data.conditions}</span>
          </div>
          <div className="text-4xl">
            {weatherIcons[data.conditions] || '🌡️'}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span className="text-sm text-gray-500">Humidity</span>
            <p className="font-medium">{data.humidity}%</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span className="text-sm text-gray-500">Wind</span>
            <p className="font-medium">{data.windSpeed} m/s</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/weather/${data.id}`}
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default WeatherCard;
