'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/user-store';
import { getOrCreateDeviceId, getStoredInviteCode, getStoredNickname } from '@/lib/device';

export function useDeviceId() {
  const { deviceId, setDeviceId, inviteCode, setInviteCode, nickname, setNickname, isInitialized, setInitialized } =
    useUserStore();

  useEffect(() => {
    if (isInitialized) return;

    async function init() {
      const id = await getOrCreateDeviceId();
      setDeviceId(id);

      const storedCode = getStoredInviteCode();
      if (storedCode) setInviteCode(storedCode);

      const storedName = getStoredNickname();
      if (storedName) setNickname(storedName);

      setInitialized(true);
    }

    init();
  }, [isInitialized, setDeviceId, setInviteCode, setNickname, setInitialized]);

  return { deviceId, inviteCode, nickname, isInitialized };
}
