import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import {
  getIngredients,
  getIngredientsLoading
} from '../../services/selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIngredientsLoading);
  const ingredientData = useMemo(
    () =>
      id && ingredients.length
        ? ingredients.find((item) => item._id === id) || null
        : null,
    [id, ingredients]
  );

  if (isLoading && ingredients.length === 0) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div>
        <h2>Ингредиент не найден</h2>
        <p>Запрашиваемый ингредиент не существует</p>
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
