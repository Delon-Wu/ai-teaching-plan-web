import { create } from 'zustand';

type AiTool = 'expand' | 'rephrase' | 'analogy' | 'image-prompt' | null;

interface EditorState {
  isPreviewOpen: boolean;
  isSidebarOpen: boolean;
  isFeedbackOpen: boolean;
  aiToolLoading: AiTool;
  zoom: number;

  togglePreview: () => void;
  toggleSidebar: () => void;
  toggleFeedback: () => void;
  setAiToolLoading: (tool: AiTool) => void;
  setZoom: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
  isPreviewOpen: false,
  isSidebarOpen: true,
  isFeedbackOpen: false,
  aiToolLoading: null,
  zoom: 1,

  togglePreview: () => set((s) => ({ isPreviewOpen: !s.isPreviewOpen })),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  toggleFeedback: () => set((s) => ({ isFeedbackOpen: !s.isFeedbackOpen })),
  setAiToolLoading: (tool) => set({ aiToolLoading: tool }),
  setZoom: (zoom) => set({ zoom }),
}));
