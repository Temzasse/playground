import { takeEvery, put } from 'redux-saga/effects';
import { createModel } from '../../reducktion';

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
    // Thunks
    testThunk,
  }))
  .selectors(({ name }) => ({
    getCustomSelector: state => [...state[name].orders, 'lol'],
    getOrders: state => state[name].orders,
  }))
  .operations(({ types, user }) => [
    takeEvery([types.FETCH_ORDERS], fetchOrdersSaga),
    takeEvery([user.types.LOGIN], reactToLoginSaga, { user }),
  ])
  .create()

function* fetchOrdersSaga() {
  yield console.log('> fetch orders');
}

function* reactToLoginSaga({ user }, action) {
  console.log('> react to login', user, action);
  yield put(model.actions.fetchOrders());
  yield put(user.actions.setProfile());
}

// Thunks
function testThunk (arg, self, { user }) {
  return async dispatch => {
    console.log('> thunk', arg, self);
    dispatch(self.actions.failFetchOrders());
    dispatch(user.actions.setProfile());
  }
}

export default model;
