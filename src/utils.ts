import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

export function usePendingState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const set = useCallback((...args: Parameters<typeof setState>) => {
    startTransition(() => {
      setState(...args);
    });
  }, []);

  return [state, set, isPending] as const;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

type Timer = ReturnType<typeof setTimeout>;
type AnyFunction<T> = (...args: T[]) => void;

export function useDebouncedHandler<T>(func: AnyFunction<T>, delay: number) {
  const timer = useRef<Timer>(undefined);

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = ((...args) => {
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      func(...args);
    }, delay);
  }) as AnyFunction<T>;

  return debouncedFunction;
}
