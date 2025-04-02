
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
      const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cryptocurrency&language=en&size=5`
      );
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.results) {
        throw new Error('No news data found');
      }
      
      return data.results.map((item: any, index: number) => ({
        id: item.article_id || `news-${index}`,
        title: item.title,
        description: item.description,
        url: item.link,
        source: item.source_id,
        publishedAt: item.pubDate,
        imageUrl: item.image_url,
      }));
    } catch (error) {
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
