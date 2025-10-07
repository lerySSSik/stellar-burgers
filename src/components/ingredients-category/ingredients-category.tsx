import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorBun,
  getConstructorIngredients
} from '../../services/selectors';
import { addBun, addIngredient } from '../../services/slices/constructor-slice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const dispatch = useDispatch();
  const bun = useSelector(getConstructorBun);
  const constructorIngredients = useSelector(getConstructorIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    (constructorIngredients || []).forEach(
      (ingredient: TConstructorIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      }
    );
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [bun, constructorIngredients]);

  const handleAddIngredient = (ingredient: TIngredient) => {
    const constructorIngredient: TConstructorIngredient = {
      ...ingredient,
      id: `${ingredient._id}-${Date.now()}`
    };

    if (ingredient.type === 'bun') {
      dispatch(addBun(constructorIngredient));
    } else {
      dispatch(addIngredient(constructorIngredient));
    }
  };

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      handleAddIngredient={handleAddIngredient}
      ref={ref}
    />
  );
});
