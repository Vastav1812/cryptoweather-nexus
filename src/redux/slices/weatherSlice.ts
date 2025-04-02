
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface WeatherData {
  id: string;
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  conditions: string;
  icon: string;
  windSpeed: number;
  timestamp: number;
}

export interface WeatherHistory {
  [cityId: string]: {
    temperatures: { timestamp: number; value: number }[];
    humidity: { timestamp: number; value: number }[];
  };
}

interface WeatherState {
  data: WeatherData[];
  history: WeatherHistory;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: WeatherState = {
  data: [],
  history: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Define city coordinates for the predefined cities
const cities = [
  { id: 'new-york', name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { id: 'london', name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { id: 'tokyo', name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
];

// Async thunk for fetching weather data
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '2b7e1fa06540a5577a6e1e62b003f01e';
      
      const weatherPromises = cities.map(async (city) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`
          );
          
          if (!response.ok) {
            console.error(`Weather API error for ${city.name}: ${response.statusText}`);
            return {
              id: city.id,
              city: city.name,
              country: city.country,
              temperature: 0,
              humidity: 0,
              conditions: 'Unknown',
              icon: '',
              windSpeed: 0,
              timestamp: Date.now(),
            };
          }
          
          const data = await response.json();
          
          return {
            id: city.id,
            city: city.name,
            country: city.country,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            conditions: data.weather[0].main,
            icon: data.weather[0].icon,
            windSpeed: data.wind.speed,
            timestamp: Date.now(),
          };
        } catch (error) {
          console.error(`Error fetching weather for ${city.name}:`, error);
          return {
            id: city.id,
            city: city.name,
            country: city.country,
            temperature: 0,
            humidity: 0,
            conditions: 'Error',
            icon: '',
            windSpeed: 0,
            timestamp: Date.now(),
          };
        }
      });
      
      const weatherData = await Promise.all(weatherPromises);
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred while fetching weather data');
    }
  }
);

// Create slice
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addWeatherAlert(state, action: PayloadAction<{ city: string; alert: string }>) {
      // This would handle weather alerts in a real application
      // For now, we'll just add them to the state and display in notifications
    },
    updateWeatherHistory(state, action: PayloadAction<WeatherData[]>) {
      action.payload.forEach((cityData) => {
        if (!state.history[cityData.id]) {
          state.history[cityData.id] = {
            temperatures: [],
            humidity: []
          };
        }
        
        state.history[cityData.id].temperatures.push({
          timestamp: cityData.timestamp,
          value: cityData.temperature
        });
        
        state.history[cityData.id].humidity.push({
          timestamp: cityData.timestamp,
          value: cityData.humidity
        });
        
        // Keep only last 24 entries (representing 24 hours of data in a real app)
        if (state.history[cityData.id].temperatures.length > 24) {
          state.history[cityData.id].temperatures.shift();
        }
        
        if (state.history[cityData.id].humidity.length > 24) {
          state.history[cityData.id].humidity.shift();
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        // Also update weather history
        weatherSlice.caseReducers.updateWeatherHistory(state, action);
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addWeatherAlert, updateWeatherHistory } = weatherSlice.actions;
export default weatherSlice.reducer;
