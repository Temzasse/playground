export function readData<T extends { data: unknown }>(
  result: T
): NonNullableDeep<T['data']> {
  return result.data as NonNullableDeep<T['data']>;
}

type NonNullableDeep<T> = T extends null | undefined
  ? never
  : T extends object
    ? { [K in keyof T]: NonNullableDeep<T[K]> }
    : T;
