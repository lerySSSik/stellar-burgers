import { FC, useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { getCurrentOrder, getOrderRequest } from '../../services/selectors';
import { getIngredients } from '../../services/selectors';
import {
  fetchOrderByNumber,
  clearError
} from '../../services/slices/order-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();
  const orderData = useSelector(getCurrentOrder);
  const orderRequest = useSelector(getOrderRequest);
  const orderError = useSelector((state) => state.order.error);
  const ingredients: TIngredient[] = useSelector(getIngredients);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(clearError());

    if (number && !orderData) {
      dispatch(fetchOrderByNumber(parseInt(number, 10)));
    }

    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch, number, orderData, ingredients.length, timeoutId]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (orderError) {
      timeout = setTimeout(() => {
        navigate('/');
      }, 3000);
      setTimeoutId(timeout);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [orderError, navigate]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientMap = new Map<string, TIngredient & { count: number }>();

    orderData.ingredients.forEach((id) => {
      const existing = ingredientMap.get(id);
      if (existing) {
        ingredientMap.set(id, { ...existing, count: existing.count + 1 });
      } else {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (ingredient) {
          ingredientMap.set(id, { ...ingredient, count: 1 });
        }
      }
    });

    const ingredientsInfo = Object.fromEntries(ingredientMap.entries());

    const total = Array.from(ingredientMap.values()).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (orderRequest || !ingredients.length) {
    return <Preloader />;
  }

  if (orderError) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Ошибка загрузки заказа</h2>
        <p>{orderError}</p>
        <p>Перенаправление на главную страницу...</p>
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Заказ не найден</h2>
        <p>Запрашиваемый заказ не существует</p>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
