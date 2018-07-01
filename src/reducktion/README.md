<p align='center'>
  <br><br><br>
  <img src="logo.png" width="400"/>
  <br><br><br>
<p/>

# Reducktion

A small helper library for Redux to reduce boilerplate and making using it more modular by following ducks pattern.

## The Idea

* 🦆 **Modular architecture with ducks pattern.**
* 🔮 **Less boilerplate.**
* 💉 **Inject dependencies easily.**

Redux gets it's fair share of critisism for the amount of boilerplate that is
required to setup the different entities related to it: action types, action creators, reducers, selectors, handling async behaviour, etc.

## Usage

### Simple example

```javascript
import { createModel } from 'reducktion';

const model = createModel(
  // model name
  'order',
  // action types
  ['FETCH_ORDERS', 'RECEIVE_ORDERS', 'FETCH_ORDERS_FAILED'],
  // initial state
  {
    orders: [],
    isLoading: false,
    hasError: false,
  }
)
  // define reducer
  .reducer(({ types }) => ({
    [types.FETCH_ORDERS]: state => ({
      ...state,
      isLoading: true,
    }),
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
  }))
  // remember to call .create() in the end!
  .create();

export default model;
```

**Okay but wait, where are all my actions and selectors?!**

By default reducktion will auto generate actions based on the provided action types
and selectors based on the field names in your initial state object.

This is to make it more convenient ...

Finally in the place where you combine your reducers and create the store:

```javascript
import { createStore, combineReducers } from 'redux';
import { createDucks } from 'reducktion';
import orderDucks from '../order.ducks';

const { order } = createDucks([orderDucks /* other ducks... */]);

const rootReducer = combineReducers({
  [order.name]: order.getReducer(),
  // other duck reducers...
});

const store = createStore(rootReducer, initialState);
```

## Dependency injection

```javascript
import { createModel } from 'reducktion';

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
    [types.FETCH_ORDERS]: state => ({
      ...state,
      isLoading: true,
    }),
    // ... other own reducers
    // then use injected user model
    [user.LOGOUT]: state => ({
      ...state,
      orders: [],
    }),
  }))
  .create();

export default model;
```

## Usage with redux-thunk

```javascript
import { createModel } from 'reducktion';

const model = createModel(
  'settings',
  ['TOGGLE_NOTIFICATIONS', 'TOGGLE_GPS', 'UPDATE_THEME', 'RESET_SETTINGS'],
  {
    notificationsEnabled: false,
    gpsEnabled: false,
    selectedTheme: 'light',
  }
)
  .reducer(({ types, initialState }) => ({
    [types.RESET_SETTINGS]: state => ({
      ...initialState,
    }),
    [types.TOGGLE_NOTIFICATIONS]: state => ({
      ...state,
      notificationsEnabled: !state.notificationsEnabled,
    }),
    [types.TOGGLE_GPS]: state => ({
      ...state,
      gpsEnabled: !state.gpsEnabled,
    }),
    [types.UPDATE_THEME]: (state, action) => ({
      ...state,
      theme: action.payload || 'light',
    }),
  }))
  .actions(({ types }) => ({
    // other actions are auto-generated, but define a thunk here
    someThunk,
  }))
  .create();

// Thunks
function someThunk(args) {
  return async dispatch => {
    await api.doSomeAsyncWork(args);
    dispatch(model.actions.updateTheme('dark'));
  };
}

export default model;
```

## Usage with redux-saga

```javascript
import { createModel } from 'reducktion';
import { takeEvery, takeLatest, put } from 'redux-saga/effects';

const model = createModel(
  'order',
  ['FETCH_ORDERS', 'RECEIVE_ORDERS', 'FETCH_ORDERS_FAILED', 'OTHER'],
  {
    orders: [],
    isLoading: false,
    hasError: false,
  }
)
  .reducer(({ types }) => ({
    [types.FETCH_ORDERS]: state => ({
      ...state,
      isLoading: true,
    }),
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
  }))
  .operations(({ types }) => [
    takeEvery([types.FETCH_ORDERS], fetchOrdersSaga),
    takeLatest([types.OTHER], otherSaga)
  ])
  .create();

function* fetchOrdersSaga() {
  try {
    const orders = yield api.fetchOrders();
    yield put(model.actions.receiveOrders(orders));
  } catch (e) {
    yield put(model.actions.fetchOrdersFailed(orders));
  }
}

function* otherSaga() {
  // do something else
}

export default model;
```
