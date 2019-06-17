```js
function* poll({ start, stop, handler }) {
  while (yield take(start)) {
    const task = yield fork(handler);
    yield take(stop);
    yield cancel(task);
  }
}

function* poller(handler, interval) {
  try {
    while (true) {
      yield call(handler);
      yield call(sleep, interval);
    }
  } finally {
    if (yield cancelled()) console.log('> Charging polling cancelled');
    console.log('> Charging polling ended');
  }
}

const pollForData = poller(function* pollForDataHandler() {
  const data = yield call(api.fetchData)
}, 1000);

// Usage
poll({
  start: types.startPoll,
  stop: types.stopPoll,
  handler: handlePollSaga,
}),
```