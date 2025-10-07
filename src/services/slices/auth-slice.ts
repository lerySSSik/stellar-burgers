import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

export interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (response.success) {
        setCookie('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      }
      return rejectWithValue('Ошибка авторизации');
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка авторизации'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (response.success) {
        setCookie('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      }
      return rejectWithValue('Ошибка регистрации');
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Ошибка получения данных пользователя');
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка получения данных пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user);
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Ошибка обновления данных пользователя');
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка обновления данных пользователя'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error: unknown) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка выхода'
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie('accessToken');
      if (!token) {
        return rejectWithValue('Нет токена');
      }
      const response = await getUserApi();
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Ошибка проверки авторизации');
    } catch (error: unknown) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка проверки авторизации'
      );
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка входа';
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка регистрации';
        state.isAuthenticated = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка получения данных пользователя';
        state.isAuthenticated = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || null;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка обновления данных';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = (action.payload as string) || 'Ошибка выхода';
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error =
          (action.payload as string) || 'Ошибка проверки авторизации';
      });
  }
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
