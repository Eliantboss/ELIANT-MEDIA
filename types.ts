
export interface UploadedImage {
  id: string;
  data: string; // Base64
  mimeType: string;
}

export interface SceneItem {
  id: string;
  label: string;
  action: 'preserve' | 'add' | 'remove' | 'modify' | 'generate_similar';
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type ImageSize = "1K" | "2K" | "4K";

export type SubjectAngle = "Default" | "Portrait" | "Low Angle" | "Side Profile" | "Three-Quarter";

export type ColorGrade = "Natural" | "Cinematic Teal & Orange" | "Vintage Film" | "Noir B&W" | "Warm Golden Hour" | "Cyberpunk" | "Muted Professional";

export interface RetouchConfig {
  grade: ColorGrade;
  intensity: 'Soft' | 'Medium' | 'High';
  backgroundHarmonization: boolean;
  eyeEnhancement: boolean;
}

export interface SubjectConfig {
  angle: SubjectAngle;
  faceRefinement: boolean;
  skinDetail: boolean;
  lightingMatch: boolean;
  backgroundFidelity: boolean;
  sessionIntegrity: boolean;
}

export interface BackgroundConfig {
  removeBackground: boolean;
  neutralizeBackground: boolean;
}

export interface EnhancementConfig {
  upscale: boolean;
  removeArtifacts: boolean;
  hyperrealism: boolean;
}

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  subject?: SubjectConfig;
  retouch?: RetouchConfig;
  background?: BackgroundConfig;
  enhancement?: EnhancementConfig;
}

export interface GenerationResult {
  imageUrl: string;
  textResponse?: string;
  originalConfig?: GenerationConfig;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  UPSCALING = 'UPSCALING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NEEDS_KEY = 'NEEDS_KEY'
}
