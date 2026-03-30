export interface User {
  username: string;
  email: string;
  role: string;
}

export interface AuthToken {
  token: string;
  user: User;
  expiresAt: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
