import { create } from 'zustand';
import type { Courseware, Slide, Block } from '@/types';
import { createEmptyCourseware, createEmptySlide, generateBlockId } from '@/lib/schema';

interface CoursewareState {
  courseware: Courseware | null;
  selectedSlideId: string | null;
  selectedBlockId: string | null;
  isDirty: boolean;
  history: Courseware[];
  historyIndex: number;

  setCourseware: (cw: Courseware) => void;
  newCourseware: () => void;

  selectSlide: (id: string) => void;
  selectBlock: (id: string | null) => void;

  addSlide: (afterIndex?: number) => void;
  deleteSlide: (id: string) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;

  addBlock: (slideId: string, block: Block) => void;
  updateBlock: (slideId: string, blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (slideId: string, blockId: string) => void;
  moveBlock: (slideId: string, blockId: string, layout: { x: number; y: number; w: number; h: number }) => void;

  undo: () => void;
  redo: () => void;
  markClean: () => void;
  getSelectedSlide: () => Slide | undefined;
  getSelectedBlock: () => Block | undefined;
}

function pushHistory(state: CoursewareState): Partial<CoursewareState> {
  if (!state.courseware) return {};
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.courseware)));
  if (newHistory.length > 50) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1, isDirty: true };
}

export const useCoursewareStore = create<CoursewareState>()((set, get) => ({
  courseware: null,
  selectedSlideId: null,
  selectedBlockId: null,
  isDirty: false,
  history: [],
  historyIndex: -1,

  setCourseware: (cw) =>
    set({
      courseware: cw,
      selectedSlideId: cw.slides[0]?.id || null,
      selectedBlockId: null,
      isDirty: false,
      history: [JSON.parse(JSON.stringify(cw))],
      historyIndex: 0,
    }),

  newCourseware: () => {
    const cw = createEmptyCourseware();
    set({
      courseware: cw,
      selectedSlideId: cw.slides[0]?.id || null,
      selectedBlockId: null,
      isDirty: false,
      history: [JSON.parse(JSON.stringify(cw))],
      historyIndex: 0,
    });
  },

  selectSlide: (id) => set({ selectedSlideId: id, selectedBlockId: null }),
  selectBlock: (id) => set({ selectedBlockId: id }),

  addSlide: (afterIndex) =>
    set((state) => {
      if (!state.courseware) return state;
      const order = afterIndex !== undefined ? afterIndex + 1 : state.courseware.slides.length;
      const newSlide = createEmptySlide(order);
      const slides = [...state.courseware.slides];
      slides.splice(order, 0, newSlide);
      slides.forEach((s, i) => (s.order = i));
      const updated = {
        ...state.courseware,
        slides,
        slideCount: slides.length,
        updatedAt: new Date().toISOString(),
      };
      return { ...pushHistory({ ...state, courseware: updated }), courseware: updated, selectedSlideId: newSlide.id };
    }),

  deleteSlide: (id) =>
    set((state) => {
      if (!state.courseware || state.courseware.slides.length <= 1) return state;
      const slides = state.courseware.slides.filter((s) => s.id !== id);
      slides.forEach((s, i) => (s.order = i));
      const updated = {
        ...state.courseware,
        slides,
        slideCount: slides.length,
        updatedAt: new Date().toISOString(),
      };
      const newSelected = state.selectedSlideId === id ? slides[0]?.id : state.selectedSlideId;
      return { ...pushHistory({ ...state, courseware: updated }), courseware: updated, selectedSlideId: newSelected };
    }),

  updateSlide: (id, updates) =>
    set((state) => {
      if (!state.courseware) return state;
      const slides = state.courseware.slides.map((s) => (s.id === id ? { ...s, ...updates } : s));
      const updated = { ...state.courseware, slides, updatedAt: new Date().toISOString() };
      return { ...pushHistory({ ...state, courseware: updated }), courseware: updated };
    }),

  reorderSlides: (fromIndex, toIndex) =>
    set((state) => {
      if (!state.courseware) return state;
      const slides = [...state.courseware.slides];
      const [moved] = slides.splice(fromIndex, 1);
      slides.splice(toIndex, 0, moved);
      slides.forEach((s, i) => (s.order = i));
      const updated = { ...state.courseware, slides, updatedAt: new Date().toISOString() };
      return { ...pushHistory({ ...state, courseware: updated }), courseware: updated };
    }),

  addBlock: (slideId, block) =>
    set((state) => {
      if (!state.courseware) return state;
      const slides = state.courseware.slides.map((s) =>
        s.id === slideId ? { ...s, blocks: [...s.blocks, block] } : s
      );
      const updated = { ...state.courseware, slides, updatedAt: new Date().toISOString() };
      return { ...pushHistory({ ...state, courseware: updated }), courseware: updated, selectedBlockId: block.id };
    }),

  updateBlock: (slideId, blockId, updates) =>
    set((state) => {
      if (!state.courseware) return state;
      const slides = state.courseware.slides.map((s) =>
        s.id === slideId
          ? { ...s, blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } as Block : b)) }
          : s
      );
      const updated = { ...state.courseware, slides, updatedAt: new Date().toISOString() };
      return { ...pushHistory({ ...state, courseware: updated }), courseware: updated };
    }),

  deleteBlock: (slideId, blockId) =>
    set((state) => {
      if (!state.courseware) return state;
      const slides = state.courseware.slides.map((s) =>
        s.id === slideId ? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) } : s
      );
      const updated = { ...state.courseware, slides, updatedAt: new Date().toISOString() };
      return { ...pushHistory({ ...state, courseware: updated }), courseware: updated, selectedBlockId: null };
    }),

  moveBlock: (slideId, blockId, layout) =>
    set((state) => {
      if (!state.courseware) return state;
      const slides = state.courseware.slides.map((s) =>
        s.id === slideId
          ? { ...s, blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, layout } as Block : b)) }
          : s
      );
      const updated = { ...state.courseware, slides, updatedAt: new Date().toISOString() };
      return { ...pushHistory({ ...state, courseware: updated }), courseware: updated };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return { courseware: JSON.parse(JSON.stringify(state.history[newIndex])), historyIndex: newIndex, isDirty: true };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return { courseware: JSON.parse(JSON.stringify(state.history[newIndex])), historyIndex: newIndex, isDirty: true };
    }),

  markClean: () => set({ isDirty: false }),

  getSelectedSlide: () => {
    const { courseware, selectedSlideId } = get();
    return courseware?.slides.find((s) => s.id === selectedSlideId);
  },

  getSelectedBlock: () => {
    const { courseware, selectedSlideId, selectedBlockId } = get();
    const slide = courseware?.slides.find((s) => s.id === selectedSlideId);
    return slide?.blocks.find((b) => b.id === selectedBlockId);
  },
}));
