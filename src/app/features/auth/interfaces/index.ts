export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
export interface LoginData {
  email: string;
  password: string;
}
