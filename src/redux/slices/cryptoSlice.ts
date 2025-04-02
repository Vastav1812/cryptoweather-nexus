import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  lastUpdate: number;
}

export interface CryptoHistory {
  [id: string]: {
    prices: { timestamp: number; value: number }[];
  };
}

interface CryptoState {
  data: CryptoData[];
  history: CryptoHistory;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  websocketConnected: boolean;
}

const initialState: CryptoState = {
  data: [],
  history: {},
  loading: false,
  error: null,
  lastUpdated: null,
  websocketConnected: false,
};

// List of cryptocurrencies to track
const cryptoIds = ['bitcoin', 'ethereum', 'solana'];

// Async thunk for fetching crypto data
export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data.map((crypto: any) => ({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        price: crypto.current_price,
        priceChange24h: crypto.price_change_percentage_24h,
        marketCap: crypto.market_cap,
        volume24h: crypto.total_volume,
        circulatingSupply: crypto.circulating_supply,
        lastUpdate: Date.now(),
      }));
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred while fetching crypto data');
    }
  }
);

// Create slice
const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCryptoPrice(state, action: PayloadAction<{ id: string; price: number }>) {
      const { id, price } = action.payload;
      const crypto = state.data.find(c => c.id === id);
      
      if (crypto) {
        // Calculate the price change percentage
        const oldPrice = crypto.price;
        const priceChange = ((price - oldPrice) / oldPrice) * 100;
        
        // Update the crypto with new price
        crypto.price = price;
        crypto.lastUpdate = Date.now();
        
        // Add to history
        if (!state.history[id]) {
          state.history[id] = { prices: [] };
        }
        
        state.history[id].prices.push({ timestamp: Date.now(), value: price });
        
        // Keep only the last 100 price points
        if (state.history[id].prices.length > 100) {
          state.history[id].prices.shift();
        }
      }
    },
    setWebsocketConnected(state, action: PayloadAction<boolean>) {
      state.websocketConnected = action.payload;
    },
    updateCryptoHistory(state, action: PayloadAction<CryptoData[]>) {
      action.payload.forEach(crypto => {
        if (!state.history[crypto.id]) {
          state.history[crypto.id] = { prices: [] };
        }
        
        state.history[crypto.id].prices.push({
          timestamp: crypto.lastUpdate,
          value: crypto.price
        });
        
        // Keep only the last 100 price points
        if (state.history[crypto.id].prices.length > 100) {
          state.history[crypto.id].prices.shift();
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        // Also update crypto history
        cryptoSlice.caseReducers.updateCryptoHistory(state, action);
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateCryptoPrice, setWebsocketConnected, updateCryptoHistory } = cryptoSlice.actions;
export default cryptoSlice.reducer;
