import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { OrderCardProps } from './type';
import { TIngredient } from '../../utils/types';
import { OrderCardUI } from '../ui/order-card';
import { getIngredients } from '../../services/selectors';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector(getIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients
      .map((id: string) => ingredients.find((ing) => ing._id === id))
      .filter(Boolean) as TIngredient[];

    const total = ingredientsInfo.reduce((sum, item) => sum + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains = Math.max(0, ingredientsInfo.length - maxIngredients);
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return null;
  }

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
