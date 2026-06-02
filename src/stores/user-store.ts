import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  deviceId: string | null;
  inviteCode: string | null;
  nickname: string | null;
  teacherCount: number;
  setDeviceId: (id: string) => void;
  setInviteCode: (code: string) => void;
  setNickname: (name: string) => void;
  setTeacherCount: (count: number) => void;
  isInitialized: boolean;
  setInitialized: (v: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      deviceId: null,
      inviteCode: null,
      nickname: null,
      teacherCount: 0,
      isInitialized: false,
      setDeviceId: (id) => set({ deviceId: id }),
      setInviteCode: (code) => set({ inviteCode: code }),
      setNickname: (name) => set({ nickname: name }),
      setTeacherCount: (count) => set({ teacherCount: count }),
      setInitialized: (v) => set({ isInitialized: v }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        deviceId: state.deviceId,
        inviteCode: state.inviteCode,
        nickname: state.nickname,
      }),
    }
  )
);
