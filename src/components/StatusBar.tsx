
import React from 'react';
import { useWebSocket } from '@/services/WebSocketService';
import { useAppSelector } from '@/redux/hooks';

const StatusBar: React.FC = () => {
  const { connected } = useWebSocket();
  const lastWeatherUpdate = useAppSelector((state) => state.weather.lastUpdated);
  const lastCryptoUpdate = useAppSelector((state) => state.crypto.lastUpdated);
  const lastNewsUpdate = useAppSelector((state) => state.news.lastUpdated);
  
  const formatTimeAgo = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="flex items-center mr-4 mb-1 sm:mb-0">
          <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>WebSocket: {connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex flex-wrap">
          <div className="mr-4 mb-1 sm:mb-0">
            <span>Weather: </span>
            <span>{formatTimeAgo(lastWeatherUpdate)}</span>
          </div>
          <div className="mr-4 mb-1 sm:mb-0">
            <span>Crypto: </span>
            <span>{formatTimeAgo(lastCryptoUpdate)}</span>
          </div>
          <div>
            <span>News: </span>
            <span>{formatTimeAgo(lastNewsUpdate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
