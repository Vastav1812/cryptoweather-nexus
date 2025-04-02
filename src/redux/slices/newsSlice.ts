
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Types
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

interface NewsState {
  data: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: NewsState = {
  data: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunk for fetching news data
export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async (_, { rejectWithValue }) => {
    try {
      // Using the new API key provided by the user
      const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY || 'pub_77724ed8bc9a31e69eb8e792cc17e6f013c3e';
      
      console.log('Fetching news with API key:', apiKey);
      
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cryptocurrency&language=en&size=5`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('News API error response:', errorData);
        throw new Error(`News API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        console.log('Received invalid news data:', data);
        return [];
      }
      
      return data.results.map((item: any, index: number) => ({
        id: item.article_id || `news-${index}`,
        title: item.title || 'No Title',
        description: item.description || 'No Description',
        url: item.link || '#',
        source: item.source_id || 'Unknown',
        publishedAt: item.pubDate || new Date().toISOString(),
        imageUrl: item.image_url,
      }));
    } catch (error) {
      console.error('Error fetching news data:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred while fetching news data');
    }
  }
);

// Create slice
const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default newsSlice.reducer;
