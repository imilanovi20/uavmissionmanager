import type { LoginCredentials, LoginResponse, User } from "../types/user.types";
import { ENDPOINTS, STORAGE_KEYS } from "../utils/constants";
import { api } from "./api";

export class UserService {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
      try {
        const response = await api.post<LoginResponse>(ENDPOINTS.LOGIN, credentials);
        
        if (response.data.success && response.data.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        }
        
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
  }

    async getCurrentUser(): Promise<User> {
        try {
            const response = await api.get<User>(ENDPOINTS.ME);
            return response.data;
        } catch (error) {
            throw error;
        }
  }

    async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get<User[]>(ENDPOINTS.USERS);
            return response.data;
        } catch (error) {
            throw error;
        }
    }  

    async registerNewUser(userData: Partial<User>): Promise<User> {
        try {
            const response = await api.post<User>(ENDPOINTS.REGISTER, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    } 

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
}