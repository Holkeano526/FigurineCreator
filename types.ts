
export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultImageUrl: string | null;
  statusMessage: string;
}

export interface ImageFile {
  file: File;
  preview: string;
}
