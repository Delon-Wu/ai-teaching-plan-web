export type BlockType = 'title' | 'text' | 'image' | 'chart' | 'formula' | 'question';

export interface BlockLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BaseBlock {
  id: string;
  layout: BlockLayout;
}

export interface TitleBlock extends BaseBlock {
  type: 'title';
  content: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  prompt: string;
  alt: string;
}

export interface ChartBlock extends BaseBlock {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'radar' | 'scatter';
  data: Record<string, unknown>;
}

export interface FormulaBlock extends BaseBlock {
  type: 'formula';
  latex: string;
}

export interface QuestionBlock extends BaseBlock {
  type: 'question';
  stem: string;
  options?: string[];
  answer?: string;
  explanation?: string;
}

export type Block = TitleBlock | TextBlock | ImageBlock | ChartBlock | FormulaBlock | QuestionBlock;

export interface Slide {
  id: string;
  order: number;
  background?: string;
  blocks: Block[];
}

export type PptStyle = 'minimal' | 'business' | 'cartoon' | 'academic' | 'fresh';

export interface CoursewareSettings {
  style: PptStyle;
  colorScheme: string;
  fontSize: 'small' | 'medium' | 'large';
}

export interface Courseware {
  id: string;
  title: string;
  subject: string;
  grade: string;
  slideCount: number;
  style: PptStyle;
  status: 'draft' | 'generating' | 'completed';
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
  settings: CoursewareSettings;
}

export interface CoursewareListItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  slideCount: number;
  style: PptStyle;
  status: 'draft' | 'generating' | 'completed';
  thumbnail?: string;
  updatedAt: string;
}

export interface TaskProgress {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  result?: Courseware;
  error?: string;
}

export interface CreatePptFormData {
  subject: string;
  grade: string;
  topic: string;
  chapter?: string;
  keyPoints?: string;
  duration?: string;
}

export interface CreatePptUploadData {
  file: File;
  additionalRequirements?: string;
}

export interface CreatePptRequest {
  method: 'form' | 'upload';
  formData?: CreatePptFormData;
  style: PptStyle;
  slideCount: number;
  requirements: string;
}

export interface UserInfo {
  deviceId: string;
  inviteCode?: string;
  nickname?: string;
}

export interface FeedbackData {
  content: string;
  email?: string;
  inviteCode?: string;
  page: string;
}
