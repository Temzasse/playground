// @ts-check

import { createAction, handleActions } from 'redux-actions';
import { all } from 'redux-saga/effects';

// Helpers -------------------------------------------------------------------

// JSDoc typedefs

/**
 * @typedef {Object.<string, Function>} Action
 */

/**
 * @typedef {Object.<string, Function>} Selectors
 */

/**
 * @typedef {Object.<string, string>} Types
 */

/**
 * @typedef {Object} DuckFuncs
 * @property {Function} actions
 * @property {Function} selectors
 * @property {Function} reducer
 * @property {Function} operations
 * @property {Function} inject
 */

 /**
 * @typedef {Object} Duck
 * @property {Function} _run
 * @property {Function} _fillDeps
 * @property {Function} getOperations
 * @property {Function} getReducer
 * @property {String} name
 * @property {Action} actions
 * @property {Types} types
 * @property {Selectors} selectors
 * @property {Object.<string, any>} initialState
 */

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1);

const isFunction = f => f && {}.toString.call(f) === '[object Function]';

/**
 * Helper function to create prefixed types for a duck.
 * @param {string} prefix
 * @param {string[]} actionsArray
 * @returns {Types}
 */
function createTypes(prefix, actionsArray = []) {
  return actionsArray.reduce((acc, type) => {
    acc[type] = `${prefix}/${type}`;
    return acc;
  }, {});
}
// ---------------------------------------------------------------------------

/**
 * Creates a ducks model and returns chainable functions to define futher props.
 * @param {string} modelName
 * @param {string[]} typeList
 * @param {Object.<string, any>} initialState
 * @returns {DuckFuncs} Chainable duck functions
 */
export const createModel = (modelName, typeList, initialState) => {
  const types = createTypes(modelName, typeList);
  const funcs = {};
  const actions = {};
  const dependencies = {};

  let operations;
  let reducer;

  // Auto-create initial selectors for each state field
  let selectors = Object.keys(initialState).reduce((acc, key) => {
    acc[`get${capitalize(key)}`] = state => state[modelName][key];
    return acc;
  }, {});

  /**
   * Creates action creators and thunks.
   * @param {Function} actionsFunc
   * @returns {DuckFuncs}
   */
  funcs.actions = actionsFunc => {
    const actionsObj = actionsFunc({ types }) || {};

    // @ts-ignore
    Object.entries(actionsObj).forEach(([actionName, value]) => {
      if (isFunction(value)) {
        // Handle thunks -> provide necessary data: self and dependencies
        const self = { types, actions };
        actions[actionName] = (...args) => value(...args, self, dependencies);
      } else if (typeof value === 'string') {
        // Just create normal action
        actions[actionName] = createAction(value);
      } else {
        throw Error(
          `Unknown type for action ${actionName} - expected a string or function.`
        );
      }
    });
    return funcs;
  };

  /**
   * Extends auto-generated selectors for the duck.
   * @param {Function} selectorsFunc
   * @returns {DuckFuncs}
   */
  funcs.selectors = selectorsFunc => {
    const selectorsObj = selectorsFunc({ name: modelName }) || {};
    selectors = { ...selectors, ...selectorsObj };
    return funcs;
  };

  /**
   * Defines a curried function for reducer that is later provided with
   * types, initial state, and dependencies.
   * @param {Function} reducerFunc
   * @returns {DuckFuncs}
   */
  funcs.reducer = reducerFunc => {
    reducer = reducerFunc;
    return funcs;
  };

  /**
   * Defines a curried function for operations that is later provided with
   * types, initial state, and dependencies.
   * @param {Function} operationsFunc
   * @returns {DuckFuncs}
   */
  funcs.operations = operationsFunc => {
    operations = operationsFunc;
    return funcs;
  };

  /**
   * Defines the dependencies of the duck which should be injected to it later.
   * @param {...string} deps
   * @returns {DuckFuncs}
   */
  funcs.inject = (...deps) => {
    deps.forEach(depName => {
      dependencies[depName] = null;
    });

    return funcs;
  };

  /**
   * Fills in the dependencies that were requested when calling inject.
   * @param {Object.<string, Duck>} deps
   */
  const _fillDeps = deps => {
    Object.keys(dependencies).forEach(dep => {
      if (deps[dep]) {
        dependencies[dep] = {
          // Don't spread all of dep but only what's needed
          types: deps[dep].types,
          actions: deps[dep].actions,
          selectors: deps[dep].selectors,
        };
      } else {
        throw Error(
          `There is no dependendy called '${dep}' for ${modelName} model.`
        );
      }
    });
  };

  /**
   * Run the curried reducer and operations functions with the necessary data.
   */
  const _run = () => {
    // Run curried functions with own types and dependencies
    const reducerObj = reducer({ types, initialState, ...dependencies }) || {};
    reducer = handleActions(reducerObj, initialState);
    operations = operations({ types, ...dependencies }) || [];
  };

  /**
   * Get reducer for the duck.
   * @returns {Function}
   */
  const getReducer = () => reducer;

  /**
   * Get operations for the duck.
   * @returns {Function}
   */
  const getOperations = () => {
    function* ops() {
      yield all(operations);
    }
    return ops;
  };

  /**
   * Collect and return all the properties of the duck.
   * @returns {Duck}
   */
  funcs.create = () => {
    return {
      name: modelName,
      types,
      actions,
      selectors,
      initialState,
      getOperations,
      getReducer,
      _run,
      _fillDeps,
    };
  };

  return funcs;
};

/**
 * Create ducks.
 * @param {Duck[]} ducks 
 * @returns {Object.<string, Duck>}
 */
export const createDucks = ducks => {
  const ducksByName = ducks.reduce((acc, val) => {
    acc[val.name] = val;
    return acc;
  }, {});

  // @ts-ignore
  Object.values(ducksByName).forEach(duck => {
    duck._fillDeps(ducksByName);
    duck._run();
  });

  return ducksByName;
};
