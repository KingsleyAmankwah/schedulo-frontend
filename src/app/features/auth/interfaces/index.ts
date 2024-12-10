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

export interface UserDetails {
  sub: string;
  name: string;
  user_id: string;
  role: string;
  profile: string;
  profilePhoto: string;
  profileVisitCount: number;
}

export interface ErrorResponse {
  status: number;
  errorCode: string;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}
