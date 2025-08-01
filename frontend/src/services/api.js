import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Company Information API
export const companyAPI = {
  getInfo: async () => {
    try {
      const response = await api.get('/company/info');
      return response.data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  }
};

// Roadmap API
export const roadmapAPI = {
  getMilestones: async () => {
    try {
      const response = await api.get('/roadmap');
      return response.data;
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      throw error;
    }
  }
};

// Team API
export const teamAPI = {
  getMembers: async () => {
    try {
      const response = await api.get('/team');
      return response.data;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  }
};

// Analytics API
export const analyticsAPI = {
  trackCommand: async (commandData) => {
    try {
      const response = await api.post('/analytics/command', commandData);
      return response.data;
    } catch (error) {
      console.error('Error tracking command:', error);
      // Don't throw error for analytics - it's not critical
      return { success: false };
    }
  },
  
  getStats: async () => {
    try {
      const response = await api.get('/analytics/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
};

// Inquiries API
export const inquiriesAPI = {
  create: async (inquiryData) => {
    try {
      const response = await api.post('/inquiries', inquiryData);
      return response.data;
    } catch (error) {
      console.error('Error creating inquiry:', error);
      throw error;
    }
  }
};

// Commands API
export const commandsAPI = {
  getResponse: async (commandName) => {
    try {
      const response = await api.get(`/commands/${commandName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching command response:', error);
      throw error;
    }
  }
};

export default api;