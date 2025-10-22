import { expect, test, describe } from '@jest/globals';
import ingredientsReducer, { clearError } from './ingredients-slice';
import { fetchIngredients } from './ingredients-slice';
import { TIngredient } from '../../utils/types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Test Ingredient',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 100,
  image: 'test.jpg',
  image_large: 'test-large.jpg',
  image_mobile: 'test-mobile.jpg'
};

describe('ingredients slice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  test('should return the initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle clearError', () => {
    const state = { ...initialState, error: 'Some error' };
    expect(ingredientsReducer(state, clearError())).toEqual({
      ...initialState,
      error: null
    });
  });

  test('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    expect(ingredientsReducer(undefined, action)).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  test('should handle fetchIngredients.fulfilled', () => {
    const action = { type: fetchIngredients.fulfilled.type, payload: [mockIngredient] };
    expect(ingredientsReducer(undefined, action)).toEqual({
      ...initialState,
      ingredients: [mockIngredient],
      isLoading: false
    });
  });

  test('should handle fetchIngredients.rejected', () => {
    const action = { type: fetchIngredients.rejected.type, error: { message: 'any' } };
    expect(ingredientsReducer(undefined, action)).toEqual({
      ...initialState,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});