import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import {
  getIngredientsLoading,
  getIngredientsError
} from '../../services/selectors';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(getIngredientsLoading);
  const ingredientsError = useSelector(getIngredientsError);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (ingredientsError) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Ошибка загрузки ингредиентов</h2>
        <p>{ingredientsError}</p>
        <button
          onClick={() => dispatch(fetchIngredients())}
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
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
