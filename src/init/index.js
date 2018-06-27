import { createStore, applyMiddleware, combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import { createDucks } from '../components/helpers';
import userDucks from '../components/user/user.ducks';
import orderDucks from '../components/order/order.ducks';

const { user, order } = createDucks([userDucks, orderDucks]);

console.log('> !!!', user, order);

const rootReducer = combineReducers({
  [user.name]: user.getReducer(),
  [order.name]: order.getReducer(),
});

function* rootSaga() {
  yield fork(user.getOperations());
  yield fork(order.getOperations());
}

const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware, logger);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  // then run the saga
  sagaMiddleware.run(rootSaga);

  return store;
}
