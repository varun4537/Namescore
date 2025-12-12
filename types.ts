export interface NameAnalysis {
  score: number;
  verdict: string;
  description: string;
  tags: string[];
  rarityLevel: 'Common' | 'Rare' | 'Legendary' | 'Mythical';
}

export interface ScoreConfig {
  name: string;
}

export enum ViewState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
}

// Declare global confetti type
declare global {
  interface Window {
    confetti: any;
  }
}