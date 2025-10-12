import { FC, useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import {
  getIngredients,
  getIngredientsLoading
} from '../../services/selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIngredientsLoading);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
    [timeoutId]
  );

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
