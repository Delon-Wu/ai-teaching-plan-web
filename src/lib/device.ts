import FingerprintJS, { type Agent } from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<Agent> | null = null;

function getFp(): Promise<Agent> {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
}

export async function getDeviceFingerprint(): Promise<string> {
  const fp = await getFp();
  const result = await fp.get();
  return result.visitorId;
}

export function getStoredDeviceId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('device_id');
}

export async function getOrCreateDeviceId(): Promise<string> {
  const stored = getStoredDeviceId();
  if (stored) return stored;

  const fingerprint = await getDeviceFingerprint();
  localStorage.setItem('device_id', fingerprint);
  return fingerprint;
}

export function storeInviteCode(code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('invite_code', code);
}

export function getStoredInviteCode(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('invite_code');
}

export function storeNickname(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nickname', name);
}

export function getStoredNickname(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nickname');
}
