export const queryKeys = {
  me: () => ['me'],
  household: (id: string) => ['household', id],
} as const;
