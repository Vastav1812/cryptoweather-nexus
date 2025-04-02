
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchWeatherData } from '@/redux/slices/weatherSlice';
import { fetchCryptoData } from '@/redux/slices/cryptoSlice';
import { fetchNewsData } from '@/redux/slices/newsSlice';
import Header from '@/components/Header';
import WeatherCard from '@/components/WeatherCard';
import CryptoCard from '@/components/CryptoCard';
import NewsCard from '@/components/NewsCard';
import StatusBar from '@/components/StatusBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const dispatch = useAppDispatch();
  const weatherData = useAppSelector((state) => state.weather.data);
  const cryptoData = useAppSelector((state) => state.crypto.data);
  const newsData = useAppSelector((state) => state.news.data);
  const favorites = useAppSelector((state) => state.preferences.favorites);
  
  const weatherLoading = useAppSelector((state) => state.weather.loading);
  const cryptoLoading = useAppSelector((state) => state.crypto.loading);
  const newsLoading = useAppSelector((state) => state.news.loading);
  
  const weatherError = useAppSelector((state) => state.weather.error);
  const cryptoError = useAppSelector((state) => state.crypto.error);
  const newsError = useAppSelector((state) => state.news.error);
  
  // Fetch data on mount and periodically
  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchWeatherData());
      dispatch(fetchCryptoData());
      dispatch(fetchNewsData());
    };
    
    // Initial fetch
    fetchData();
    
    // Periodic fetch every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Filter favorite items
  const favoriteWeather = weatherData.filter(city => favorites.cities.includes(city.id));
  const favoriteCrypto = cryptoData.filter(crypto => favorites.cryptos.includes(crypto.id));
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-full md:col-span-1 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Weather Overview</CardTitle>
              <CardDescription>Current weather in major cities</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Cities</TabsTrigger>
                  <TabsTrigger value="favorites" disabled={favoriteWeather.length === 0}>
                    Favorites
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  {weatherLoading ? (
                    <div className="grid gap-4 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : weatherError ? (
                    <div className="text-center py-4 text-red-500">
                      <p>{weatherError}</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {weatherData.map(city => (
                        <WeatherCard key={city.id} data={city} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="favorites">
                  {favoriteWeather.length > 0 ? (
                    <div className="grid gap-4">
                      {favoriteWeather.map(city => (
                        <WeatherCard key={city.id} data={city} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No favorite cities yet</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="col-span-full md:col-span-1 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Crypto Markets</CardTitle>
              <CardDescription>Real-time cryptocurrency prices</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Cryptos</TabsTrigger>
                  <TabsTrigger value="favorites" disabled={favoriteCrypto.length === 0}>
                    Favorites
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  {cryptoLoading ? (
                    <div className="grid gap-4 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : cryptoError ? (
                    <div className="text-center py-4 text-red-500">
                      <p>{cryptoError}</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {cryptoData.map(crypto => (
                        <CryptoCard key={crypto.id} data={crypto} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="favorites">
                  {favoriteCrypto.length > 0 ? (
                    <div className="grid gap-4">
                      {favoriteCrypto.map(crypto => (
                        <CryptoCard key={crypto.id} data={crypto} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No favorite cryptocurrencies yet</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="col-span-full md:col-span-2 lg:col-span-1 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Latest News</CardTitle>
              <CardDescription>Crypto headlines and market updates</CardDescription>
            </CardHeader>
            <CardContent>
              {newsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : newsError ? (
                <div className="text-center py-4 text-red-500">
                  <p>{newsError}</p>
                </div>
              ) : (
                <NewsCard data={newsData} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <StatusBar />
    </div>
  );
};

export default Index;
