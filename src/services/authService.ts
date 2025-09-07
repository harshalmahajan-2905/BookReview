import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAxiosAuthHeader(this.token);
    }
  }

  private setAxiosAuthHeader(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setToken(token: string) {
    this.token = token;
    this.setAxiosAuthHeader(token);
  }

  removeToken() {
    this.token = null;
    delete axios.defaults.headers.common['Authorization'];
  }

  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async register(name: string, email: string, password: string, role?: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role
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