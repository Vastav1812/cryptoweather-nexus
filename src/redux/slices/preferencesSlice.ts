
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface Favorites {
  cities: string[];
  cryptos: string[];
}

interface PreferencesState {
  favorites: Favorites;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

const loadFromLocalStorage = (): PreferencesState => {
  if (typeof window === 'undefined') {
    return {
      favorites: { cities: [], cryptos: [] },
      temperatureUnit: 'celsius',
    };
  }
  
  const saved = localStorage.getItem('cryptoWeatherPreferences');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing saved preferences', e);
    }
  }
  
  return {
    favorites: { cities: [], cryptos: [] },
    temperatureUnit: 'celsius',
  };
};

const initialState: PreferencesState = loadFromLocalStorage();

// Create slice
const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleFavoriteCity(state, action: PayloadAction<string>) {
      const cityId = action.payload;
      const index = state.favorites.cities.indexOf(cityId);
      
      if (index === -1) {
        state.favorites.cities.push(cityId);
      } else {
        state.favorites.cities.splice(index, 1);
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('cryptoWeatherPreferences', JSON.stringify(state));
      }
    },
    toggleFavoriteCrypto(state, action: PayloadAction<string>) {
      const cryptoId = action.payload;
      const index = state.favorites.cryptos.indexOf(cryptoId);
      
      if (index === -1) {
        state.favorites.cryptos.push(cryptoId);
      } else {
        state.favorites.cryptos.splice(index, 1);
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('cryptoWeatherPreferences', JSON.stringify(state));
      }
    },
    setTemperatureUnit(state, action: PayloadAction<'celsius' | 'fahrenheit'>) {
      state.temperatureUnit = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('cryptoWeatherPreferences', JSON.stringify(state));
      }
    },
  },
});

export const {
  toggleFavoriteCity,
  toggleFavoriteCrypto,
  setTemperatureUnit,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
