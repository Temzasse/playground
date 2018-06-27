import { createAction, handleActions } from 'redux-actions';
import { all } from 'redux-saga/effects';

export const fetchActions = ['FETCH', 'RECEIVE', 'FAIL'];
export const saveActions = ['SAVE', 'RESULT', 'FAIL'];
export const binaryActions = ['SET', 'CLEAR'];
export const crudActions = [
  ...binaryActions,
  'RECEIVE',
  'FAIL',
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'LIST',
  'CREATE_FAIL',
  'READ_FAIL',
  'UPDATE_FAIL',
  'DELETE_FAIL',
  'LIST_FAIL',
];

export function createTypes(base, actionsArray = fetchActions) {
  const res = {};
  actionsArray.forEach(type => {
    res[type] = `${base}/${type}`;
  });
  return res;
}

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1);

/*
const camelCaseAction = word =>
  word
    .toLowerCase()
    .split('_')
    .reduce((acc, x, i) => (i === 0 ? acc + x : acc + capitalize(x)), '');

export function createActionsAndTypes(prefix, suffixes) {
  const actions = {};
  const types = {};

  suffixes.forEach(s => {
    const type = `${prefix}/${s}`;
    types[s] = type;
    const actionName = camelCaseAction(s);
    actions[actionName] = createAction(type);
  });

  return { actions, types };
}
*/

export const createModel = (modelName, typeList, initialState) => {
  const types = createTypes(modelName, typeList);
  const funcs = {};
  const actions = {};
  const dependencies = {};

  let operations;
  let reducer;

  // Create initial selectors for each state field
  let selectors = Object.keys(initialState).reduce((acc, key) => {
    acc[`get${capitalize(key)}`] = state => state[modelName][key];
    return acc;
  }, {});

  funcs.actions = actionsFunc => {
    const actionsObj = actionsFunc({ types, ...dependencies }) || {};
    Object.entries(actionsObj).forEach(([actionName, type]) => {
      actions[actionName] = createAction(type);
    });
    return funcs;
  };

  funcs.selectors = selectorsFunc => {
    const selectorsObj = selectorsFunc({ name: modelName }) || {};
    selectors = { ...selectors, ...selectorsObj };
    return funcs;
  };

  funcs.reducer = reducerFunc => {
    reducer = reducerFunc;
    return funcs;
  };

  funcs.operations = operationsFunc => {
    operations = operationsFunc;
    return funcs;
  };

  funcs.inject = depName => {
    dependencies[depName] = null;
    return funcs;
  };

  const _fillDeps = deps => {
    Object.keys(dependencies).forEach(dep => {
      if (deps[dep]) {
        dependencies[dep] = {
          types: deps[dep].types,
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
    const reducerObj = reducer({ types, ...dependencies }) || {};
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
