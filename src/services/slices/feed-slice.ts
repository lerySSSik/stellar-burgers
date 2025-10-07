import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

export interface FeedState extends TOrdersData {
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response || { orders: [], total: 0, totalToday: 0 };
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки ленты заказов'
      );
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload?.orders || [];
        state.total = action.payload?.total || 0;
        state.totalToday = action.payload?.totalToday || 0;
        state.isLoading = false;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка загрузки ленты заказов';
      });
  }
});

export default feedSlice.reducer;
