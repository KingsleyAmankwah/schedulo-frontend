import { Availabilities } from '../../availability/types';
import { Meeting } from '../../meetings/types';

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

export interface JwtPayLoad {
  user_id: string;
}

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  oauthProvider: string;
  oauthId: string;
  profileImageUrl: string;
  profileLink: string;
  profileVisitCount: number;
  status: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  availabilities: Availabilities[];
  events: [];
  meetings: Meeting[];
  enabled: boolean;
  username: string;
  authorities: Authority[];
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}

export interface Authority {
  authority: string;
}

export interface ErrorResponse {
  status: number;
  errorCode: string;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}
