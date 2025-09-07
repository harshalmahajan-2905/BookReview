import api from './api';

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthHeader(this.token);
    }
  }

  private setAuthHeader(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setToken(token: string) {
    this.token = token;
    this.setAuthHeader(token);
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async register(name: string, email: string, password: string, role?: string) {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  getToken() {
    return this.token;
  }
}

export const authService = new AuthService();
