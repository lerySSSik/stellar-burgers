import { expect, test, describe } from '@jest/globals';
import constructorReducer, { addBun, addIngredient, removeIngredient, moveIngredient, clearConstructor } from './constructor-slice';
import { TConstructorIngredient } from '../../utils/types';

const mockBun: TConstructorIngredient = {
  _id: '1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 100,
  image: 'test.jpg',
  image_large: 'test-large.jpg',
  image_mobile: 'test-mobile.jpg',
  id: 'bun-1'
};

const mockIngredient: TConstructorIngredient = {
  _id: '2',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 15,
  fat: 8,
  carbohydrates: 25,
  calories: 150,
  price: 80,
  image: 'test2.jpg',
  image_large: 'test2-large.jpg',
  image_mobile: 'test2-mobile.jpg',
  id: 'ingredient-1'
};

describe('constructor slice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('should return the initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle addBun', () => {
    expect(constructorReducer(undefined, addBun(mockBun))).toEqual({
      ...initialState,
      bun: mockBun
    });
  });

  test('should handle addIngredient', () => {
    expect(constructorReducer(undefined, addIngredient(mockIngredient))).toEqual({
      ...initialState,
      ingredients: [mockIngredient]
    });
  });

  test('should handle removeIngredient', () => {
    const state = { ...initialState, ingredients: [mockIngredient] };
    expect(constructorReducer(state, removeIngredient('ingredient-1'))).toEqual(initialState);
  });

  test('should handle moveIngredient', () => {
    const ingredient2 = { ...mockIngredient, id: 'ingredient-2' };
    const state = { ...initialState, ingredients: [mockIngredient, ingredient2] };
    expect(constructorReducer(state, moveIngredient({ dragIndex: 0, hoverIndex: 1 }))).toEqual({
      ...initialState,
      ingredients: [ingredient2, mockIngredient]
    });
  });

  test('should handle clearConstructor', () => {
    const state = { bun: mockBun, ingredients: [mockIngredient] };
    expect(constructorReducer(state, clearConstructor())).toEqual(initialState);
  });
});