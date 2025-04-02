
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleFavoriteCity } from '@/redux/slices/preferencesSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';

const WeatherDetails = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const dispatch = useAppDispatch();
  const temperatureUnit = useAppSelector((state) => state.preferences.temperatureUnit);
  const favorites = useAppSelector((state) => state.preferences.favorites.cities);
  const weatherData = useAppSelector((state) => state.weather.data);
  const weatherHistory = useAppSelector((state) => state.weather.history[cityId || '']);
  const isFavorite = favorites.includes(cityId || '');
  
  const cityData = weatherData.find(city => city.id === cityId);
  
  const handleToggleFavorite = () => {
    if (cityId) {
      dispatch(toggleFavoriteCity(cityId));
    }
  };
  
  if (!cityData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">City Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>The requested city could not be found.</p>
              <Button asChild className="mt-4">
                <Link to="/">Return to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <StatusBar />
      </div>
    );
  }
  
  // Convert temperature data for the chart if needed
  const chartData = weatherHistory?.temperatures.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: temperatureUnit === 'fahrenheit' 
      ? (item.value * 9/5) + 32 
      : item.value,
    humidity: weatherHistory?.humidity.find(h => h.timestamp === item.timestamp)?.value || 0
  }));
  
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
  
  // Convert temperature if needed
  const displayTemp = temperatureUnit === 'fahrenheit' 
    ? (cityData.temperature * 9/5) + 32 
    : cityData.temperature;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{cityData.city} Weather</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            className="flex items-center gap-2"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-nexus-purple text-nexus-purple' : ''}`} />
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Current Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-4xl font-bold">
                    {displayTemp.toFixed(1)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
                  </h2>
                  <p className="text-gray-500">{cityData.conditions}</p>
                </div>
                <div className="text-6xl">
                  {weatherIcons[cityData.conditions] || '🌡️'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="text-xl font-semibold">{cityData.humidity}%</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Wind Speed</p>
                  <p className="text-xl font-semibold">{cityData.windSpeed} m/s</p>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Last Updated: {new Date(cityData.timestamp).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weather History</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData && chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }} 
                      />
                      <YAxis
                        yAxisId="temperature"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: `Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`,
                          angle: -90,
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <YAxis
                        yAxisId="humidity"
                        orientation="right" 
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: 'Humidity (%)',
                          angle: -90,
                          position: 'insideRight',
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="temperature"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="humidity"
                        type="monotone"
                        dataKey="humidity"
                        stroke="#0EA5E9"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">No historical data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <StatusBar />
    </div>
  );
};

export default WeatherDetails;
