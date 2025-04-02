
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCryptoData } from '@/redux/slices/cryptoSlice';
import Header from '@/components/Header';
import CryptoCard from '@/components/CryptoCard';
import StatusBar from '@/components/StatusBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Crypto = () => {
  const dispatch = useAppDispatch();
  const cryptoData = useAppSelector((state) => state.crypto.data);
  const favorites = useAppSelector((state) => state.preferences.favorites.cryptos);
  const loading = useAppSelector((state) => state.crypto.loading);
  const error = useAppSelector((state) => state.crypto.error);
  const websocketConnected = useAppSelector((state) => state.crypto.websocketConnected);
  
  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchCryptoData());
  }, [dispatch]);
  
  // Filter favorite cryptos
  const favoriteCrypto = cryptoData.filter(crypto => favorites.includes(crypto.id));
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
          <div className="flex items-center text-sm">
            <span className="mr-2">Real-time Updates:</span>
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${websocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{websocketConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Cryptocurrency Markets</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Cryptocurrencies</TabsTrigger>
                <TabsTrigger value="favorites" disabled={favoriteCrypto.length === 0}>
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
                    {cryptoData.map(crypto => (
                      <CryptoCard key={crypto.id} data={crypto} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favorites">
                {favoriteCrypto.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteCrypto.map(crypto => (
                      <CryptoCard key={crypto.id} data={crypto} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No favorite cryptocurrencies yet. Add some to your favorites!</p>
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

export default Crypto;
