import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUserOrders,
  getUserOrdersLoading,
  getUserOrdersError,
  getIngredients,
  getIngredientsLoading
} from '../../services/selectors';
import { fetchUserOrders } from '../../services/slices/user-orders-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUserOrders);
  const isLoading = useSelector(getUserOrdersLoading);
  const error = useSelector(getUserOrdersError);
  const ingredients = useSelector(getIngredients);
  const ingredientsLoading = useSelector(getIngredientsLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());

    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (isLoading) {
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки заказов: {error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
