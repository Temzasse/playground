import { createAction, handleActions } from 'redux-actions';
import { all } from 'redux-saga/effects';

// Helpers -------------------------------------------------------------------
const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1);

const isFunction = f => f && {}.toString.call(f) === '[object Function]';

function createTypes(base, actionsArray = []) {
  const res = {};
  actionsArray.forEach(type => {
    res[type] = `${base}/${type}`;
  });
  return res;
}
// ---------------------------------------------------------------------------

/**
 * Creates a ducks model and returns chainable functions to define futher props.
 * @param {string} modelName 
 * @param {string[]} typeList 
 * @param {Object} initialState 
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
   */
  funcs.actions = actionsFunc => {
    const actionsObj = actionsFunc({ types }) || {};

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
   */
  funcs.selectors = selectorsFunc => {
    const selectorsObj = selectorsFunc({ name: modelName }) || {};
    selectors = { ...selectors, ...selectorsObj };
    return funcs;
  };

  /**
   * Defines a curried function that is later provided with types, initial state, and dependencies.
   * @param {Function} reducerFunc 
   */
  funcs.reducer = reducerFunc => {
    reducer = reducerFunc;
    return funcs;
  };

  funcs.operations = operationsFunc => {
    operations = operationsFunc;
    return funcs;
  };

  funcs.inject = (...deps) => {
    deps.forEach(depName => {
      dependencies[depName] = null;
    });

    return funcs;
  };

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

  const _run = () => {
    // Run curried functions with own types and dependencies
    const reducerObj = reducer({ types, initialState, ...dependencies }) || {};
    reducer = handleActions(reducerObj, initialState);
    operations = operations({ types, ...dependencies }) || [];
  };

  const getReducer = () => reducer;

  const getOperations = () => {
    function* ops() {
      yield all(operations);
    }
    return ops;
  };

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

export const createDucks = ducks => {
  const ducksByName = ducks.reduce((acc, val) => {
    acc[val.name] = val;
    return acc;
  }, {});

  Object.values(ducksByName).forEach(duck => {
    duck._fillDeps(ducksByName);
    duck._run();
  });

  return ducksByName;
};
