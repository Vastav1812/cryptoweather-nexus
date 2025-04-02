
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchWeatherData } from '@/redux/slices/weatherSlice';
import Header from '@/components/Header';
import WeatherCard from '@/components/WeatherCard';
import StatusBar from '@/components/StatusBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Weather = () => {
  const dispatch = useAppDispatch();
  const weatherData = useAppSelector((state) => state.weather.data);
  const favorites = useAppSelector((state) => state.preferences.favorites.cities);
  const loading = useAppSelector((state) => state.weather.loading);
  const error = useAppSelector((state) => state.weather.error);
  
  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchWeatherData());
  }, [dispatch]);
  
  // Filter favorite cities
  const favoriteWeather = weatherData.filter(city => favorites.includes(city.id));
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Weather Dashboard</h1>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Global Weather Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Cities</TabsTrigger>
                <TabsTrigger value="favorites" disabled={favoriteWeather.length === 0}>
                  Favorites
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-6 text-red-500">
                    <p>{error}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weatherData.map(city => (
                      <WeatherCard key={city.id} data={city} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favorites">
                {favoriteWeather.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteWeather.map(city => (
                      <WeatherCard key={city.id} data={city} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No favorite cities yet. Add some cities to your favorites!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <StatusBar />
    </div>
  );
};

export default Weather;
