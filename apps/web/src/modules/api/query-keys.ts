export const queryKeys = {
  me: () => ['me'],
  households: {
    single: (id: string) => ['households', id],
  },
  accounts: {
    all: () => ['accounts'],
  },
} as const;
