export type ArtStyle = 'anime' | 'cyberpunk' | 'ghibli' | 'manga';

export interface DreamPanel {
  id: string;
  sceneDescription: string;
  emotion: string;
  imageUrl?: string;
  prompt?: string;
}

export interface Dream {
  _id?: string;
  id: string;
  userId: string;
  input: string; // The raw text
  interpretedNarrative?: string; // LLM cleaned version
  style: ArtStyle;
  panels: DreamPanel[]; // Legacy format
  comicImageUrl?: string; // New: Single image with all panels
  panelCount?: number; // New: Number of panels (3-6)
  imagePrompt?: string; // New: Prompt used for generation
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}
