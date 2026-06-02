import type { Courseware, Slide, Block, BlockLayout } from '@/types';

export const DEFAULT_BLOCK_LAYOUT: BlockLayout = { x: 0, y: 0, w: 6, h: 2 };

export const COURSEWARE_SCHEMA_VERSION = '1.0.0';

export function createEmptySlide(order: number): Slide {
  return {
    id: crypto.randomUUID(),
    order,
    blocks: [],
  };
}

export function createEmptyCourseware(title = '未命名课件'): Courseware {
  return {
    id: crypto.randomUUID(),
    title,
    subject: '',
    grade: '',
    slideCount: 1,
    style: 'minimal',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: [createEmptySlide(0)],
    settings: {
      style: 'minimal',
      colorScheme: 'cyan-blue',
      fontSize: 'medium',
    },
  };
}

export function validateCourseware(data: unknown): data is Courseware {
  if (!data || typeof data !== 'object') return false;
  const cw = data as Courseware;
  return (
    typeof cw.id === 'string' &&
    typeof cw.title === 'string' &&
    Array.isArray(cw.slides) &&
    cw.slides.every(
      (s: Slide) =>
        typeof s.id === 'string' &&
        typeof s.order === 'number' &&
        Array.isArray(s.blocks)
    )
  );
}

export function generateBlockId(): string {
  return crypto.randomUUID();
}

export function cloneBlock(block: Block): Block {
  return {
    ...JSON.parse(JSON.stringify(block)),
    id: generateBlockId(),
  };
}
