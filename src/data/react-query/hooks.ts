import {
  DefaultError,
  QueryKey,
  UseSuspenseQueryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useDeferredValue } from 'react';
import { useSpinDelay } from 'spin-delay';
import { useDeepCompareMemo } from 'use-deep-compare';

export function useSuspenseQueryDeferred<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryKey = useDeepCompareMemo(
    () => options.queryKey,
    [options.queryKey]
  );
  const deferredQueryKey = useDeferredValue(queryKey);
  const query = useSuspenseQuery({ ...options, queryKey: deferredQueryKey });
  const isSuspending = useSpinDelay(deferredQueryKey !== queryKey);

  /**
   * Maintain tracked properties by extending the query object instead of creating a new object.
   * See: https://tanstack.com/query/latest/docs/framework/react/guides/render-optimizations#tracked-properties
   */
  const q = query as typeof query & { isSuspending: boolean };

  // eslint-disable-next-line react-hooks/immutability
  q.isSuspending = isSuspending;

  return q;
}
