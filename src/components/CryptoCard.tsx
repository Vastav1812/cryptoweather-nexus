
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleFavoriteCrypto } from '@/redux/slices/preferencesSlice';
import { CryptoData } from '@/redux/slices/cryptoSlice';

interface CryptoCardProps {
  data: CryptoData;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.preferences.favorites.cryptos);
  const isFavorite = favorites.includes(data.id);
  
  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteCrypto(data.id));
  };
  
  const priceChangeColor = data.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
  const TrendIcon = data.priceChange24h >= 0 ? TrendingUp : TrendingDown;

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold flex items-center">
            {data.name} <span className="ml-2 text-sm text-gray-500 uppercase">{data.symbol}</span>
          </CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            ${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center ${priceChangeColor}`}>
            <TrendIcon className="h-4 w-4 mr-1" />
            <span>{Math.abs(data.priceChange24h).toFixed(2)}%</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span className="text-sm text-gray-500">Market Cap</span>
            <p className="font-medium">${(data.marketCap / 1000000000).toFixed(2)}B</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span className="text-sm text-gray-500">Volume (24h)</span>
            <p className="font-medium">${(data.volume24h / 1000000).toFixed(2)}M</p>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs text-gray-500">
            Last updated: {new Date(data.lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/crypto/${data.id}`}
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

export default CryptoCard;
