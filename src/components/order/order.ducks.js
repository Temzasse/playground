import { takeEvery } from 'redux-saga/effects';
import { createModel } from '../helpers';

const model = createModel(
  'order',
  ['FETCH_ORDERS', 'RECEIVE_ORDERS', 'FETCH_ORDERS_FAILED'],
  {
    orders: [],
    isLoading: false,
    hasError: false,
  }
)
  .inject('user')
  .reducer(({ types, user }) => ({
    [types.FETCH_ORDERS]: state => ({ ...state, isLoading: true }),
    [types.FETCH_ORDERS_FAILED]: state => ({
      ...state,
      isLoading: false,
      hasError: true,
    }),
    [types.RECEIVE_ORDERS]: (state, action) => ({
      ...state,
      isLoading: false,
      hasError: false,
      orders: action.payload,
    }),
    [user.types.LOGIN]: state => ({ ...state, isLoading: true }),
  }))
  .actions(({ types }) => ({
    fetchOrders: types.FETCH_ORDERS,
    failFetchOrders: types.FETCH_ORDERS_FAILED,
    setOrders: types.RECEIVE_ORDERS,
  }))
  .selectors(({ name }) => ({
    getCustomSelector: state => [...state[name].orders, 'lol'],
    getOrders: state => state[name].orders,
  }))
  .operations(({ types, user }) => [
    takeEvery([types.FETCH_ORDERS], fetchOrdersSaga),
    takeEvery([user.types.LOGIN], reactToLoginSaga),
  ])
  .create();

function* fetchOrdersSaga() {
  yield console.log('> fetch orders');
}

function* reactToLoginSaga() {
  yield console.log('> react to login');
}

export default model;
