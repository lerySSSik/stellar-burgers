import { expect, test, describe } from '@jest/globals';
import authReducer, { clearError, setUser, clearUser } from './auth-slice';
import { loginUser, registerUser, getUser, updateUser, logoutUser, checkAuth } from './auth-slice';
import { TUser } from '../../utils/types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('auth slice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };

  test('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle clearError', () => {
    const state = { ...initialState, error: 'Some error' };
    expect(authReducer(state, clearError())).toEqual({
      ...initialState,
      error: null
    });
  });

  test('should handle setUser', () => {
    expect(authReducer(undefined, setUser(mockUser))).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('should handle clearUser', () => {
    const state = { ...initialState, user: mockUser, isAuthenticated: true };
    expect(authReducer(state, clearUser())).toEqual(initialState);
  });

  test('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    expect(authReducer(undefined, action)).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  test('should handle loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    expect(authReducer(undefined, action)).toEqual({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('should handle loginUser.rejected', () => {
    const action = { type: loginUser.rejected.type, error: { message: 'any' } };
    expect(authReducer(undefined, action)).toEqual({
      ...initialState,
      error: 'Ошибка входа'
    });
  });
});