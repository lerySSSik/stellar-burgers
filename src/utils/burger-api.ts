import { setCookie, getCookie, deleteCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL =
  process.env.BURGER_API_URL || 'https://norma.nomoreparties.space/api';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      try {
        const refreshData = await refreshToken();
        if (options.headers) {
          (options.headers as { [key: string]: string }).authorization =
            refreshData.accessToken;
        }
        const res = await fetch(url, options);
        return await checkResponse<T>(res);
      } catch (refreshErr) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshErr);
      }
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

const fallbackIngredientsData: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  }
];

export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    })
    .catch((error) => {
      if (
        error.name === 'TypeError' &&
        (error.message.includes('fetch') || error.message.includes('CORS'))
      ) {
        return fallbackIngredientsData;
      }
      throw error;
    });

const fallbackFeedsData: TFeedsResponse = {
  success: true,
  orders: [
    {
      _id: '1',
      status: 'done',
      name: 'Краторный бургер',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: 12345,
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Био-марсианский бургер',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      number: 12346,
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0942']
    },
    {
      _id: '3',
      status: 'done',
      name: 'Флюоресцентный бургер',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      number: 12347,
      ingredients: ['643d69a5c3f7b9001cfa093e', '643d69a5c3f7b9001cfa0943']
    }
  ],
  total: 3,
  totalToday: 2
};

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => {
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Слишком много запросов. Попробуйте позже.');
        }
        if (res.status === 0 || res.status >= 500) {
          throw new Error(
            'Сервер недоступен. Проверьте подключение к интернету.'
          );
        }
        throw new Error(`Ошибка сервера: ${res.status}`);
      }
      return checkResponse<TFeedsResponse>(res);
    })
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    })
    .catch((error) => {
      if (
        error.name === 'TypeError' &&
        (error.message.includes('fetch') || error.message.includes('CORS'))
      ) {
        return fallbackFeedsData;
      }
      if (error.message.includes('Слишком много запросов')) {
        return fallbackFeedsData;
      }
      throw error;
    });

export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) => {
  const fallbackOrderData: TOrderResponse = {
    success: true,
    orders: [
      {
        _id: 'fallback-order-1',
        status: 'done',
        name: 'Fallback заказ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: number,
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0941',
          '643d69a5c3f7b9001cfa0942'
        ]
      }
    ]
  };

  return fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Слишком много запросов. Попробуйте позже.');
        }
        if (res.status === 0 || res.status >= 500) {
          throw new Error(
            'Сервер недоступен. Проверьте подключение к интернету.'
          );
        }
        throw new Error(`Ошибка сервера: ${res.status}`);
      }
      return checkResponse<TOrderResponse>(res);
    })
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    })
    .catch((error) => {
      if (
        error.name === 'TypeError' &&
        (error.message.includes('fetch') || error.message.includes('CORS'))
      ) {
        return fallbackOrderData;
      }
      if (error.message.includes('Слишком много запросов')) {
        return fallbackOrderData;
      }
      throw error;
    });
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
