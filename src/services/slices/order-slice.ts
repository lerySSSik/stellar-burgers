import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';

export interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка создания заказа'
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders?.[0] || null;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки заказа'
      );
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload || null;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = (action.payload as string) || 'Ошибка создания заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload || null;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Ошибка загрузки заказа';
      });
  }
});

export const { closeOrderModal, clearError } = orderSlice.actions;
export default orderSlice.reducer;
