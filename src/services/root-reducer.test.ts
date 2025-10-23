import { expect, test, describe } from '@jest/globals';
import { rootReducer } from './root-reducer';

describe('root reducer', () => {
  const expectedInitialState = {
    ingredients: {
      ingredients: [],
      isLoading: false,
      error: null
    },
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    order: {
      orderRequest: false,
      orderModalData: null,
      currentOrder: null,
      error: null
    },
    feed: {
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    },
    auth: {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    },
    userOrders: {
      orders: [],
      isLoading: false,
      error: null
    }
  };

  test('should return the initial state', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    expect(initialState).toEqual(expectedInitialState);
  });

  test('should handle unknown action', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    const newState = rootReducer(initialState, { type: 'unknown' });
    expect(newState).toEqual(initialState);
  });
});