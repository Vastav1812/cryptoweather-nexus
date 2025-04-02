
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleFavoriteCrypto } from '@/redux/slices/preferencesSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';

const CryptoDetails = () => {
  const { cryptoId } = useParams<{ cryptoId: string }>();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.preferences.favorites.cryptos);
  const cryptoData = useAppSelector((state) => state.crypto.data);
  const cryptoHistory = useAppSelector((state) => state.crypto.history[cryptoId || '']);
  const isFavorite = favorites.includes(cryptoId || '');
  
  const crypto = cryptoData.find(c => c.id === cryptoId);
  
  const handleToggleFavorite = () => {
    if (cryptoId) {
      dispatch(toggleFavoriteCrypto(cryptoId));
    }
  };
  
  if (!crypto) {
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
            <h1 className="text-2xl font-bold">Cryptocurrency Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>The requested cryptocurrency could not be found.</p>
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
  
  // Prepare data for the price chart
  const chartData = cryptoHistory?.prices.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: item.value,
  }));
  
  const priceChangeColor = crypto.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
  
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
            <h1 className="text-2xl font-bold">{crypto.name} ({crypto.symbol.toUpperCase()})</h1>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h2 className="text-4xl font-bold">
                  ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <p className={`${priceChangeColor} font-medium`}>
                  {crypto.priceChange24h >= 0 ? '+' : ''}{crypto.priceChange24h.toFixed(2)}% (24h)
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Market Cap</p>
                  <p className="text-xl font-semibold">
                    ${crypto.marketCap.toLocaleString('en-US')}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">24h Volume</p>
                  <p className="text-xl font-semibold">
                    ${crypto.volume24h.toLocaleString('en-US')}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Circulating Supply</p>
                  <p className="text-xl font-semibold">
                    {crypto.circulatingSupply.toLocaleString('en-US')} {crypto.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Last Updated: {new Date(crypto.lastUpdate).toLocaleString()}</p>
                <p className="mt-2">
                  Real-time updates via WebSocket {crypto.id === 'bitcoin' || crypto.id === 'ethereum' ? 'enabled' : 'not available'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData && chartData.length > 0 ? (
                <div className="h-80">
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
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: 'Price (USD)',
                          angle: -90,
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <Tooltip 
                        formatter={(value: any) => ['$' + parseFloat(value).toFixed(2), 'Price']}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="price"
                        name="Price (USD)"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">No price history available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>About {crypto.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              {crypto.id === 'bitcoin' && (
                "Bitcoin is the first decentralized cryptocurrency, based on blockchain technology and secured by cryptography. It was created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto. Bitcoin operates without a central authority or single administrator, and transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain."
              )}
              {crypto.id === 'ethereum' && (
                "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. It is the second-largest cryptocurrency by market capitalization, after Bitcoin. Ethereum was conceived in 2013 by programmer Vitalik Buterin. Ethereum enables developers to build and deploy decentralized applications and provides a platform for smart contracts."
              )}
              {crypto.id === 'solana' && (
                "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale. Founded by Anatoly Yakovenko in 2017, Solana is known for its extremely fast processing times and low transaction costs. It uses a proof-of-history consensus combined with proof-of-stake, allowing for improved scalability compared to many other blockchain platforms."
              )}
              {!['bitcoin', 'ethereum', 'solana'].includes(crypto.id) && (
                `${crypto.name} is a cryptocurrency traded under the symbol ${crypto.symbol.toUpperCase()}. For more detailed information, please visit a cryptocurrency information service.`
              )}
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Resources</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <a href={`https://www.coingecko.com/en/coins/${crypto.id}`} target="_blank" rel="noopener noreferrer">
                    CoinGecko
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`https://coinmarketcap.com/currencies/${crypto.id}`} target="_blank" rel="noopener noreferrer">
                    CoinMarketCap
                  </a>
                </Button>
                {crypto.id === 'bitcoin' && (
                  <Button variant="outline" asChild>
                    <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer">
                      Bitcoin.org
                    </a>
                  </Button>
                )}
                {crypto.id === 'ethereum' && (
                  <Button variant="outline" asChild>
                    <a href="https://ethereum.org" target="_blank" rel="noopener noreferrer">
                      Ethereum.org
                    </a>
                  </Button>
                )}
                {crypto.id === 'solana' && (
                  <Button variant="outline" asChild>
                    <a href="https://solana.com" target="_blank" rel="noopener noreferrer">
                      Solana.com
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <StatusBar />
    </div>
  );
};

export default CryptoDetails;
