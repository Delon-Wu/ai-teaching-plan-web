const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getDeviceHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const deviceId = localStorage.getItem('device_id') || '';
  const inviteCode = localStorage.getItem('invite_code') || '';
  return {
    'X-Device-Id': deviceId,
    'X-Invite-Code': inviteCode,
  };
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, signal } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getDeviceHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new ApiError(errorText, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiUpload<T = unknown>(
  endpoint: string,
  formData: FormData,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: getDeviceHeaders(),
    body: formData,
    signal,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new ApiError(errorText, res.status);
  }

  return res.json();
}

export function getApiBaseUrl(): string {
  return API_BASE;
}
