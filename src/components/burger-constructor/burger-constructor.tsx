import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorBun,
  getConstructorIngredients,
  getOrderRequest,
  getOrderModalData,
  getIsAuthenticated
} from '../../services/selectors';
import {
  createOrder,
  closeOrderModal
} from '../../services/slices/order-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector(getConstructorBun);
  const ingredients = useSelector(getConstructorIngredients);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const onOrderClick = () => {
    if (bun && !orderRequest && isAuthenticated) {
      const orderIngredients = [
        bun._id,
        ...(ingredients || []).map((ingredient) => ingredient._id),
        bun._id
      ];
      dispatch(createOrder(orderIngredients));
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const constructorItems = {
    bun,
    ingredients: ingredients || []
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = (constructorItems.ingredients || []).reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
