export type ReplaceUndefinedWithNull<T> = T extends undefined
  ? NonNullable<T> | null
  : T;

export function turnUndefinedToNull<
  T extends Record<string, unknown>,
  K extends keyof T
>(
  obj: T,
  ...keys: K[]
): {
  [P in keyof T]: P extends K ? ReplaceUndefinedWithNull<T[P]> : T[P];
} {
  keys.forEach((key) => {
    if (obj[key] === undefined) {
      obj[key] = null as T[K];
    }
  });
  return { ...obj } as {
    [P in keyof T]: P extends K ? ReplaceUndefinedWithNull<T[P]> : T[P];
  };
}
