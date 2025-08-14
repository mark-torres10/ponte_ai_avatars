// Shared constant for valid user roles
export const VALID_USER_ROLES = ['admin', 'client', 'talent'] satisfies readonly string[];

// Derived union type that stays in sync with the constant
export type UserRole = typeof VALID_USER_ROLES[number];
