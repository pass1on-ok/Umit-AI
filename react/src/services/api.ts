import axios from "axios";
import type { AxiosError } from "axios";

export interface LoginResponse {
  token: string;
  user: Record<string, any>;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  [key: string]: any;
}

export interface ProfileData {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  diagnosis?: string;
  stage?: string;
  treatment?: string;
  [key: string]: any;
}

export interface DoctorPatient {
  id: string;
  fullName: string;
  patientId: string;
  diagnosis: string;
  status: 'critical' | 'warning' | 'stable';
  alert?: string;
  lastTest: string;
  [key: string]: any;
}

export interface PatientAnalyticsData extends DoctorPatient {
  age?: number;
  gender?: string;
  carePlan?: string;
  lastAssessment?: string;
  trend?: Array<{
    date: string;
    Anxiety: number;
    Depression: number;
    Fatigue: number;
    Pain: number;
  }>;
}

export const getDoctorPatients = async (): Promise<DoctorPatient[]> => {
  const response = await api.get<DoctorPatient[]>('/doctor/patients');
  return response.data;
};

export const getDoctorPatientAnalytics = async (patientId: string): Promise<PatientAnalyticsData> => {
  const response = await api.get<PatientAnalyticsData>(`/doctor/patients/${patientId}`);
  return response.data;
};

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const message =
        typeof error.response.data === "object" && error.response.data !== null && "message" in error.response.data
          ? (error.response.data as any).message
          : error.response.statusText;
      return Promise.reject(new Error(message || "Unexpected server error."));
    }
    if (error.request) {
      return Promise.reject(new Error("Network error. Please check your connection."));
    }
    return Promise.reject(new Error(error.message));
  }
);

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData: RegisterData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/register", userData);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
  localStorage.removeItem("authToken");
};

export const getProfile = async (): Promise<ProfileData> => {
  const response = await api.get<ProfileData>("/profile");
  return response.data;
};

export const updateProfile = async (profileData: ProfileData): Promise<ProfileData> => {
  const response = await api.put<ProfileData>("/profile", profileData);
  return response.data;
};
