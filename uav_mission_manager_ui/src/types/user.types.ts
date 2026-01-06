export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  imagePath?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthStore extends AuthState {
  login: (token: string, user?: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}