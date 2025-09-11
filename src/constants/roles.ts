export const ROLES = {
  USER: { name: 'user', guard: 'web' },
  VENDOR: { name: 'vendor', guard: 'vendor' },
  ADMIN: { name: 'admin', guard: 'admin' },
} as const;

// TypeScript types
export type RoleKey = keyof typeof ROLES; // 'USER' | 'VENDOR' | 'ADMIN'
export type RoleName = (typeof ROLES)[RoleKey]['name']; // 'user' | 'vendor' | 'admin'
export type RoleGuard = (typeof ROLES)[RoleKey]['guard']; // 'user' | 'vendor' | 'admin'
