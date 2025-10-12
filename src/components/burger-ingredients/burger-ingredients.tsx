import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getIngredients,
  getIngredientsLoading
} from '../../services/selectors';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIngredientsLoading);

  const { buns, mains, sauces } = useMemo(
    () => ({
      buns: ingredients.filter((item) => item.type === 'bun'),
      mains: ingredients.filter((item) => item.type === 'main'),
      sauces: ingredients.filter((item) => item.type === 'sauce')
    }),
    [ingredients]
  );

  if (isLoading) {
    return <Preloader />;
  }

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);

    const refMap = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    };

    const targetRef = refMap[tab as keyof typeof refMap];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
