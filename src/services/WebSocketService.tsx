
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { updateCryptoPrice, setWebsocketConnected } from '@/redux/slices/cryptoSlice';
import { addNotification } from '@/redux/slices/notificationsSlice';

interface WebSocketContextType {
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  // Setup WebSocket connection
  useEffect(() => {
    // CoinCap WebSocket API
    const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      dispatch(setWebsocketConnected(true));
      
      dispatch(addNotification({
        type: 'price_alert',
        title: 'WebSocket Connected',
        message: 'Real-time cryptocurrency price updates are now active.',
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Process the data
        Object.entries(data).forEach(([coin, price]) => {
          const numericPrice = parseFloat(price as string);
          
          // Map CoinCap IDs to our standard IDs
          const coinIdMap: Record<string, string> = {
            'bitcoin': 'bitcoin',
            'ethereum': 'ethereum',
            'solana': 'solana'
          };
          
          const coinId = coinIdMap[coin];
          if (coinId) {
            dispatch(updateCryptoPrice({
              id: coinId,
              price: numericPrice
            }));
            
            // Check for significant price changes (> 0.5% in this demo)
            // In a real app, you would compare to the previous price and notify only
            // when the change is significant
            if (Math.random() < 0.05) { // Simulate occasional alerts for demo
              dispatch(addNotification({
                type: 'price_alert',
                title: `${coin.toUpperCase()} Price Alert`,
                message: `${coin.toUpperCase()} is now $${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              }));
            }
          }
        });
      } catch (e) {
        console.error('Error processing WebSocket message', e);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      dispatch(setWebsocketConnected(false));
      
      // Try to reconnect after a delay
      setTimeout(() => {
        if (socket && socket.readyState === WebSocket.CLOSED) {
          setSocket(null);
        }
      }, 5000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    };
    
    setSocket(ws);
    
    // Weather alerts simulation
    const weatherAlertInterval = setInterval(() => {
      // Simulate occasional weather alerts
      if (Math.random() < 0.1) {
        const cities = ['New York', 'London', 'Tokyo'];
        const alerts = [
          'Heavy rain expected',
          'Temperature dropping rapidly',
          'Strong winds alert',
          'Heat wave warning',
          'Snow expected',
          'Fog advisory'
        ];
        
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        
        dispatch(addNotification({
          type: 'weather_alert',
          title: `Weather Alert: ${randomCity}`,
          message: randomAlert,
        }));
      }
    }, 30000); // every 30 seconds
    
    return () => {
      clearInterval(weatherAlertInterval);
      if (ws) {
        ws.close();
      }
    };
  }, [dispatch]);
  
  return (
    <WebSocketContext.Provider value={{ connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
