import {
  type DocumentNode,
  type OperationVariables,
  type TypedDocumentNode,
} from '@apollo/client';
import {
  useReadQuery as useApolloReadQuery,
  useSuspenseQuery as useApolloSuspenseQuery,
  type QueryRef,
} from '@apollo/client/react';
import { equal } from '@wry/equality';
import { useDeferredValue } from 'react';
import { useSpinDelay } from 'spin-delay';

/**
 * Enhance `useSuspenseQuery` hook to add better support for refetching on
 * window focus and stop the hook from suspending when variables change
 * and instead return a `suspending` flag that can be used to shown an inline
 * loading indicator.
 *
 * More info: https://www.teemutaskula.com/blog/exploring-query-suspense#deferring-with-usedeferredvalue
 * (the article is written for React Query but the same concept applies to Apollo)
 */
export function useSuspenseQueryDeferred<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: useApolloSuspenseQuery.Options<NoInfer<TVariables>>
) {
  const variables = useDeferredValue(options?.variables);

  const result = useApolloSuspenseQuery<TData, TVariables>(query, {
    // TODO: figure out TS issue if `!` is removed
    ...options!,
    variables,
  });

  /**
   * Add smart delay to prevent spinner flickering when variables change,
   * and tell when the query is suspending so that we can show an inline
   * loading indicator.
   */
  const suspending = useSpinDelay(!equal(variables, options?.variables));

  const r = result as typeof result & { suspending: boolean };

  // eslint-disable-next-line react-hooks/immutability
  r.suspending = suspending;

  return r;
}

/**
 * Enhance `useReadQuery` hook to stop the hook from suspending when `queryRef`
 * changes and instead return a `suspending` flag that can be used to shown
 * an inline loading indicator.
 */
export function useReadQueryDeferred<TData>(queryRef: QueryRef<TData>) {
  const deferredQueryRef = useDeferredValue(queryRef);
  const result = useApolloReadQuery(deferredQueryRef);

  /**
   * Add smart delay to prevent spinner flickering when variables change,
   * and tell when the query is suspending so that we can show an inline
   * loading indicator.
   */
  const suspending = deferredQueryRef !== queryRef;

  const r = result as typeof result & { suspending: boolean };

  // eslint-disable-next-line react-hooks/immutability
  r.suspending = suspending;

  return r;
}
