import axios, { type AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const getToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('umetaiToken');
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const apiMessage = error.response?.data && typeof error.response.data === 'object' ? (error.response.data as any).message : undefined;
    const message = apiMessage || error.message || 'Unexpected server error';

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('umetaiToken');
        localStorage.removeItem('umetaiUser');
        window.dispatchEvent(new Event('umetai-logout'));
      }
    }

    return Promise.reject(new Error(message));
  }
);

const buildError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  return new Error('Unknown API error');
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role?: 'patient' | 'doctor' | 'admin';
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ProfilePayload {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  diagnosis: string;
  stage: string;
  treatmentPhase: string;
}

export interface TestAnswerPayload {
  answers: Record<number, number>;
}

export interface SymptomPayload {
  pain: number;
  fatigue: number;
  appetite: number;
  nausea: number;
  sleep: number;
}

export interface TestResultPoint {
  date: string;
  anxiety: number;
  depression: number;
}

export interface TestResultsResponse {
  anxietyScore: number;
  depressionScore: number;
  history: TestResultPoint[];
}

export interface ChartResponse {
  history: TestResultPoint[];
}

export interface SymptomRecord {
  id: string;
  date: string;
  pain: number;
  fatigue: number;
  appetite: number;
  nausea: number;
  sleep: number;
}

export interface UserRow {
  id: string;
  fullName: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  status: 'active' | 'pending' | 'inactive';
}

export interface DoctorPatient {
  id: string;
  name: string;
  patientId: string;
  diagnosis: string;
  status: 'critical' | 'warning' | 'stable';
  alert: string;
  lastTest: string;
}

export interface MessageRecord {
  id: string;
  sender: 'patient' | 'doctor' | 'system';
  text: string;
  time: string;
  read: boolean;
}

const unwrap = <T>(response: { data: T }) => response.data;

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/auth/login', payload);
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/auth/register', payload);
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    // ignore errors during logout
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('umetaiToken');
      localStorage.removeItem('umetaiUser');
      window.dispatchEvent(new Event('umetai-logout'));
    }
  }
};

export const getProfile = async (): Promise<ProfilePayload & { id: string; role: string }> => {
  try {
    const response = await axiosInstance.get('/user/profile');
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const updateProfile = async (data: Partial<ProfilePayload>): Promise<ProfilePayload> => {
  try {
    const response = await axiosInstance.put('/user/profile', data);
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const submitTest = async (answers: TestAnswerPayload): Promise<{ testId: string }> => {
  try {
    const response = await axiosInstance.post('/tests/submit', answers);
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const getTestResults = async (): Promise<TestResultsResponse> => {
  try {
    const response = await axiosInstance.get('/tests/results');
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const getTestChart = async (): Promise<ChartResponse> => {
  try {
    const response = await axiosInstance.get('/tests/chart');
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const getSymptoms = async (): Promise<SymptomRecord[]> => {
  try {
    const response = await axiosInstance.get('/symptoms');
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const submitSymptom = async (data: SymptomPayload): Promise<SymptomRecord> => {
  try {
    const response = await axiosInstance.post('/symptoms', data);
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const getUsers = async (): Promise<UserRow[]> => {
  try {
    const response = await axiosInstance.get('/admin/users');
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const updateUserRole = async (userId: string, role: string): Promise<UserRow> => {
  try {
    const response = await axiosInstance.put(`/admin/users/${encodeURIComponent(userId)}/role`, { role });
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const getDoctorPatients = async (): Promise<DoctorPatient[]> => {
  try {
    const response = await axiosInstance.get('/doctor/patients');
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const getPatientAnalytics = async (patientId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/doctor/analytics/${encodeURIComponent(patientId)}`);
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const sendMessage = async (patientId: string, message: string): Promise<MessageRecord> => {
  try {
    const response = await axiosInstance.post('/chat/messages', { patientId, message });
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};

export const getMessages = async (patientId: string): Promise<MessageRecord[]> => {
  try {
    const response = await axiosInstance.get(`/chat/messages/${encodeURIComponent(patientId)}`);
    return unwrap(response);
  } catch (error) {
    throw buildError(error);
  }
};
