import { useDeferredValue } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

import {
  DefaultError,
  QueryKey,
  UseSuspenseQueryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useSpinDelay } from 'spin-delay';

export function useSuspenseQueryDeferred<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryKey = useDeepCompareMemo(() => options.queryKey, [options.queryKey]);
  const deferredQueryKey = useDeferredValue(queryKey);
  const query = useSuspenseQuery({ ...options, queryKey: deferredQueryKey });
  const isSuspending = useSpinDelay(deferredQueryKey !== queryKey);
  return { ...query, isSuspending };
}
