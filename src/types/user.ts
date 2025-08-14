import { VALID_USER_ROLES, UserRole } from '@/lib/user-constants';

// Re-export UserRole type for backwards compatibility
export type { UserRole };

// User interface matching the database schema
export interface User {
  id: string;
  clerk_user_id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// User insert interface for creating new users
export interface UserInsert {
  id?: string;
  clerk_user_id: string;
  email?: string | null;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

// User update interface for updating existing users
export interface UserUpdate {
  id?: string;
  clerk_user_id?: string;
  email?: string | null;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

// User creation request interface for API calls
export interface CreateUserRequest {
  email?: string;
  role: UserRole;
}

// User update request interface for API calls
export interface UpdateUserRequest {
  email?: string;
  role?: UserRole;
}

// User response interface for API responses
export interface UserResponse {
  success: boolean;
  data?: User;
  error?: string;
}

// Users list response interface for API responses
export interface UsersListResponse {
  success: boolean;
  data?: User[];
  error?: string;
}

// User role validation
export const isValidUserRole = (role: string): role is UserRole => {
  return VALID_USER_ROLES.includes(role as any);
};

// User role display names
export const getUserRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'client':
      return 'Client';
    case 'talent':
      return 'Talent';
    default:
      return 'Unknown';
  }
};

// User role descriptions
export const getUserRoleDescription = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Full access to all features and user management';
    case 'client':
      return 'Can book talent and manage campaigns';
    case 'talent':
      return 'Can create profiles and receive bookings';
    default:
      return 'Unknown role';
  }
}; 