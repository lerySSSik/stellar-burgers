import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeedOrders,
  getFeedLoading,
  getFeedError,
  getIngredients
} from '../../services/selectors';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const isLoading = useSelector(getFeedLoading);
  const error = useSelector(getFeedError);
  const ingredients = useSelector(getIngredients);

  useEffect(() => {
    // Загружаем ингредиенты, если они еще не загружены
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
    // Загружаем ленту заказов
    dispatch(fetchFeeds());
  }, [dispatch, ingredients.length]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Ошибка загрузки данных</h2>
        <p>{error}</p>
        <button
          onClick={() => dispatch(fetchFeeds())}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4C4CFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
