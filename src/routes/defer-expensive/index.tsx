import { memo, useDeferredValue, useState } from 'react';

export function Component() {
  const [count, setCount] = useState(0);
  // const count2 = count
  const count2 = useDeferredValue(count);

  function increment() {
    setCount((c) => c + 1);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 40,
      }}
    >
      <button onClick={increment}>Increment</button>
      <ImportantComponent count={count} />
      <SlowComponent count={count2} />
    </div>
  );
}

function ImportantComponent({ count }: { count: number }) {
  return (
    <div
      style={{
        padding: 8,
        border: '1px solid #eee',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 600,
      }}
    >
      Count is: {count}
    </div>
  );
}

const SlowComponent = memo(function SlowComponent({ count }: { count: number }) {
  const items = [];

  for (let i = 0; i < 252; i++) {
    items.push(<SlowItem key={i} count={count} />);
  }

  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: 10,
      }}
    >
      {items}
    </ul>
  );
});

function SlowItem({ count }: { count: number }) {
  const startTime = performance.now();

  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return <li style={{ padding: 4, background: '#eee', textAlign: 'center' }}>{count}</li>;
}
