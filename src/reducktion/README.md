<p align='center'>
  <br><br><br>
  <img src="logo.png" width="400"/>
  <br><br><br>
<p/>

*A small helper library for Redux to reduce boilerplate and enforce a more modular architecture by following the ducks pattern.*

* 🦆 **Modular architecture with ducks pattern.**
* 🔮 **Less boilerplate.**
* 💉 **Inject dependencies easily.**

Inspiration: [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux) by [Erik Rasmussen](https://github.com/erikras).

---

# Getting started

## Install

```sh
$ npm install reducktion
```

or

```sh
$ yarn add reducktion
```

## The Idea

Redux gets it's fair share of critisism for the amount of boilerplate that is
required to setup the different entities related to it: action types, action creators, reducers, selectors, handling async behaviour, etc.

More here...

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

So, the non-auto-generatad version of the above example would look like this:

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
  .reducer(({ types }) => ({
    // ...
  }))
  // define actions manually
  .actions(({ types }) => {
    fetchOrders: types.FETCH_ORDERS,
    fetchOrdersFailed: types.FETCH_ORDERS_FAILED,
    receiveOrders: types.RECEIVE_ORDERS,
  })
  // define selectors manually
  .selectors(({ name }) => {
    getOrders: state => state[name].orders,
    getIsLoading: state => state[name].isLoading,
    getHasError: state => state[name].hasError,
  })
  .create();

export default model;
```

> Auto generating the actions and selectors is merely a nice to have convenience that you should not rely on in a bigger application since every time you change your state field name or action type name your actions / selectors **WILL CHANGE** respectfully! For example if you have a field called `loading` and you change it to `isLoading` the corresponding generated selector will change from `getLoading` to `getIsLoading`.

Finally in the place where you combine your reducers and create the store:

```javascript
import { createStore, combineReducers } from 'redux';
import { createDucks } from 'reducktion';
import orderDucks from '../order/order.ducks';

const { order } = createDucks([orderDucks /* other ducks... */]);

const rootReducer = combineReducers({
  [order.name]: order.getReducer(),
  // other duck reducers...
});

const store = createStore(rootReducer, initialState);
```

Finally you can use the model of your ducks in your React components.

```javascript
import { connect } from 'react-redux';
import order from '../order/order.ducks';

class SomeComponent extends Component {
  componentDidMount() {
    this.props.fetchOrders();
  }

  render() {
    const { isLoading, orders } = this.props;

    if (isLoading) {
      return <span>Loading orders...</span>;
    }

    return (
      <div>
        {orders.map(order => (
          /* render order here */
        ))}
      </div>
    )
  }
}

export default connect(
  state => ({
    orders: order.selectors.getOrders(state),
    isLoading: order.selectors.getIsLoading(state),
  }),
  {
    fetchOrders: order.actions.fetchOrders,
  }
)(SomeComponent);
```

That's it!

You have encapsulated the Redux logic of a feature called `order` into a model of a so called duck.

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
    takeEvery(types.FETCH_ORDERS, fetchOrdersSaga),
    takeLatest(types.OTHER, otherSaga)
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
