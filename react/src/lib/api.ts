// Native fetch-based API client (no axios dependency needed)

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

// ── Core request helper ───────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<{ data: T }> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
    throw new Error('Unauthorized');
  }

  let json: any;
  const text = await res.text();
  try { json = JSON.parse(text); } catch { json = text; }

  if (!res.ok) {
    // Throw in a shape that matches what our pages expect: err.response.data.message
    const err: any = new Error(json?.message || res.statusText);
    err.response = { data: json, status: res.status };
    throw err;
  }

  return { data: json as T };
}

const get  = <T>(path: string)              => request<T>('GET',    path);
const post = <T>(path: string, body: unknown) => request<T>('POST',   path, body);
const patch= <T>(path: string, body: unknown) => request<T>('PATCH',  path, body);
const del  = <T>(path: string)              => request<T>('DELETE', path);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LoginResponse  { accessToken: string; }
export interface RegisterDto    { name: string; email: string; password: string; }

export interface UserProfile {
  id: number;
  gender?:        string | null;
  dateOfBirth?:   string | null;
  address?:       string | null;
  phone?:         string | null;
  diagnosis?:     string | null;
  stage?:         string | null;
  treatmentPhase?: string | null;
  userId: number;
}

export interface User {
  id: number;
  name: string | null;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'PSYCHOLOGIST' | 'ADMIN';
  createdAt: string;
  profile?: UserProfile | null;
}

export interface HadsResult {
  id: number;
  userId: number;
  answers: number[];
  anxietyScore: number;
  depressionScore: number;
  createdAt: string;
}

export interface Symptom {
  id: number;
  userId: number | null;
  pain: number;
  fatigue: number;
  appetite: number;
  nausea: number;
  sleep: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSymptomDto {
  pain: number; fatigue: number; appetite: number; nausea: number; sleep: number;
}

export interface UpdateProfileDto {
  gender?: string; dateOfBirth?: string; address?: string;
  phone?: string; diagnosis?: string; stage?: string; treatmentPhase?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login:    (email: string, password: string) => post<LoginResponse>('/auth/login', { email, password }),
  register: (data: RegisterDto)               => post<User>('/users/register', data),
};

// ── Users / Profile ───────────────────────────────────────────────────────────

export const usersApi = {
  getMe:         (id: number)                          => get<User>(`/users/${id}`),
  updateMe:      (id: number, data: { name?: string; email?: string }) => patch<User>(`/users/${id}`, data),
  updateProfile: (id: number, data: UpdateProfileDto)  => patch<User>(`/users/${id}/profile`, data),
  getAll:        ()                                     => get<User[]>('/users'),
  deleteUser:    (id: number)                           => del<User>(`/users/${id}`),
};

// ── HADS ──────────────────────────────────────────────────────────────────────

export const hadsApi = {
  submit: (answers: number[])  => post<HadsResult>('/hads', { answers }),
  getAll: ()                   => get<HadsResult[]>('/hads'),
  getMy:  ()                   => get<HadsResult[]>('/hads/my'),
  getOne: (id: number)         => get<HadsResult>(`/hads/${id}`),
};

// ── Symptoms ──────────────────────────────────────────────────────────────────

export const symptomsApi = {
  create:  (data: CreateSymptomDto)                  => post<Symptom>('/symptoms', data),
  getAll:  ()                                         => get<Symptom[]>('/symptoms'),
  getOne:  (id: number)                               => get<Symptom>(`/symptoms/${id}`),
  update:  (id: number, data: Partial<CreateSymptomDto>) => patch<Symptom>(`/symptoms/${id}`, data),
  delete:  (id: number)                               => del<Symptom>(`/symptoms/${id}`),
};
