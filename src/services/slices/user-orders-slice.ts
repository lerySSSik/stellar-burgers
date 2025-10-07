import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getOrdersApi } from '../../utils/burger-api';

export interface UserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response || [];
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки заказов'
      );
    }
  }
);

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки заказов';
      });
  }
});

export const { clearError } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;
